# Pomidoro

A Pomodoro focus timer built with React and Vite.

## Features

- **25 min focus / 5 min rest** — classic Pomodoro defaults
- **Long break after 5 rounds** — 25 min rest (configurable)
- **Custom times** — adjust focus, short break, long break, and round count
- **Auto loop** — when a phase ends, the next one starts automatically (endless cycle)
- **Round counter** — current cycle round (e.g. 2/5) plus total completed pomodoros
- **Sound alerts** — chime when focus ends, softer tone when rest begins (toggle in settings)
- **Controls** — Start, Pause, Reset, and Skip
- **Persistent settings** — saved in `localStorage`

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```
