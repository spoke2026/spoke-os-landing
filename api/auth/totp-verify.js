import speakeasy from 'speakeasy';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  const totp_secret = process.env.TOTP_SECRET;

  console.log('[TOTP] Verification attempt:', {
    code: code,
    hasSecret: !!totp_secret,
    secretLength: totp_secret?.length
  });

  if (!code || !totp_secret) {
    console.log('[TOTP] Missing code or secret');
    return res.status(400).json({ error: 'Invalid request', missing: !code ? 'code' : 'secret' });
  }

  try {
    // Verify the TOTP code - convert to string and remove any whitespace
    const codeStr = String(code).trim();
    console.log('[TOTP] Verifying code:', codeStr, 'length:', codeStr.length);

    const verified = speakeasy.totp.verify({
      secret: totp_secret,
      encoding: 'base32',
      token: codeStr,
      window: 2 // Allow codes from ±30 seconds
    });

    console.log('[TOTP] Verification result:', verified);

    if (!verified) {
      console.log('[TOTP] Code verification failed');
      return res.status(401).json({ error: 'Invalid code' });
    }

    console.log('[TOTP] Code verified, creating session');

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Set httpOnly cookie with session
    const cookieHeader = `auth_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`;
    console.log('[TOTP] Setting cookie:', cookieHeader);
    res.setHeader('Set-Cookie', cookieHeader);

    console.log('[TOTP] Session created, redirecting to dashboard');

    res.status(200).json({
      authenticated: true,
      message: 'Successfully authenticated'
    });
  } catch (error) {
    console.error('[TOTP] Verification error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
}
