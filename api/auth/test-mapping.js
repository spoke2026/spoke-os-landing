// Test endpoint to verify user-to-TOTP key mapping without side effects
export default async function handler(req, res) {
  const { testUser } = req.query;

  const USER_TO_TOTP_KEY = {
    'arne@spoke.nz': 'AUTH_TOTP_ARNE',
    'mark@spoke.nz': 'AUTH_TOTP_MARK',
    'jherd@focusplan.co.nz': 'AUTH_TOTP_JONATHAN',
    'sage@spoke.nz': 'AUTH_TOTP_SAGE',
    'edward@spoke.nz': 'AUTH_TOTP_EDWARD'
  };

  if (!testUser) {
    return res.status(400).json({
      error: 'testUser parameter required',
      example: '/api/auth/test-mapping?testUser=jherd@focusplan.co.nz'
    });
  }

  const userEmail = testUser.toLowerCase();
  const mappedKey = USER_TO_TOTP_KEY[userEmail];
  const secretExists = !!process.env[mappedKey];
  const setupUsers = (process.env.SETUP_USERS || '').split(',').map(u => u.trim().toLowerCase()).filter(u => u);
  const usernamePart = userEmail.split('@')[0];
  const isAlreadySetup = setupUsers.includes(usernamePart);

  res.status(200).json({
    testUser: userEmail,
    mappedToTOTPKey: mappedKey || 'NOT FOUND',
    secretConfigured: secretExists,
    secretValue: secretExists ? '***HIDDEN***' : null,
    setupUsers: setupUsers,
    usernamePart: usernamePart,
    isAlreadySetup: isAlreadySetup,
    wouldShowQRCode: !isAlreadySetup && secretExists,
    status: !isAlreadySetup && secretExists ? '✅ QR CODE WOULD SHOW' : '❌ QR CODE WOULD NOT SHOW'
  });
}
