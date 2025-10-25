<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Login</title>
  <link rel="stylesheet" href="${url.resourcesPath}/css/login-style.css"/>
</head>
<body>
  <div class="container">
    <h1>Veer</h1>

    <#if message?has_content>
      <div class="alert" style="color:red; margin-bottom: 10px;">
        ${message.summary}
      </div>
    </#if>

    <form action="${url.loginAction}" method="post">
      <div>
        <input type="text" id="username" name="username" placeholder="Nazwa użytkownika"
               value="${login.username!'’'}" autofocus/>
      </div>
      <div>
        <input type="password" id="password" name="password" placeholder="Hasło"/>
      </div>

      <div>
        <button type="submit">Zaloguj się</button>
      </div>
    </form>
  </div>
</body>
</html>