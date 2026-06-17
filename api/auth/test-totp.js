import speakeasy from 'speakeasy';

export default function handler(req, res) {
  const totp_secret = process.env.TOTP_SECRET;
  const testCode = req.query.code;

  if (!totp_secret) {
    return res.status(500).json({ error: 'TOTP_SECRET not set in environment' });
  }

  try {
    // Generate the current valid TOTP code
    const token = speakeasy.totp({
      secret: totp_secret,
      encoding: 'base32'
    });

    // If a test code is provided, verify it
    let testVerificationResult = null;
    if (testCode) {
      testVerificationResult = speakeasy.totp.verify({
        secret: totp_secret,
        encoding: 'base32',
        token: String(testCode).trim(),
        window: 2
      });
    }

    // Also test verification with the generated token
    const verified = speakeasy.totp.verify({
      secret: totp_secret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    res.status(200).json({
      status: 'OK',
      current_code: token,
      current_code_verified: verified,
      test_code: testCode || 'not provided',
      test_code_verified: testVerificationResult,
      help: 'Add ?code=123456 to test a specific code'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
