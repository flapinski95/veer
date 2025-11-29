<#macro registrationLayout section displayInfo=false displayMessage=false displayWide=false showForm=true>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Veer Login</title>
    <style>
      body { font-family: sans-serif; background: #f5f5f5; margin: 0; }
      .form-group { margin-bottom: 1rem; }
      .btn { padding: 0.5rem 1rem; background: #333; color: white; border: none; }
    </style>
</head>
<body>
  <div class="kc-container">
    <#nested "form">
  </div>
</body>
</html>
</#macro>