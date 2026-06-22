import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Map email addresses to their TOTP secret environment variable keys
const USER_TO_TOTP_KEY = {
  'arne@spoke.nz': 'AUTH_TOTP_ARNE',
  'mark@spoke.nz': 'AUTH_TOTP_MARK',
  'jherd@focusplan.co.nz': 'AUTH_TOTP_JONATHAN',
  'sage@spoke.nz': 'AUTH_TOTP_SAGE',
  'edward@spoke.nz': 'AUTH_TOTP_EDWARD'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  console.log('[TOTP-SETUP] Username received:', username);

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  try {
    // Extract just the username part (before @ if email) for setup tracking
    const usernamePart = username.split('@')[0];
    // Get the correct TOTP key from the mapping
    const envKey = USER_TO_TOTP_KEY[username.toLowerCase()] || `AUTH_TOTP_${usernamePart.toUpperCase()}`;

    // Check if user has already completed setup
    const setupUsers = (process.env.SETUP_USERS || '').split(',').map(u => u.trim().toLowerCase()).filter(u => u);
    const isAlreadySetup = setupUsers.includes(usernamePart.toLowerCase());

    console.log('[TOTP-SETUP] Setup users list:', setupUsers);
    console.log('[TOTP-SETUP] Is already setup:', isAlreadySetup);

    if (isAlreadySetup) {
      console.log('[TOTP-SETUP] User already set up, denying QR code generation');
      return res.status(400).json({
        error: 'already_setup',
        message: 'You have already set up your authenticator. Enter your 6-digit code below.'
      });
    }

    console.log('[TOTP-SETUP] Looking for env key:', envKey);
    console.log('[TOTP-SETUP] Available env keys:', Object.keys(process.env).filter(k => k.startsWith('AUTH_TOTP')));

    let totpSecret = process.env[envKey];

    if (!totpSecret) {
      console.log('[TOTP-SETUP] Secret not found for:', envKey);
      return res.status(400).json({
        error: 'TOTP secret not configured for this user',
        key: envKey,
        help: 'Administrator needs to add this to Vercel environment variables'
      });
    }

    console.log('[TOTP-SETUP] Secret found, generating QR code');

    console.log(`[TOTP] Using secret for user: ${username}`);

    // Generate QR code URL using the user's secret
    const otpauthUrl = speakeasy.otpauthURL({
      secret: totpSecret,
      encoding: 'base32',
      label: `Spoke OS (${username})`,
      issuer: 'Spoke'
    });

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    res.status(200).json({
      secret: totpSecret,
      qrCode: qrCode,
      user: username,
      isFirstTime: true
    });
  } catch (error) {
    console.error('TOTP setup error:', error);
    res.status(500).json({ error: 'Failed to generate TOTP setup' });
  }
}
