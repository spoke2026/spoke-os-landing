export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.AUTH_PASSWORD;

  if (!password || !correctPassword) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  if (password !== correctPassword) {
    console.log('[AUTH] Invalid password attempt');
    return res.status(401).json({ error: 'Invalid password' });
  }

  console.log('[AUTH] Password verified, setting session');

  // Set a simple session cookie
  const sessionToken = Buffer.from(JSON.stringify({
    authenticated: true,
    timestamp: Date.now()
  })).toString('base64');

  res.setHeader(
    'Set-Cookie',
    `auth_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
  );

  res.status(200).json({
    authenticated: true,
    message: 'Successfully authenticated'
  });
}
