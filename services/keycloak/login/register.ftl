<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Register – Veer</title>
  <link rel="stylesheet" href="${url.resourcesPath}/css/register-style.css"/>
</head>
<body>
  <div class="container">
    <h1>Register in Veer</h1>

    <#if message?has_content>
      <div class="alert">
        ${message.summary}
      </div>
    </#if>

    <form action="${url.registrationAction}" method="post">
      <div>
        <input type="text" id="username" name="username" placeholder="Username"/>
      </div>
      <div>
        <input type="email" id="email" name="email" placeholder="Email"/>
      </div>
      <div>
        <input type="password" id="password" name="password" placeholder="Password"/>
      </div>
      <div>
        <input type="text" id="firstName" name="firstName" placeholder="First name"/>
      </div>
      <div>
        <input type="text" id="lastName" name="lastName" placeholder="Last name"/>
      </div>
      <div>
        <label for="country">Country:</label>
        <select id="country" name="country">
          <option value="">Loading countries...</option>
        </select>
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>

    <script>
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
        .then(response => response.json())
        .then(data => {
        const countrySelect = document.getElementById('country');
        countrySelect.innerHTML = '<option value="">-- select country --</option>';
        data
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2;
            option.text = country.name.common;
            countrySelect.appendChild(option);
            });
        })
        .catch(err => {
        console.error("Failed to load countries:", err);
        const countrySelect = document.getElementById('country');
        countrySelect.innerHTML = '<option value="">Error loading countries</option>';
        });
    </script>
</body>
</html>