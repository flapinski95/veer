<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Error – Veer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Inter, sans-serif; background:#f3f4f6; display:flex; justify-content:center; align-items:center; height:100vh; }
    .box { background:#fff; padding:2rem; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,.1); width:100%; max-width:420px; text-align:center; }
    h1 { color:#111827; margin-bottom:1rem; }
    p { color:#374151; margin-bottom:1.5rem; }
    a { color:#2563eb; text-decoration:none; font-weight:600; }
    a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Something went wrong</h1>
    <p>${(message! "An unexpected error occurred. Please try again.")}</p>
    <a href="${url.loginUrl}">Back to login</a>
  </div>
</body>
</html>