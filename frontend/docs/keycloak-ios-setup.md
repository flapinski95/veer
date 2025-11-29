Okej — zrozumiałe.
Poniżej masz jednolity, gotowy plik .md, w pełnym formacie Markdown (bez żadnych elementów konwersacyjnych).
Możesz go skopiować w całości i zapisać jako
docs/keycloak-ios-setup.md w katalogu frontend/.

⸻


# 🔐 Integracja Keycloak + React Native (iOS)

Konfiguracja logowania przez **Keycloak** w projekcie **React Native (Swift + iOS)** z użyciem biblioteki [`react-native-app-auth`](https://github.com/FormidableLabs/react-native-app-auth).

---

## 📁 Struktura plików projektu

Wszystkie ścieżki są względne względem katalogu `frontend/`:

frontend/
├── ios/
│   ├── frontend.xcworkspace
│   ├── frontend/
│   │   ├── frontend-Bridging-Header.h   ✅ (dodajesz ten plik)
│   │   └── Info.plist
├── .env                                  ✅ (Twoje zmienne środowiskowe)
├── babel.config.js
└── App.tsx

---

## 🧩 1. Zarejestruj URI Scheme w projekcie iOS

Ta konfiguracja mówi iOS:  
> „jeśli ktoś otworzy `veer://...`, przekieruj do tej aplikacji”.

### 🔧 Kroki

#### Otwórz projekt w Xcode

```bash
cd ios
open frontend.xcworkspace

W Xcode
	1.	W lewym panelu kliknij projekt (nie target).
	2.	Wybierz target → Info → URL Types.
	3.	Kliknij + i dodaj:
	•	Identifier: veer
	•	URL Schemes: veer

📘 Efekt: Keycloak po zalogowaniu przekieruje użytkownika na veer://callback,
a iOS automatycznie otworzy aplikację.

⸻

🧠 2. Dodaj Bridging Header dla react-native-app-auth

Swift wymaga mostka (bridging header), aby móc korzystać z bibliotek Objective-C takich jak RNAppAuth.

🔧 Kroki

Utwórz plik

ios/frontend/frontend-Bridging-Header.h

Wklej do niego

#import <RNAppAuth/RNAppAuthAuthorizationFlowManager.h>
#import <RNAppAuth/RNAppAuthAuthorizationFlowManagerDelegate.h>

W Xcode
	1.	Otwórz Build Settings.
	2.	Wyszukaj: bridging.
	3.	Znajdź: Objective-C Bridging Header.
	4.	Ustaw wartość:

frontend/frontend-Bridging-Header.h



Przebuduj projekt

cd ios && pod install && cd ..
npx react-native run-ios


⸻

⚙️ 3. Skonfiguruj plik .env

Plik .env powinien znajdować się w katalogu głównym frontend/
(nie w ios/, nie w src/).

Przykład .env

# IP komputera w sieci Wi-Fi (sprawdź przez `ipconfig getifaddr en0`)
HOST=192.168.0.82

# Adres backendu Keycloak
KEYCLOAK_URL=http://${HOST}:8080/realms/veer
KEYCLOAK_CLIENT_ID=veer-mobile
KEYCLOAK_REDIRECT_URI=veer://callback
KEYCLOAK_LOGOUT_URI=${KEYCLOAK_URL}/protocol/openid-connect/logout

📌 Jeśli testujesz na fizycznym telefonie:
	•	Telefon i laptop muszą być w tej samej sieci Wi-Fi.
	•	IP (192.168.0.82) to adres Twojego Maca, sprawdzony komendą:

ipconfig getifaddr en0



⸻

🧰 4. Konfiguracja w babel.config.js

Upewnij się, że w pliku babel.config.js masz dodaną obsługę react-native-dotenv:

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      safe: false,
      allowUndefined: false
    }]
  ]
};


⸻

🔄 5. Zrestartuj projekt po zmianach .env

Po każdej zmianie pliku .env wykonaj:

npx react-native start --reset-cache
npx react-native run-ios


⸻

🧩 6. Przykładowa konfiguracja authConfig.ts

Dodaj plik:

frontend/src/config/authConfig.ts

Wklej:

import { KEYCLOAK_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_REDIRECT_URI } from '@env';

export const authConfig = {
  issuer: KEYCLOAK_URL,
  clientId: KEYCLOAK_CLIENT_ID,
  redirectUrl: KEYCLOAK_REDIRECT_URI,
  scopes: ['openid', 'profile', 'email'],
  dangerouslyAllowInsecureHttpRequests: true, // tylko w dev
};

Użycie w kodzie:

import { authorize } from 'react-native-app-auth';
import { authConfig } from './config/authConfig';

const login = async () => {
  const result = await authorize(authConfig);
  console.log('Access token:', result.accessToken);
};


⸻

✅ Efekt końcowy

Po wykonaniu wszystkich kroków:
	•	Aplikacja otwiera ekran logowania Keycloak w przeglądarce.
	•	Po zalogowaniu użytkownik zostaje przekierowany na veer://callback.
	•	iOS rozpoznaje to jako zarejestrowany URL Scheme i otwiera aplikację Veer.
	•	react-native-app-auth odbiera tokeny i kończy proces logowania.

⸻

🧭 Dodatkowe materiały
	•	📘 react-native-app-auth – GitHub￼
	•	📘 Apple Docs – Custom URL Schemes￼

---
