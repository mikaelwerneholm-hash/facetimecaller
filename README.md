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
