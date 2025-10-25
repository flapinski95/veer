REQ.APP.001 Rejestracja użytkownika 

Użytkownik tworzy konto podając: 

nazwę użytkownika (unikalna, min. 3 znaki, bez spacji), 
imię i nazwisko, 
kraj pochodzenia (lista rozwijana lub automatyczne wykrycie po lokalizacji), 
adres e-mail (unikalny, weryfikowany), 
hasło (min. 8 znaków, co najmniej 1 wielka litera, 1 cyfra, 1 znak specjalny), 
bio (opcjonalne, maks. 300 znaków). 
System: 

waliduje unikalność e-maila i nazwy użytkownika w czasie rzeczywistym, 
wysyła e-mail aktywacyjny z linkiem ważnym przez np. 24h, 
umożliwia rejestrację przez konto Google. 
 

REQ.APP.002 Logowanie 

Użytkownik loguje się przy użyciu e-maila lub nazwy użytkownika oraz hasła lub za pomocą konta Google. System obsługuje blokadę konta po kilku nieudanych próbach logowania (np. 5) i zapamiętanie sesji (“Pamiętaj mnie”) przez JWT refresh token. 

 

REQ.APP.003 Resetowanie hasła 

Użytkownik może zresetować hasło wpisując e-mail. Otrzymuje link resetujący ważny np. 30 minut, po kliknięciu ustawia nowe hasło zgodne z zasadami bezpieczeństwa. 

 

REQ.APP.004 Zmiana danych 

Użytkownik może edytować imię, nazwisko, kraj pochodzenia, nazwę użytkownika (z walidacją unikalności), e-mail (z ponowną weryfikacją nowego adresu). Wymagana autoryzacja bieżącym hasłem przy zmianie e-maila lub loginu. 

 

REQ.APP.005 Usunięcie konta 

Użytkownik może trwale usunąć konto po potwierdzeniu hasłem. 
System przed usunięciem prosi o potwierdzenie (“Czy na pewno chcesz usunąć konto?”), usuwa lub anonimizuje wszystkie dane użytkownika zgodnie z RODO, wysyła e-mail potwierdzający usunięcie konta. 

 

REQ.APP.006 Personalizacja interfejsu 

Użytkownik może wybrać tryb jasny / ciemny, preferencje zapisywane są lokalnie. 

 

REQ.APP.007 Interakcje społeczne 

Użytkownik może wyszukać innych użytkowników po nazwie lub e-mailu. Może rozpocząć lub zakończyć obserwowanie danego profilu. Na profilu widoczna liczba obserwujących i obserwowanych. Możliwość przejścia do listy obserwowanych / obserwujących. 

 

REQ.APP.008 Tworzenie trasy 

Użytkownik dodaje punkty trasy (poprzez wyszukiwarkę lub kliknięcie na mapie), pierwszy punkt to START (może być bieżąca lokalizacja), każdy kolejny punkt można oznaczyć jako STOP. Może przeciągać trasę na mapie, by modyfikować przebieg. Może zapisać trasę w zakładce ‘Moje trasy’. System automatycznie oblicza trasę i statystyki po każdym dodaniu punktu i wyświetla sugerowane atrakcje w pobliżu. 

 

REQ.APP.009 Sortowanie trasy 

Dostępne przy 3 lub więcej punktach. Użytkownik może kliknąć ‘Optymalizuj trasę’, a system wylicza najkrótszy wariant. Wyświetla nową kolejność punktów oraz aktualizuje długość i czas. 

 

REQ.APP.010 Edytowanie trasy 

Dostępna jest manualna zmiana kolejności punktów (drag & drop lista), usuwanie punktów, zmiana nazwy i opisu trasy. 

 

REQ.APP.011 Statystyki trasy 

System wyświetla długość trasy (km), szacowany czas (minuty / godziny), różnicę wysokości (opcjonalnie). Statystyki są aktualizowane dynamicznie po każdej modyfikacji. 

REQ.APP.012 Nawigacja 

Użytkownik może rozpocząć nawigację po trasie i wyświetlać aktualne położenie. 

 

REQ.APP.013 Inteligentne proponowanie tras 

Użytkownik wpisuje prompt (np. ‘Trasa z Gdańska do Sopotu z punktami widokowymi’). System generuje sugerowaną trasę na podstawie prompta. Użytkownik może zaakceptować, edytować lub zapisać trasę. 

 

REQ.APP.014 Udostępnianie tras 

Użytkownik może ustawić widoczność trasy jako prywatna (tylko dla siebie) lub publiczna (widoczna na profilu, dostępna dla innych). Publiczne trasy można udostępniać przez link, media społecznościowe lub w aplikacji. 

 

REQ.APP.015 Interakcje z trasami innych użytkowników 

Użytkownik ma możliwość przeglądania publicznych tras innych użytkowników, oceniania tras i zapisywanie trasy do własnego profilu. 

 

REQ.APP.016 Powiadomienia systemowe 

System wysyła powiadomienia push oraz wewnętrzne w odpowiedzi na określone zdarzenia dotyczące aktywności użytkownika, rzechowuje historię powiadomień w dedykowanej sekcji ‘Powiadomienia’ i automatycznie oznacza powiadomienia jako przeczytane po ich otwarciu.  Użytkownik otrzymuje powiadomienia w następujących przypadkach: nowy obserwujący, polubienie trasy przez innego użytkownika, informacja o aktualizacji aplikacji lub istotnych zmianach w regulaminie. 

 