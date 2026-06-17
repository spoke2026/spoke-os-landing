import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const validUsername = process.env.AUTH_USERNAME || 'edward';
  const validPassword = process.env.AUTH_PASSWORD || 'spoke2026';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (username !== validUsername || password !== validPassword) {
    console.log('[AUTH] Invalid credentials attempt');
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  console.log('[AUTH] Password verified for user:', username);

  // Generate a temporary token for this session
  const tempToken = crypto.randomBytes(32).toString('hex');

  res.status(200).json({
    authenticated: true,
    token: tempToken,
    message: 'Credentials verified. Please complete authentication.'
  });
}
