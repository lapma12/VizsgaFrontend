# Vizsga Frontend

## Oldal felépítése

```text
src/
├── assets/            # statikus fájlok (pl. videó, letölthető játék fájl)
├── Components/        # újrafelhasználható UI elemek (Navbar, Footer, Toast, ConfirmModal)
├── Img/               # képek (logó, háttérképek, illusztrációk)
├── Pages/             # útvonalakhoz tartozó oldalak
│   └── Services/      # szolgáltatás oldalak (Terms, PrivacyPolicy, FAQ, Admin)
├── Styles/            # oldalszintű és közös CSS fájlok
├── api/               # API kliens (api.js)
├── Tests/             # frontend tesztek
├── App.jsx            # fő alkalmazás komponens
├── main.jsx           # belépési pont (entry point)
└── setupTests.js      # teszt környezet beállítás
```

## Futtatás (Bun)

1. Függőségek telepítése:
   - `bun install`
2. Fejlesztői szerver indítása:
   - `bun dev`

Ezután a Vite dev szerver elindul, és lokálban tudod nézni/fejleszteni az oldalt (általában a terminál kiírja a pontos URL-t, pl. `http://localhost:5173`).

