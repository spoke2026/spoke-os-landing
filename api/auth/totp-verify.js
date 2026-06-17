import speakeasy from 'speakeasy';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  // Get per-user TOTP secret from environment
  const envKey = `AUTH_TOTP_${username.toUpperCase()}`;
  const totp_secret = process.env[envKey];

  const debugInfo = {
    timestamp: new Date().toISOString(),
    code_received: code,
    code_type: typeof code,
    code_length: String(code).length,
    secret_exists: !!totp_secret,
    secret_length: totp_secret?.length,
    secret_first_chars: totp_secret?.substring(0, 10) + '...'
  };

  console.log('[TOTP] VERIFICATION ATTEMPT:', JSON.stringify(debugInfo));

  if (!code || !totp_secret) {
    console.log('[TOTP] MISSING:', { code: !!code, secret: !!totp_secret });
    return res.status(400).json({ error: 'Invalid request', debug: debugInfo });
  }

  try {
    const codeStr = String(code).trim();

    // Generate what the current code SHOULD be
    const expectedCode = speakeasy.totp({
      secret: totp_secret,
      encoding: 'base32'
    });

    console.log('[TOTP] CODE COMPARISON:', {
      received: codeStr,
      expected: expectedCode,
      match: codeStr === expectedCode
    });

    // Try verification with different window sizes to see what works
    const verify0 = speakeasy.totp.verify({
      secret: totp_secret,
      encoding: 'base32',
      token: codeStr,
      window: 0
    });

    const verify2 = speakeasy.totp.verify({
      secret: totp_secret,
      encoding: 'base32',
      token: codeStr,
      window: 2
    });

    const verify4 = speakeasy.totp.verify({
      secret: totp_secret,
      encoding: 'base32',
      token: codeStr,
      window: 4
    });

    console.log('[TOTP] VERIFY RESULTS:', {
      window_0: verify0,
      window_2: verify2,
      window_4: verify4
    });

    const verified = verify2 || verify4;

    if (!verified) {
      console.log('[TOTP] VERIFICATION FAILED - Code mismatch');
      return res.status(401).json({
        error: 'Invalid code',
        debug: {
          received: codeStr,
          expected: expectedCode,
          verify_window_0: verify0,
          verify_window_2: verify2,
          verify_window_4: verify4
        }
      });
    }

    console.log('[TOTP] CODE VERIFIED - Creating session');

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const cookieHeader = `auth_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`;

    console.log('[TOTP] SETTING COOKIE');
    res.setHeader('Set-Cookie', cookieHeader);

    res.status(200).json({
      authenticated: true,
      message: 'Successfully authenticated',
      debug: { sessionToken: sessionToken.substring(0, 10) + '...' }
    });
  } catch (error) {
    console.error('[TOTP] ERROR:', error.message, error.stack);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
}
