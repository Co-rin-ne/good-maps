# Good Maps

Application web de **suggestions d'activités adaptées** : l'utilisateur remplit son profil (accessibilité, centres d'intérêt, budget...), et Good Maps lui propose des lieux sur une carte, avec une description générée par une IA locale.

> 🚧 Projet en cours de développement.

## Stack

| Partie | Technologie |
|---|---|
| Front | React + Vite |
| Carte | Leaflet + OpenStreetMap |
| API | Node.js + Express |
| Base de données | SQLite |
| IA | Ollama (en local) |
| Tests | Vitest (client), `node --test` (serveur) |
| CI | GitHub Actions |

## Structure

```
client/   → l'interface (React)
server/   → l'API (Express)
.github/  → le pipeline de CI
```

## Installation

Prérequis : Node.js 24 ou plus, et [Ollama](https://ollama.com).

```bash
# 1. L'API
cd server
npm install
cp ../.env.example .env
npm run dev

# 2. Le front (dans un autre terminal)
cd client
npm install
npm run dev
```

Ouvrir ensuite http://localhost:5173.

## Commandes utiles

| Commande (dans `client/` ou `server/`) | Rôle |
|---|---|
| `npm run dev` | Lance en mode développement |
| `npm run lint` | Vérifie la qualité du code |
| `npm test` | Lance les tests |

## Méthodologie IA

Voir [METHODOLOGIE.md](METHODOLOGIE.md).
