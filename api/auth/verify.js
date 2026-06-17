import { createHmac } from 'crypto';

function verifyToken(token) {
  try {
    // Decode the Base64 token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [data, signature] = decoded.split('::');

    if (!data || !signature) {
      return { valid: false };
    }

    // Verify HMAC signature
    const hmac = createHmac('sha256', process.env.SESSION_SECRET || 'default-secret');
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    // Parse and validate data
    const payload = JSON.parse(data);
    const { email, expiresAt } = payload;

    // Check expiration
    if (expiresAt < Date.now()) {
      return { valid: false, expired: true };
    }

    return { valid: true, email };
  } catch (error) {
    return { valid: false };
  }
}

function createSessionToken(email) {
  const expiresAt = Date.now() + parseInt(process.env.SESSION_EXPIRES_IN || 86400) * 1000;
  const data = JSON.stringify({ email, expiresAt, type: 'session' });

  const hmac = createHmac('sha256', process.env.SESSION_SECRET || 'default-secret');
  hmac.update(data);
  const signature = hmac.digest('hex');

  return Buffer.from(`${data}::${signature}`).toString('base64');
}

function setAuthCookie(res, sessionToken, expiresIn) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  res.setHeader('Set-Cookie', `auth_token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expiresAt.toUTCString()}`);
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).html = 'Invalid or missing token';
    res.statusCode = 400;
    res.end();
    return;
  }

  // Verify the magic link token
  const verification = verifyToken(token);

  if (!verification.valid) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>Login Failed</h1>
          <p>${verification.expired ? 'Your magic link has expired. Please request a new one.' : 'Invalid or expired token.'}</p>
          <a href="/login.html" style="color: #BEDA81;">Back to login</a>
        </body>
      </html>
    `);
    return;
  }

  // Create session token
  const sessionToken = createSessionToken(verification.email);
  const sessionExpiresIn = parseInt(process.env.SESSION_EXPIRES_IN || 86400);

  // Set secure cookie
  setAuthCookie(res, sessionToken, sessionExpiresIn);

  // Redirect to dashboard
  res.statusCode = 307;
  res.setHeader('Location', '/dashboard.html');
  res.end();
}
