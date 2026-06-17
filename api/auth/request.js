import { Resend } from 'resend';
import crypto from 'crypto';
import { createHmac } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateToken(email) {
  const expiresAt = Date.now() + parseInt(process.env.MAGIC_LINK_EXPIRES_IN || 3600) * 1000;
  const data = JSON.stringify({ email, expiresAt });

  // Create HMAC signature
  const hmac = createHmac('sha256', process.env.SESSION_SECRET || 'default-secret');
  hmac.update(data);
  const signature = hmac.digest('hex');

  // Combine data + signature (Base64 encoded)
  const token = Buffer.from(`${data}::${signature}`).toString('base64');
  return token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email format
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const trimmedEmail = email.toLowerCase().trim();

  // Check if email is approved
  const approvedEmails = (process.env.APPROVED_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

  if (!approvedEmails.includes(trimmedEmail)) {
    // Don't reveal if email exists (security best practice)
    return res.status(200).json({ message: 'If email is approved, a magic link will be sent' });
  }

  // Generate signed token (no storage needed)
  const token = generateToken(trimmedEmail);

  // Build magic link
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const magicLink = `${protocol}://${host}/verify?token=${token}`;

  try {
    // Send email via Resend
    await resend.emails.send({
      from: 'noreply@spoke.nz',
      to: trimmedEmail,
      subject: 'Your Magic Login Link - Spoke OS',
      html: `
        <h2>Welcome to Spoke OS</h2>
        <p>Click the link below to log in. This link expires in 1 hour.</p>
        <p><a href="${magicLink}" style="background-color: #BEDA81; color: #1A1418; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Log In</a></p>
        <p>Or copy this link: <code>${magicLink}</code></p>
        <p>If you didn't request this link, you can safely ignore this email.</p>
      `
    });

    return res.status(200).json({
      message: 'Magic link sent to your email'
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
