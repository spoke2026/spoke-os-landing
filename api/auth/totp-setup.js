import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Extract just the username part (before @ if email)
    const usernamePart = username.split('@')[0];

    // Get per-user TOTP secret from environment (e.g., AUTH_TOTP_edward)
    const envKey = `AUTH_TOTP_${usernamePart.toUpperCase()}`;
    let totpSecret = process.env[envKey];

    if (!totpSecret) {
      // Secret not found - return error with instructions
      return res.status(400).json({
        error: 'User TOTP secret not configured',
        message: `Please add ${envKey} to environment variables in Vercel`,
        help: 'Contact administrator to set up your authenticator'
      });
    }

    console.log(`[TOTP] Using secret for user: ${username}`);

    // Generate QR code URL using the user's secret
    const otpauthUrl = speakeasy.otpauthURL({
      secret: totpSecret,
      encoding: 'base32',
      label: `Spoke OS (${username})`,
      issuer: 'Spoke'
    });

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    res.status(200).json({
      secret: totpSecret,
      qrCode: qrCode,
      user: username
    });
  } catch (error) {
    console.error('TOTP setup error:', error);
    res.status(500).json({ error: 'Failed to generate TOTP setup' });
  }
}
