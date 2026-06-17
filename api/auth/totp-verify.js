import speakeasy from 'speakeasy';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  const totp_secret = process.env.TOTP_SECRET;

  if (!code || !totp_secret) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: totp_secret,
      encoding: 'base32',
      token: code,
      window: 2 // Allow codes from ±30 seconds
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionSecret = process.env.SESSION_SECRET || 'dev-secret-key';
    const payload = {
      authenticated: true,
      timestamp: Date.now(),
      token: sessionToken
    };

    // Create HMAC signature
    const hmac = crypto
      .createHmac('sha256', sessionSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    // Set httpOnly cookie with session
    res.setHeader(
      'Set-Cookie',
      `auth_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
    );

    res.status(200).json({
      authenticated: true,
      message: 'Successfully authenticated'
    });
  } catch (error) {
    console.error('TOTP verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
