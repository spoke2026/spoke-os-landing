import { createHmac } from 'crypto';

function verifySessionToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [data, signature] = decoded.split('::');

    if (!data || !signature) {
      return { valid: false };
    }

    const hmac = createHmac('sha256', process.env.SESSION_SECRET || 'default-secret');
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    const payload = JSON.parse(data);
    const { email, expiresAt, type } = payload;

    if (type !== 'session') {
      return { valid: false };
    }

    if (expiresAt < Date.now()) {
      return { valid: false, expired: true };
    }

    return { valid: true, email };
  } catch (error) {
    return { valid: false };
  }
}

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const cookies = req.headers.cookie || '';
  const authToken = cookies
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!authToken) {
    return res.status(401).json({ authenticated: false });
  }

  const verification = verifySessionToken(authToken);

  if (!verification.valid) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    email: verification.email
  });
}
