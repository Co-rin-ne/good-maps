# Méthodologie IA — Good Maps

Ce document explique comment j'ai utilisé l'IA pendant le projet : quels outils, quels prompts, et surtout ce que j'ai gardé, corrigé ou refusé.

## Outils IA utilisés

| Outil | Usage |
|---|---|
| Claude (Claude Code) | Mise en place de la structure, aide au code, explications |
| Ollama (modèle local) | Dans l'appli : génération des suggestions d'activités |

## Préprompt

> Tu es un développeur senior. Je crée « Good Maps », une appli web qui suggère des activités adaptées au profil de l'utilisateur (accessibilité PMR, centres d'intérêt, budget). Stack : React + Vite, Leaflet, Node/Express, SQLite, Ollama. Règles : code commenté en français, une fonctionnalité à la fois, aucune clé ou mot de passe dans le code, propose des tests.

## Choix importants

### L'IA choisit, elle n'invente pas
Problème : si on demande directement à un modèle « suggère une activité à Paris », il peut inventer des lieux, des horaires ou des numéros de téléphone.
Solution :
1. Le serveur filtre les lieux de la base SQLite (accessibilité, budget, ouvert maintenant).
2. Seule cette liste est envoyée à l'IA, avec le profil.
3. L'IA répond en JSON avec l'`id` du lieu choisi et une description.
4. Le serveur vérifie que l'`id` existe, puis renvoie les vraies infos (horaires, téléphone) depuis la base.

## Journal des prompts

| Date | Prompt (résumé) | Ce que j'ai gardé | Ce que j'ai corrigé / refusé |
|---|---|---|---|
| 2026-10-23 | Mise en place du dépôt et de la structure | Structure client/server, `.env.example`, CI | — |
| 2026-11-27 | Projet sur le Bureau synchronisé par iCloud | — | Erreur `ECANCELED` : iCloud retirait les fichiers du disque. Projet déplacé dans `~/dev`, hors iCloud |
| 2026-11-27 | Marqueurs rouges de la maquette sur la carte | Marqueur en CSS (`L.divIcon`) | La rotation du conteneur faussait la position (Leaflet utilise déjà `transform`) : rotation déplacée sur un élément intérieur |
| 2026-11-27 | Écran de démarrage + formulaire de bienvenue | Profil validé contre des listes de choix, mémorisé dans le `localStorage` | Tests qui échouaient : avec Vitest, l'écran n'est pas vidé entre deux tests. Ajout de `cleanup()` dans `setupTests.js` |
| | | | |
