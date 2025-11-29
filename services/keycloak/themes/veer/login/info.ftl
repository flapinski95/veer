<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Message – Veer</title>
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
      max-width:400px;
      text-align:center;
    }
    h1 { color:#111827; margin-bottom:1rem; }
    .info-message {
      background:#dbeafe;
      color:#1d4ed8;
      border:1px solid #93c5fd;
      padding:1rem;
      border-radius:8px;
      margin-bottom:1rem;
      font-size:.95rem;
    }
    button {
      padding:.7rem 1.4rem;
      background:#2563eb;
      border:none;
      border-radius:6px;
      color:white;
      font-weight:600;
      cursor:pointer;
    }
    button:hover { background:#1e40af; }
  </style>
</head>

<body>
  <div class="box">
    <h1>Information</h1>
    <div class="info-message">
      ${kcSanitize(message.summary)?no_esc}
    </div>
    <#if url.loginUrl??>
      <form action="${url.loginUrl}">
        <button type="submit">Return to login</button>
      </form>
    </#if>
  </div>
</body>
</html>