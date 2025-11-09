<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login – Veer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: Inter, sans-serif;
      background:#f3f4f6;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
    }
    .box {
      background:#fff;
      padding:2rem;
      border-radius:12px;
      box-shadow:0 4px 20px rgba(0,0,0,.1);
      width:100%;
      max-width:380px;
    }
    h1 {
      text-align:center;
      color:#111827;
      margin-bottom:1.5rem;
    }
    label {
      display:block;
      font-weight:500;
      margin-bottom:.25rem;
      color:#374151;
    }
    input {
      width:100%;
      padding:.6rem .75rem;
      border:1px solid #d1d5db;
      border-radius:6px;
      margin-bottom:1rem;
    }
    input:focus {
      outline:none;
      border-color:#2563eb;
      box-shadow:0 0 0 2px rgba(37,99,235,.2);
    }
    button {
      width:100%;
      padding:.75rem;
      background:#2563eb;
      border:none;
      border-radius:6px;
      color:white;
      font-weight:600;
      cursor:pointer;
    }
    button:hover { background:#1e40af; }
    .footer {
      text-align:center;
      margin-top:1rem;
      font-size:.9rem;
      color:#6b7280;
    }
    .footer a {
      color:#2563eb;
      text-decoration:none;
    }
    .footer a:hover { text-decoration:underline; }

    .error-message {
      background:#fee2e2;
      color:#b91c1c;
      border:1px solid #fca5a5;
      padding:.6rem;
      border-radius:6px;
      margin-bottom:1rem;
      text-align:center;
      font-size:.9rem;
    }

    .forgot {
      text-align:right;
      margin-top:-.5rem;
      margin-bottom:1rem;
    }
    .forgot a {
      font-size:.85rem;
      color:#2563eb;
      text-decoration:none;
    }
    .forgot a:hover { text-decoration:underline; }
  </style>
</head>

<body>
  <div class="box">
    <h1>Welcome back</h1>

    <form id="kc-form-login" onsubmit="login.disabled=true;return true;" action="${url.loginAction}" method="post">
      <label for="username">Username or email</label>
      <input tabindex="1" id="username" name="username" type="text" autofocus autocomplete="username" value="${(login.username)!''}" required />

      <label for="password">Password</label>
      <input tabindex="2" id="password" name="password" type="password" autocomplete="current-password" required />

      <div class="forgot">
        <a href="${url.loginResetCredentialsUrl}">Forgot password?</a>
      </div>

      <!-- ✅ Dynamic error message (e.g., wrong password) -->
      <#if messagesPerField.existsError('username','password')>
        <div class="error-message">
          ${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}
        </div>
      <#elseif message?has_content>
        <div class="error-message">
          ${kcSanitize(message.summary)?no_esc}
        </div>
      </#if>

      <button tabindex="3" name="login" id="kc-login" type="submit">Log in</button>

      <div class="footer">
        Don’t have an account? <a href="${url.registrationUrl}">Sign up</a>
      </div>
    </form>
  </div>
</body>
</html>