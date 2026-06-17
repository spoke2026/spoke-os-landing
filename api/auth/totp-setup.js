import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const secret = speakeasy.generateSecret({
      name: 'Spoke OS',
      issuer: 'Spoke',
      length: 32
    });

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrCode
    });
  } catch (error) {
    console.error('TOTP setup error:', error);
    res.status(500).json({ error: 'Failed to generate TOTP setup' });
  }
}
