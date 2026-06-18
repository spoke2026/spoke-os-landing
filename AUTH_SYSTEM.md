# Spoke OS - Secure Authentication System

## Overview

Two-factor authentication using **Username + Password** + **Google Authenticator (TOTP)**.

Once a user has set up their authenticator and logged in successfully, the QR code will **never be displayed again**, regardless of which device or browser they use. This is enforced server-side.

## Required Environment Variables (Vercel)

### Passwords (Required)
```
AUTH_ARNE = <password>
AUTH_MARK = <password>
AUTH_JONATHAN = <password>
AUTH_SAGE = <password>
AUTH_EDWARD = <password>
```

### TOTP Secrets (Required)
```
AUTH_TOTP_ARNE = <base32-secret>
AUTH_TOTP_MARK = <base32-secret>
AUTH_TOTP_JONATHAN = <base32-secret>
AUTH_TOTP_SAGE = <base32-secret>
AUTH_TOTP_EDWARD = <base32-secret>
```

### Setup Tracking (Optional but Important)
```
SETUP_USERS = arne,mark,jonathan,sage,edward
```

This comma-separated list tracks which users have **completed their first-time setup**. Once a user has scanned the QR code and verified their authenticator, add them to this list.

## User Workflow

### First-Time Login
1. Go to `/login.html`
2. Enter email (e.g., `arne@spoke.nz`) + password
3. **QR Code is displayed** → Scan with Google Authenticator
4. Enter 6-digit code from Authenticator
5. Login succeeds → Redirected to `/index.html`

### Subsequent Logins (Same or Different Device)
1. Go to `/login.html`
2. Enter email + password
3. **NO QR Code shown** → Just code input field
4. Enter 6-digit code from Authenticator
5. Login succeeds

## Admin Setup Workflow

### Initial Setup (First Time User)
1. User attempts login and sees the QR code
2. User scans QR with Google Authenticator
3. User enters the 6-digit code
4. **Watch the Vercel logs** for message:
   ```
   [TOTP] IMPORTANT: Admin must add 'username' to SETUP_USERS env var on Vercel...
   ```

### Mark User as Installed
After user has successfully verified their code:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find or create `SETUP_USERS` variable
3. Add the username to the comma-separated list
   ```
   Before: SETUP_USERS = arne,mark
   After:  SETUP_USERS = arne,mark,jonathan,sage
   ```
4. Save changes (deployment automatic)

## Security Features

✅ **QR Code Never Displayed Again** - After first setup, only the code input is shown  
✅ **Server-Side Enforcement** - Even if user clears browser cache or logs in from new device, no QR  
✅ **No Password Storage** - TOTP secrets are environment variables, passwords are env variables  
✅ **HttpOnly Cookies** - Session token can't be stolen via JavaScript  
✅ **Secure Flag** - Cookies only sent over HTTPS  
✅ **Time-Based Codes** - 30-second window with time-skew tolerance  

## Troubleshooting

### "QR Code not showing on first login"
- User might already be in `SETUP_USERS` list
- Check Vercel logs for errors

### "Code is invalid even though Google Authenticator shows correct code"
- Check server/user device clocks are synchronized
- TOTP codes are time-sensitive (30-second window)
- Check `AUTH_TOTP_<USERNAME>` is set correctly in Vercel env vars

### "QR Code is showing on second login from different device"
- User's username is not in `SETUP_USERS` list
- Add them to Vercel environment variable `SETUP_USERS`

### "Verification logs show but user still says QR appears"
- May be browser cache
- Have user clear cookies and try again
- Or check if username in SETUP_USERS matches their login format

## Monitoring

Check Vercel deployment logs for:
- `[AUTH]` messages for password verification
- `[TOTP]` messages for code verification
- `[TOTP-SETUP]` messages for QR code setup

If you see:
```
[TOTP] IMPORTANT: Admin must add 'username' to SETUP_USERS...
```

This is a reminder to update the environment variable.

## Files

- `login.html` - Login page with 2-step process
- `api/auth/password-login.js` - Verify username + password
- `api/auth/totp-setup.js` - Generate QR code (only if not in SETUP_USERS)
- `api/auth/totp-verify.js` - Verify 6-digit code and create session
- `api/auth/logout.js` - Clear session cookie
