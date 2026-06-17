import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const totpSecret = process.env.TOTP_SECRET;

    if (!totpSecret) {
      return res.status(500).json({ error: 'TOTP not configured' });
    }

    // Generate QR code URL using the environment secret
    const otpauthUrl = speakeasy.otpauthURL({
      secret: totpSecret,
      encoding: 'base32',
      label: 'Spoke OS',
      issuer: 'Spoke'
    });

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    res.status(200).json({
      secret: totpSecret,
      qrCode: qrCode
    });
  } catch (error) {
    console.error('TOTP setup error:', error);
    res.status(500).json({ error: 'Failed to generate TOTP setup' });
  }
}
