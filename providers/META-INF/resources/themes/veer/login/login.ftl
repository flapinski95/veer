<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login – Veer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Inter, sans-serif; background: #f3f4f6; display:flex; align-items:center; justify-content:center; min-height:100vh; }
    .login-box { background:#fff; padding:2rem; border-radius:12px; width:100%; max-width:400px; box-shadow:0 4px 24px rgba(0,0,0,.08); }
    h1 { text-align:center; margin-bottom:1.5rem; color:#111827; }
    label { display:block; font-weight:500; margin-bottom:.4rem; color:#374151; }
    input { width:100%; padding:.6rem .75rem; border:1px solid #d1d5db; border-radius:6px; margin-bottom:1rem; }
    input:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 2px rgba(37,99,235,.2); }
    button { width:100%; background:#2563eb; color:#fff; border:none; border-radius:6px; padding:.75rem; font-weight:600; cursor:pointer; }
    button:hover { background:#1e40af; }
    .footer { text-align:center; margin-top:1rem; color:#6b7280; font-size:.9rem; }
    .footer a { color:#2563eb; text-decoration:none; }
    .footer a:hover { text-decoration:underline; }
  </style>
</head>

<body>
  <div class="login-box">
    <h1>Welcome back</h1>
    <form id="kc-form-login" onsubmit="login.disabled=true;return true;" action="${url.loginAction}" method="post">
      <label for="username">Username or email</label>
      <input tabindex="1" id="username" name="username" type="text" autofocus autocomplete="username" value="${(login.username)!''}" required />

      <label for="password">Password</label>
      <input tabindex="2" id="password" name="password" type="password" autocomplete="current-password" required />

      <button tabindex="3" name="login" id="kc-login" type="submit">Log in</button>

      <div class="footer">
        Don’t have an account? <a href="${url.registrationUrl}">Sign up</a>
      </div>
    </form>
  </div>
</body>
</html>