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

## Fonctionnalités

- **Écran de démarrage** avec le logo
- **Formulaire de bienvenue** : prénom, ville, accessibilité, centres d'intérêt, budget, avec qui. Le profil est mémorisé dans le navigateur
- **Carte** des lieux (marqueurs rouges, popup)
- **Suggestions par IA** : le serveur filtre les lieux selon le profil (accessibilité PMR, budget, centres d'intérêt, ouvert maintenant), puis l'IA en choisit un et rédige sa présentation. La réponse de l'IA est vérifiée ; si elle est invalide ou si Ollama ne répond pas, une suggestion de secours est affichée
- **Fiche du lieu** : horaires, adresse, réservation en ligne, appel

> Les horaires des lieux sont indicatifs et simplifiés.

## Structure

```
client/   → l'interface (React)
server/   → l'API (Express)
.github/  → le pipeline de CI
```

## Installation

Prérequis : Node.js 24 ou plus, et [Ollama](https://ollama.com).

```bash
# 0. Le modèle d'IA (une seule fois, environ 2 Go)
ollama pull llama3.2

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
