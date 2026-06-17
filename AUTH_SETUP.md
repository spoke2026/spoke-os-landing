# Spoke OS Authentication Setup Guide

## Overview

Your site now has a secure magic link authentication system using:
- **Magic links** sent via email (1 hour expiration)
- **Signed JWT tokens** (no database needed)
- **Secure httpOnly cookies** (24 hour session)
- **HMAC signature verification** (tamper-proof)

## Setup Steps

### 1. Get a Resend API Key

1. Go to https://resend.com
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the key

### 2. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
RESEND_API_KEY = your_api_key_from_above
APPROVED_EMAILS = edward@spoke.nz,arne@spoke.nz,mark@spoke.nz,sage@spoke.nz,jherd@focusplan.co.nz
SESSION_SECRET = generate_a_random_string_min_32_characters
MAGIC_LINK_EXPIRES_IN = 3600
SESSION_EXPIRES_IN = 86400
```

**How to generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Add secure authentication system"
git push
```

Vercel will automatically deploy your changes.

## Usage

### For Users

1. Go to `os.spoke.nz/login.html`
2. Enter their approved email
3. Check their email for the magic link
4. Click the link - they're logged in!
5. Session lasts 24 hours
6. Click "Logout" to sign out

### For Admins - Changing Approved Emails

To add/remove users from the approved list:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Edit `APPROVED_EMAILS`
4. Save changes - deployment happens automatically

## Files Created

- `login.html` - Login page with email form
- `verify.html` - Magic link verification page
- `dashboard.html` - Protected dashboard (template)
- `api/auth/request.js` - Request magic link endpoint
- `api/auth/verify.js` - Verify magic link & set session
- `api/auth/check.js` - Check if user is authenticated
- `api/auth/logout.js` - Clear session

## Security Features

✅ **No password storage** - Magic links only  
✅ **No database needed** - Signed tokens  
✅ **HMAC signed** - Tokens can't be forged  
✅ **HttpOnly cookies** - Can't be accessed by JavaScript  
✅ **Secure flag** - Only sent over HTTPS  
✅ **SameSite=Strict** - CSRF protection  
✅ **Expiring links** - 1 hour magic links  
✅ **Expiring sessions** - 24 hour sessions  

## Protecting Pages

Your `dashboard.html` already has authentication built in. To protect other pages:

1. Add this to the `<head>`:
```html
<script>
async function checkAuth() {
  const res = await fetch('/api/auth/check');
  const data = await res.json();
  if (!data.authenticated) {
    window.location.href = '/login.html';
  }
}
document.addEventListener('DOMContentLoaded', checkAuth);
</script>
```

2. Wrap your content in:
```html
<div id="authGate" class="auth-gate" style="display: none;">
  <h2>Authenticating...</h2>
</div>

<div id="content" style="display: none;">
  <!-- Your protected content here -->
</div>

<script>
async function checkAuth() {
  const res = await fetch('/api/auth/check');
  const data = await res.json();
  if (data.authenticated) {
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  } else {
    window.location.href = '/login.html';
  }
}
document.addEventListener('DOMContentLoaded', checkAuth);
</script>
```

## Troubleshooting

**"Magic link not received"**
- Check spam/junk folder
- Verify email is in APPROVED_EMAILS list
- Check RESEND_API_KEY is correct

**"Token is invalid"**
- Make sure SESSION_SECRET hasn't changed
- Magic links expire after 1 hour

**"Logout not working"**
- Clear browser cookies and try again

## Next Steps

1. ✅ Set up Resend API key
2. ✅ Add environment variables to Vercel
3. ✅ Push code to GitHub
4. ✅ Test login at `os.spoke.nz/login.html`
5. ✅ Share `os.spoke.nz/dashboard.html` with authorized users

Need help? Check the Vercel logs: **Deployments** → **View Logs**
