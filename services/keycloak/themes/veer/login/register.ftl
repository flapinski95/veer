<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register – Veer</title>
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
    }
    h1 { text-align:center; color:#111827; margin-bottom:1.5rem; }
    label { display:block; font-weight:500; margin-bottom:.25rem; color:#374151; }
    input {
      width:100%; padding:.6rem .75rem;
      border:1px solid #d1d5db; border-radius:6px;
      margin-bottom:1rem; font-size:.95rem;
    }
    input:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 2px rgba(37,99,235,.2); }
    button {
      width:100%; padding:.75rem;
      background:#2563eb; border:none; border-radius:6px;
      color:white; font-weight:600; cursor:pointer;
    }
    button:hover { background:#1e40af; }
    .footer { text-align:center; margin-top:1rem; font-size:.9rem; color:#6b7280; }
    .footer a { color:#2563eb; text-decoration:none; }
    .footer a:hover { text-decoration:underline; }

    .dropdown-wrapper { position: relative; margin-bottom: 1rem; }
    .dropdown-input {
      width: 100%; padding: .6rem .75rem;
      border: 1px solid #d1d5db; border-radius: 6px; font-size: .95rem;
    }
    .dropdown-list {
      position: absolute; top: 100%; left: 0; right: 0;
      background: #fff; border: 1px solid #d1d5db;
      border-radius: 6px; max-height: 220px; overflow-y: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,.1);
      z-index: 99; display: none;
    }
    .dropdown-item {
      padding: .5rem .75rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;
    }
    .dropdown-item:hover { background: #e5e7eb; }
    .flag { width: 20px; height: 15px; object-fit: cover; border-radius: 2px; flex-shrink: 0; }

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
  </style>
</head>

<body>
  <div class="box">
    <h1>Create account</h1>

    <#-- ✅ Dynamic error messages -->
    <#if messagesPerField.existsError('username','email','firstName','lastName','password','password-confirm')>
      <div class="error-message">
        ${kcSanitize(messagesPerField.getFirstError('username','email','firstName','lastName','password','password-confirm'))?no_esc}
      </div>
    <#elseif message?has_content>
      <div class="error-message">
        ${kcSanitize(message.summary)?no_esc}
      </div>
    </#if>

    <form id="kc-register-form" action="${url.registrationAction}" method="post" novalidate>
      ${kcFormHiddenFields!}

      <label for="username">Username</label>
      <input id="username" name="username" value="${(register.username)!''}" required minlength="3" />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" value="${(register.email)!''}" required />

      <label for="firstName">First name</label>
      <input id="firstName" name="firstName" value="${(register.firstName)!''}" required />

      <label for="lastName">Last name</label>
      <input id="lastName" name="lastName" value="${(register.lastName)!''}" required />

      <label for="country">Country of origin</label>
      <input type="hidden" name="user.attributes.country" />
      <div class="dropdown-wrapper" id="country-wrapper"></div>

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required minlength="8" />

      <label for="password-confirm">Confirm password</label>
      <input id="password-confirm" name="password-confirm" type="password" required minlength="8" />

      <button type="submit">Sign up</button>

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
        ["Afghanistan","af"],["Albania","al"],["Algeria","dz"],["Andorra","ad"],["Angola","ao"],["Argentina","ar"],
        ["Armenia","am"],["Australia","au"],["Austria","at"],["Azerbaijan","az"],["Bahamas","bs"],["Bahrain","bh"],
        ["Bangladesh","bd"],["Belarus","by"],["Belgium","be"],["Belize","bz"],["Benin","bj"],["Bhutan","bt"],
        ["Bolivia","bo"],["Bosnia and Herzegovina","ba"],["Botswana","bw"],["Brazil","br"],["Brunei","bn"],
        ["Bulgaria","bg"],["Burkina Faso","bf"],["Burundi","bi"],["Cambodia","kh"],["Cameroon","cm"],["Canada","ca"],
        ["Chile","cl"],["China","cn"],["Colombia","co"],["Costa Rica","cr"],["Croatia","hr"],["Cuba","cu"],
        ["Cyprus","cy"],["Czech Republic","cz"],["Denmark","dk"],["Dominican Republic","do"],["Ecuador","ec"],
        ["Egypt","eg"],["Estonia","ee"],["Ethiopia","et"],["Finland","fi"],["France","fr"],["Georgia","ge"],
        ["Germany","de"],["Ghana","gh"],["Greece","gr"],["Greenland","gl"],["Guatemala","gt"],["Haiti","ht"],
        ["Honduras","hn"],["Hungary","hu"],["Iceland","is"],["India","in"],["Indonesia","id"],["Iran","ir"],
        ["Iraq","iq"],["Ireland","ie"],["Israel","il"],["Italy","it"],["Jamaica","jm"],["Japan","jp"],
        ["Jordan","jo"],["Kazakhstan","kz"],["Kenya","ke"],["Kuwait","kw"],["Kyrgyzstan","kg"],["Laos","la"],
        ["Latvia","lv"],["Lebanon","lb"],["Lithuania","lt"],["Luxembourg","lu"],["Madagascar","mg"],["Malaysia","my"],
        ["Malta","mt"],["Mexico","mx"],["Moldova","md"],["Monaco","mc"],["Mongolia","mn"],["Montenegro","me"],
        ["Morocco","ma"],["Mozambique","mz"],["Namibia","na"],["Nepal","np"],["Netherlands","nl"],["New Zealand","nz"],
        ["Nicaragua","ni"],["Niger","ne"],["Nigeria","ng"],["North Macedonia","mk"],["Norway","no"],["Oman","om"],
        ["Pakistan","pk"],["Panama","pa"],["Paraguay","py"],["Peru","pe"],["Philippines","ph"],["Poland","pl"],
        ["Portugal","pt"],["Qatar","qa"],["Romania","ro"],["Russia","ru"],["Rwanda","rw"],["Saudi Arabia","sa"],
        ["Senegal","sn"],["Serbia","rs"],["Singapore","sg"],["Slovakia","sk"],["Slovenia","si"],["South Africa","za"],
        ["South Korea","kr"],["Spain","es"],["Sri Lanka","lk"],["Sudan","sd"],["Sweden","se"],["Switzerland","ch"],
        ["Syria","sy"],["Taiwan","tw"],["Tanzania","tz"],["Thailand","th"],["Tunisia","tn"],["Turkey","tr"],
        ["Uganda","ug"],["Ukraine","ua"],["United Arab Emirates","ae"],["United Kingdom","gb"],
        ["United States","us"],["Uruguay","uy"],["Uzbekistan","uz"],["Venezuela","ve"],["Vietnam","vn"],
        ["Zambia","zm"],["Zimbabwe","zw"]
      ];

      const flagURL = code => "https://flagcdn.com/w20/" + code + ".png";

      countries.forEach(([name, code]) => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        const img = document.createElement("img");
        img.src = flagURL(code);
        img.alt = code;
        img.className = "flag";
        const text = document.createElement("span");
        text.textContent = name;
        item.appendChild(img);
        item.appendChild(text);
        item.onclick = () => {
          input.value = name;
          document.querySelector('input[name="user.attributes.country"]').value = name;
          list.style.display = "none";
        };
        list.appendChild(item);
      });

      input.addEventListener("input", () => {
        const val = input.value.toLowerCase();
        Array.from(list.children).forEach(it =>
          it.style.display = it.textContent.toLowerCase().includes(val) ? "flex" : "none"
        );
        list.style.display = "block";
      });

      input.addEventListener("focus", () => list.style.display = "block");
      document.addEventListener("click", e => {
        if (!wrapper.contains(e.target)) list.style.display = "none";
      });
    });
  </script>
</body>
</html>