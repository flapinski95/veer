<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Create Account – Veer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body {
      font-family: Inter, sans-serif;
      background: #f3f4f6;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .register-box {
      background: #fff;
      padding: 2rem;
      border-radius: 12px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,.08);
    }
    h1 {
      text-align: center;
      color: #111827;
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: .4rem;
      font-weight: 500;
      color: #374151;
    }
    input {
      width: 100%;
      padding: .6rem .75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: .95rem;
    }
    input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37,99,235,.2);
    }
    button {
      width: 100%;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: .75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover { background: #1e40af; }
    .footer { text-align: center; margin-top: 1rem; font-size: .9rem; color: #6b7280; }
    .footer a { color: #2563eb; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }

    .dropdown-wrapper { position: relative; }
    .dropdown-list {
      position: absolute; left: 0; right: 0; top: 100%;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,.1);
      z-index: 999;
      display: none;
    }
    .dropdown-item { padding: .5rem .75rem; cursor: pointer; }
    .dropdown-item:hover { background: #e5e7eb; }
  </style>
</head>

<body>
  <div class="register-box">
    <h1>Create your account</h1>

    <form action="${url.registrationAction}" method="post">
      <label for="username">Username</label>
      <input id="username" name="username" value="${(register.username)!''}" required minlength="3"/>

      <label for="email">Email address</label>
      <input id="email" type="email" name="email" value="${(register.email)!''}" required/>

      <label for="firstName">First name</label>
      <input id="firstName" name="firstName" value="${(register.firstName)!''}" required/>

      <label for="lastName">Last name</label>
      <input id="lastName" name="lastName" value="${(register.lastName)!''}" required/>

      <label for="country">Country of origin</label>
      <input type="hidden" name="user.attributes.country"/>
      <div class="dropdown-wrapper" id="country-wrapper"></div>

      <label for="password">Password</label>
      <input id="password" type="password" name="password" required minlength="8"/>

      <label for="password-confirm">Confirm password</label>
      <input id="password-confirm" type="password" name="password-confirm" required minlength="8"/>

      <button type="submit">Create Account</button>

      <div class="footer">
        Already have an account? <a href="${url.loginUrl}">Sign in</a>
      </div>
    </form>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const wrapper = document.getElementById("country-wrapper");
      const input = document.createElement("input");
      const list  = document.createElement("div");
      input.className = "dropdown-input";
      input.placeholder = "Type or select your country";
      list.className = "dropdown-list";
      wrapper.appendChild(input);
      wrapper.appendChild(list);

      const countries = [
        "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria",
        "Azerbaijan","Bahamas","Bahrain","Bangladesh","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
        "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Cambodia","Cameroon",
        "Canada","Chile","China","Colombia","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic",
        "Ecuador","Egypt","Estonia","Finland","France","Georgia","Germany","Greece","Guatemala","Haiti","Honduras",
        "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan",
        "Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lithuania","Luxembourg","Madagascar",
        "Malaysia","Maldives","Mali","Malta","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique",
        "Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan",
        "Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia",
        "Senegal","Serbia","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sudan",
        "Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand","Turkey","Uganda","Ukraine","United Arab Emirates",
        "United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Zambia","Zimbabwe"
      ];

      countries.forEach(c => {
        const item = document.createElement("div");
        item.textContent = c;
        item.className = "dropdown-item";
        item.onclick = () => {
          input.value = c;
          document.querySelector('input[name="user.attributes.country"]').value = c;
          list.style.display = "none";
        };
        list.appendChild(item);
      });

      input.addEventListener("input", () => {
        const val = input.value.toLowerCase();
        Array.from(list.children).forEach(it =>
          it.style.display = it.textContent.toLowerCase().includes(val) ? "block" : "none"
        );
        list.style.display = "block";
      });
      input.addEventListener("focus", () => list.style.display = "block");
      document.addEventListener("click", e => { if (!wrapper.contains(e.target)) list.style.display = "none"; });
    });
  </script>
</body>
</html>