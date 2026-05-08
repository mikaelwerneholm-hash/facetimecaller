# FaceTime Callout

Ett minimalistiskt uppringningsverktyg för FaceTime, byggt för TV-redaktioner och kontrollrum. Designat för att användas säkert i skarp sändning.

---

## Komma igång

### Förutsättningar

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Kör lokalt

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

### Bygga för produktion

```bash
npm run build
npm start
```

### Tester

```bash
npm test
```

---

## Deploya till Vercel

1. Pusha projektet till ett GitHub-repo.
2. Gå till [vercel.com](https://vercel.com) och importera repot.
3. Vercel identifierar Next.js automatiskt — inga extra inställningar krävs.
4. Klicka **Deploy**.

Alternativt via Vercel CLI:

```bash
npx vercel
```

---

## Hur FaceTime-länkar fungerar på macOS

Appen använder URL-schemat `facetime://` för att starta ett FaceTime-samtal:

```
facetime://+46701234567
```

När länken aktiveras:
- macOS frågar om FaceTime ska öppnas (första gången per session).
- FaceTime startar och ringer upp numret.
- Webbläsaren stannar kvar på sidan — inga data försvinner.

### Telefonnummerformat som stöds

| Inmatat format       | Normaliserat till  |
|----------------------|--------------------|
| `0701234567`         | `+46701234567`     |
| `070-123 45 67`      | `+46701234567`     |
| `+46701234567`       | `+46701234567`     |
| `0046701234567`      | `+46701234567`     |
| `08-12345678`        | `+4681234568`      |
| `0044701234567`      | `+44701234567`     |

---

## Begränsningar

- **Kräver macOS med FaceTime installerat.** Fungerar inte på Windows eller Linux.
- **Webbläsaren måste tillåta protokollhanterare.** En dialogruta kan visas första gången.
- **FaceTime kräver att mottagaren har ett Apple-konto** kopplat till numret.
- **Fungerar bäst i Chrome och Safari på macOS.**
- Appen lagrar **inga telefonnummer** — varken lokalt eller på server.

---

## Broadcast safe-tänk

- Ingen samtalshistorik visas på huvudskärmen.
- Nummer rensas automatiskt 6 sekunder efter uppringning.
- **Säker skärm** (Escape eller knapp) visar en neutral skärm utan känslig information.
- Inga telefonnummer i URL-querystring.
- Inga externa analytics eller tracking.

---

## Projektstruktur

```
facetimecaller/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout med metadata
│   ├── page.tsx           # Hemsideskomponent
│   └── globals.css        # Tailwind CSS import
├── components/
│   └── FaceTimeCaller.tsx # Huvudkomponent för uppringning
├── lib/
│   └── phoneUtils.ts      # Telefonformateringslogik
├── __tests__/
│   └── phoneUtils.test.ts # Enhetstester
├── public/                # Statiska filer
├── next.config.ts         # Next.js-konfiguration
├── tsconfig.json          # TypeScript-inställningar
├── package.json           # Beroenden
├── tailwind.config.ts     # Tailwind CSS-konfiguration
└── vitest.config.ts       # Testkonfiguration
```

---

## Tangentbordskontroller

| Tangent   | Åtgärd                                      |
|-----------|---------------------------------------------|
| **Enter** | Ring numret (om det är giltigt)             |
| **Escape**| Gå till säker skärm och rensa nummer        |

---

## Knappbeskrivningar

- **Ring med FaceTime** — Startar FaceTime-samtal med numret. Knappen är grå om numret är ogiltigt.
- **Rensa** — Rensar inputfältet och återställer gränssnittet.
- **Kopiera nummer** — Kopierar det normaliserade numret till urklipp (endast om giltigt).
- **Säker skärm** — Visar en neutral, "broadcast safe" skärm utan känslig information.

---

## Säkerhet och privacy

- **Inga lagring**: Telefonnummer lagras inte lokalt eller på servern.
- **Inga externa tjänster**: Appen är helt självständig — ingen cloud-synk, ingen analytics.
- **Inga cookies**: Webbläsaren spåras inte.
- **Säker normalisering**: Nummer formateras på klientdan innan de skickas till FaceTime.
- **Debuggning**: I produktionsmiljö loggas inga telefonnummer till konsol.

---

## Teknisk stack

- **Next.js 16.2** — React-ramverk med App Router
- **React 19** — UI-bibliotek
- **TypeScript 5** — Typkontroll
- **Tailwind CSS 4** — Styling
- **Vitest 3** — Enhetstestning
- **ESLint 9** — Kodkvalitet

---

## Utveckling och bidrag

### Köra lokalt med hot-reload

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

### Köra tester

```bash
npm test       # Kör tester en gång
npm run test:watch  # Kör tester i watch-läge
```

### Linting

```bash
npm run lint
```

### Build för produktion

```bash
npm run build
npm start
```

---

## Deployment

### Vercel (rekommenderat)

**Steg 1:** Sätt upp Git-repo

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

**Steg 2:** Deploya till Vercel

1. Gå till [vercel.com](https://vercel.com).
2. Klicka **Add New Project**.
3. Välj ditt GitHub-repo.
4. Vercel detekterar automatiskt att det är ett Next.js-projekt.
5. Klicka **Deploy**.

Appen är nu live! Uppdateringar pushas automatiskt när du commitar till `main`.

**Alternativt via Vercel CLI:**

```bash
npx vercel
```

### Docker (för egen hosting)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Känd begränsning: Webbläsarkompatibilitet med FaceTime

| Webbläsare | macOS | Anmärkning |
|----------|-------|-----------|
| Safari   | ✅    | Bäst stöd |
| Chrome   | ✅    | Fungerar väl |
| Firefox  | ⚠️    | Kan kräva godkännande |
| Edge     | ✅    | Fungerar väl |

**Viktigt:** `facetime://`-schema fungerar **endast på macOS**. På Windows eller Linux kan appen köras men FaceTime-länken öppnas inte.

---

## Felsökning

### FaceTime öppnas inte

- Säkerställ att FaceTime är installerat på macOS.
- Kontrollera att webbläsaren är konfigurerad att hantera `facetime://`-protokoll.
- Prova i Safari istället för andra webbläsare.
- Verifiera att telefonnumret är giltigt (börjar med `+`).

### Nummer formateras inte korrekt

- Kontrollera att inmatningen är ett svenskt nummer eller internationellt format.
- Test med: `0701234567` eller `+46701234567`.
- Se **Telefonnummerformat som stöds** ovan.

### Appen reagerar inte på tangentbord

- Se till att inputfältet har fokus (klicka på det).
- Prova att refresha sidan.
- Kontrollera webbläsarens console för fel.

---

## Framtida förbättringar (ej i v1)

- [ ] Shortcode-konfigurering för ofta använda nummer
- [ ] Favoritgäster-funktion (väl gömd bakom admin-panel)
- [ ] Exporterbar samtalslogg (endast för admin)
- [ ] Mörkare/"broadcast safe"-stilar för extra säkerhet
- [ ] Stöd för andra videosamtalsprotokoll (Teams, Zoom)
- [ ] Mobilappsversion (reagerar på längre svajps, större knappar)

---

## Licens

MIT

---

## Support

För frågor eller feedback, skapa ett GitHub-issue i repot.
