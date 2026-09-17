<div align="center">

### Sveučilište Jurja Dobrile u Puli
### Fakultet informatike

<br><br>

## ALEN ORBANIĆ

## Razvoj web-aplikacije za razmjenu poruka u stvarnom vremenu primjenom hibridne P2P arhitekture

### Završni rad

<br><br>

| | |
|---|---|
| **JMBAG:** | 0303094982 |
| **Studijski smjer:** | preddiplomski studij informatike |
| **Kolegij:** | Raspodijeljeni sustavi |
| **Znanstveno područje:** | Društvene znanosti |
| **Znanstveno polje:** | Informacijske znanosti |
| **Znanstvena grana:** | Informacijski sustavi i informatologija |
| **Mentor:** | izv. prof. dr. sc. Nikola Tanković |

<br><br>

**Pula, rujan 2026.**

</div>

---

# Brzojav

Brzojav je web-aplikacija za razmjenu poruka u stvarnom vremenu koja korisnicima omogućuje razmjenu tekstualnih poruka i multimedijalnog sadržaja. Frontend je implementiran kao jednostranična aplikacija (Single Page Application, SPA) korištenjem Vue.js-a i komunicira s Brzojav backendom putem REST API-ja i Socket.IO-a.

Aplikacija također podržava izravnu peer-to-peer komunikaciju između korisnika korištenjem WebRTC DataChannel-a. Socket.IO se koristi za obavijesti u stvarnom vremenu i WebRTC signalizaciju, dok se backend koristi za trajnu pohranu podataka i kao zamjensko rješenje kada izravna peer-to-peer veza nije moguća.

## Aplikacija uživo

