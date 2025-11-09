<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email verification – Veer</title>
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
    h1 { color:#111827; margin-bottom:1rem; }
    p { color:#374151; font-size:.95rem; line-height:1.5; margin-bottom:1.5rem; }
    .btn {
      padding:.75rem 1.5rem;
      background:#2563eb;
      border:none;
      border-radius:6px;
      color:white;
      font-weight:600;
      cursor:pointer;
    }
    .btn:hover { background:#1e40af; }

    .info {
      background:#dbeafe;
      color:#1d4ed8;
      border:1px solid #93c5fd;
      padding:1rem;
      border-radius:8px;
      margin-bottom:1.5rem;
    }
    .error {
      background:#fee2e2;
      color:#b91c1c;
      border:1px solid #fca5a5;
      padding:.75rem;
      border-radius:6px;
      margin-bottom:1rem;
    }
  </style>
</head>
<body>
  <div class="box">
    <#if message?has_content && message.type == "error">
      <div class="error">
        ${kcSanitize(message.summary)?no_esc}
      </div>
      <h1>Verification failed</h1>
      <p>Something went wrong while verifying your email. The link may have expired or been used already.</p>
    <#else>
      <h1>Email verified!</h1>
      <div class="info">
        Your email has been successfully verified.<br>
        You can now return to the Veer app and log in.
      </div>
    </#if>
  </div>
</body>
</html>