<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify your email – Veer</title>
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
      max-width:420px;
      text-align:center;
    }
    h1 {
      color:#111827;
      margin-bottom:1rem;
    }
    p {
      color:#374151;
      font-size:.95rem;
      line-height:1.5;
      margin-bottom:1.5rem;
    }
    .info-message {
      background:#dbeafe;
      color:#1d4ed8;
      border:1px solid #93c5fd;
      padding:1rem;
      border-radius:8px;
      margin-bottom:1.5rem;
    }
    button {
      padding:.75rem 1.5rem;
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
  </style>
</head>

<body>
  <div class="box">
    <h1>Verify your email</h1>

    <div class="info-message">
      <#if message?has_content>
        ${kcSanitize(message.summary)?no_esc}
      <#else>
        We’ve sent a verification link to your email address.<br>
        Please check your inbox and follow the instructions to complete registration.
      </#if>
    </div>

    <form action="${url.loginUrl}" method="get">
        <button type="submit">Back to login</button>
    </form>

    <div class="footer">
      Didn’t get the email? <a href="${url.loginUrl}">Resend verification</a>
    </div>
  </div>
</body>
</html>