[Brzojav](https://brzojav.vercel.app/)

## Backend

Repozitorij backenda dostupan je ovdje:

[Brzojav Backend](https://github.com/AlenOrbanic/Brzojav-backend)

## Tehnologije

- **Vue.js 3** – frontend framework
- **Vue Router** – usmjeravanje na strani klijenta (client-side routing)
- **Socket.IO Client** – komunikacija u stvarnom vremenu i WebRTC signalizacija
- **WebRTC** – izravna peer-to-peer komunikacija
- **Sass** – predprocesiranje stilskih datoteka
- **Vue CLI** – alati za razvoj i izradu produkcijske verzije

## Značajke

- Registracija i prijava korisnika
- Google autentikacija
- Razgovori jedan na jedan
- Grupni razgovori
- Razmjena poruka u stvarnom vremenu
- Izravno peer-to-peer slanje poruka putem WebRTC-a
- Izravan peer-to-peer prijenos datoteka
- Slanje slika, videozapisa i ostalih datoteka
- Odgovaranje na poruke
- Brisanje poruka
- Reakcije na poruke
- Pribadanje (pinanje) poruka
- Korisnički profili
- Prilagodba profila
- Blokiranje korisnika
- Status posljednje aktivnosti (last-seen)
- Obavijesti
- Odabir teme
- Pregledi poveznica (link previews)
- Automatski prelazak na backend kada peer-to-peer veza nije dostupna

## Struktura projekta

```text
Brzojav/
├── public/                 # Public static files
├── src/
│   ├── api/
│   │   ├── index.js        # REST API client
│   │   └── seedClient.js   # Seed-node registration and lookup
│   │
│   ├── assets/             # Application assets
│   ├── components/         # Reusable Vue components
│   ├── p2p/
│   │   └── peerConnection.js # WebRTC peer connections
│   ├── router/
│   │   └── index.js        # Vue Router configuration
│   ├── views/
│   │   ├── HomeView.vue    # Main messaging interface
│   │   └── Login.vue       # Login and registration
│   ├── App.vue             # Root Vue component
│   └── main.js             # Application entry point
│
├── package.json
├── vue.config.js
└── README.md
```

Frontend odvaja API komunikaciju, WebRTC funkcionalnost, komponente za ponovnu upotrebu, usmjeravanje i poglede aplikacije u zasebne module.

## Instalacija

### Preduvjeti

Provjerite je li sljedeće instalirano:

- [Node.js](https://nodejs.org/)
- npm
- pokrenuta instanca Brzojav backenda

### Kloniranje repozitorija

```bash
git clone https://github.com/AlenOrbanic/Brzojav.git
cd Brzojav
```

### Instalacija ovisnosti

```bash
npm install
```

## Konfiguracija

Frontend koristi varijablu okoline `VUE_APP_API_URL` za određivanje URL-a backenda.

Kreirajte `.env` datoteku u korijenu projekta:

```env
VUE_APP_API_URL=http://localhost:3001
```

Ako varijabla nije zadana, aplikacija se po zadanome koristi:

```text
http://localhost:3001
```

API klijent koristi ovu adresu za REST zahtjeve.

Frontendov seed-node klijent trenutno koristi tri seed čvora:

```text
http://localhost:3001
http://localhost:3002
http://localhost:3003
```

Ovi čvorovi koriste se za registraciju korisnika, održavanje njihovog online statusa te pronalaženje drugih korisnika za peer-to-peer veze.

## Pokretanje aplikacije

### Razvojno okruženje

Pokrenite razvojni server pomoću:

```bash
npm run serve
```

Aplikacija će uobičajeno biti dostupna na:

```text
http://localhost:8080
```

### Produkcijska izrada

Za kreiranje produkcijske verzije:

```bash
npm run build
```

Generirane produkcijske datoteke mogu se zatim postaviti na statički web hosting servis.

## Arhitektura komunikacije

Brzojav koristi hibridni komunikacijski model.

### REST API

Frontend koristi backend REST API za operacije poput:

- autentikacije
- korisničkih profila
- upravljanja razgovorima (chatovima)
- dohvaćanja povijesti poruka
- pohrane poruka
- prijenosa datoteka
- reakcija
- brisanja poruka
- upravljanja korisnicima
- pregleda poveznica

API klijent automatski uključuje JWT pristupni token u autenticirane zahtjeve.

### Socket.IO

Socket.IO omogućuje komunikaciju u stvarnom vremenu između frontenda i backenda.

Prvenstveno se koristi za:

- WebRTC signalizaciju
- obavještavanje korisnika o novim porukama
- ažuriranje pregleda razgovora
- obavještavanje klijenata o promjenama poruka i razgovora

Server ne koristi Socket.IO kao primarni transport za sadržaj peer-to-peer poruka. Umjesto toga, prosljeđuje signalizacijske informacije potrebne za uspostavu WebRTC veza.

### WebRTC

Kada su dva korisnika online i izravna veza se može uspostaviti, Brzojav između njihovih preglednika kreira WebRTC `RTCPeerConnection`.

WebRTC `RTCDataChannel` se zatim koristi za prijenos:

- tekstualnih poruka
- datoteka
- podataka vezanih uz poruke

SDP i ICE signalizacija razmjenjuju se putem Socket.IO-a. Backend samo prosljeđuje signalizacijske pakete i ne obrađuje sadržaj koji se prenosi putem DataChannel-a.

Ako izravna peer-to-peer veza nije dostupna, aplikacija se može prebaciti na komunikaciju putem backenda.

## Autentikacija

Aplikacija podržava:

- autentikaciju putem korisničkog imena/e-maila i lozinke
- Google autentikaciju
- sesije temeljene na JWT-u

Autentikacijske tokene pohranjuje frontend i automatski ih uključuje u autenticirane API zahtjeve.

## Prijenos datoteka

Datoteke se mogu prenositi izravno između povezanih korisnika korištenjem WebRTC DataChannel-a.

Frontend dijeli binarne datoteke na dijelove (chunkove) prije slanja putem DataChannel-a. Ovo omogućuje prijenos većih datoteka bez slanja cijele datoteke kao jedne poruke.

Kada se peer-to-peer veza ne može koristiti, datoteke se umjesto toga mogu prenijeti putem backenda.

## Dostupne skripte

| Naredba | Opis |
|---|---|
| `npm install` | Instalira ovisnosti |
| `npm run serve` | Pokreće razvojni server |
| `npm run build` | Kreira produkcijsku verziju |

## Postavljanje u produkciju (deployment)

Frontend se može postaviti na statički hosting servis poput Vercela.

Produkcijski API URL mora se konfigurirati pomoću:

```env
VUE_APP_API_URL=https://your-backend-url
```

Provjerite dopušta li backend zahtjeve s produkcijske domene frontenda.

## Povezani repozitorij

Backend:

[https://github.com/AlenOrbanic/Brzojav-backend](https://github.com/AlenOrbanic/Brzojav-backend)
