# Diät Tracker React + Vite

## Starten

```bash
npm install
npm run dev
```

## Ordnerstruktur

```txt
src/
  main.jsx
  App.jsx
  components/
  pages/
  utils/
  storage/
  i18n/
  styles/
```

## Routing

Die App nutzt `react-router-dom`:

- `/` leitet auf `/uebersicht`
- `/uebersicht` zeigt die Eintrags-Tabelle
- `/perioden` zeigt Wochen/Monate

## Hinweise

Die App nutzt weiterhin dieselben `localStorage`-Keys wie die alte Version. Bestehende Daten sollten deshalb erhalten bleiben.
