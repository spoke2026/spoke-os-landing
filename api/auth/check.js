export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const cookies = req.headers.cookie || '';
  const authToken = cookies
    .split('; ')
    .find(row => row.startsWith('auth_session='))
    ?.split('=')[1];

  if (!authToken) {
    return res.status(401).json({ authenticated: false });
  }

  // Token exists and is not expired (browser handles httpOnly cookie expiration)
  return res.status(200).json({ authenticated: true });
}
