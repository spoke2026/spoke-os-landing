export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear auth cookie
  res.setHeader(
    'Set-Cookie',
    'auth_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  );

  return res.status(200).json({ message: 'Logged out successfully' });
}
