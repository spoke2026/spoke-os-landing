export default function handler(req, res) {
  const cookies = req.headers.cookie || '';
  const authToken = cookies
    .split('; ')
    .find(row => row.startsWith('auth_session='))
    ?.split('=')[1];

  res.status(200).json({
    headers: {
      cookie: req.headers.cookie,
      allHeaders: Object.keys(req.headers)
    },
    authToken: authToken || 'NOT FOUND',
    parsedCookies: cookies.split('; '),
    timestamp: new Date().toISOString()
  });
}
