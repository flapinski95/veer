<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Session expired – Veer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Inter, sans-serif; background:#f3f4f6; display:flex; justify-content:center; align-items:center; height:100vh; }
    .box { background:#fff; padding:2rem; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,.1); width:100%; max-width:420px; text-align:center; }
    h1 { color:#111827; margin-bottom:1rem; }
    p { color:#374151; margin-bottom:1.5rem; }
    button { padding:.75rem 1.5rem; background:#2563eb; border:none; border-radius:6px; color:white; font-weight:600; cursor:pointer; }
    button:hover { background:#1e40af; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Session expired</h1>
    <p>Your session has expired or this page is no longer valid.</p>
    <form action="${url.loginUrl}" method="get">
      <button type="submit">Back to login</button>
    </form>
  </div>
</body>
</html>