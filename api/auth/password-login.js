import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Parse users from environment variable (JSON format)
  let users = {};
  try {
    if (process.env.USERS_CONFIG) {
      users = JSON.parse(process.env.USERS_CONFIG);
    }
  } catch (error) {
    console.error('[AUTH] Failed to parse USERS_CONFIG:', error);
  }

  // Check if user exists and password matches
  const user = users[username.toLowerCase()];
  if (!user || user.password !== password) {
    console.log('[AUTH] Invalid credentials attempt for:', username);
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
