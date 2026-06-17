import speakeasy from 'speakeasy';

export default function handler(req, res) {
  const totp_secret = process.env.TOTP_SECRET;

  if (!totp_secret) {
    return res.status(500).json({ error: 'TOTP_SECRET not set in environment' });
  }

  try {
    // Generate the current valid TOTP code
    const token = speakeasy.totp({
      secret: totp_secret,
      encoding: 'base32'
    });

    // Also test verification with the generated token
    const verified = speakeasy.totp.verify({
      secret: totp_secret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    // Generate OTPauth URL for QR code
    const otpauthUrl = speakeasy.otpauthURL({
      secret: totp_secret,
      encoding: 'base32',
      label: 'Spoke OS',
      issuer: 'Spoke'
    });

    res.status(200).json({
      status: 'OK',
      totp_secret: totp_secret,
      secret_length: totp_secret.length,
      current_valid_code: token,
      code_verified: verified,
      otpauth_url: otpauthUrl,
      instructions: [
        '1. Open Google Authenticator',
        '2. Check if the code shown matches: ' + token,
        '3. If yes, use that code to login',
        '4. If no, your phone time might be out of sync'
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
