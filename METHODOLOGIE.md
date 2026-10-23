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
| | | | |
