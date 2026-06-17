import crypto from 'crypto';

// Simple user list - add users as AUTH_<USERNAME_PART>=<password>
// e.g., AUTH_ARNE=spoke.arne.beatson
const VALID_USERS = {
  'arne@spoke.nz': process.env.AUTH_ARNE,
  'mark@spoke.nz': process.env.AUTH_MARK,
  'jherd@focusplan.co.nz': process.env.AUTH_JONATHAN,
  'sage@spoke.nz': process.env.AUTH_SAGE,
  'edward@spoke.nz': process.env.AUTH_EDWARD
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const validPassword = VALID_USERS[username.toLowerCase()];

  if (!validPassword || password !== validPassword) {
    console.log('[AUTH] Invalid credentials for:', username);
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
