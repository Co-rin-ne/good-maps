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
| 2026-11-27 | Route `/api/suggestions` : le code filtre les lieux, l'IA (Ollama) en choisit un et rédige | Architecture « l'IA choisit, elle n'invente pas » + suggestion de secours si l'IA échoue | — |
| 2026-11-27 | « mon modèle llama3.2 est installé. teste POST /api/suggestions avec 3 profils différents (pmr + culture, famille + nature, petit budget + gastronomie). pour chaque réponse dis moi si l'IA a bien choisi un lieu de la liste, si la description est en bon français et si elle tient compte du profil. si ça marche mal, propose des modifs des consignes mais explique pourquoi avant de changer quoi que ce soit » | Les 3 choix de lieux étaient bons (grâce au filtrage par le code) | Textes parfois mauvais (« Explorons », mot inventé « Dippon ») : ajout d'un exemple de bonne réponse dans les consignes et température baissée à 0,3. Faute « Visite de le Musée » corrigée par le code (`corrigerContractions`), pas par l'IA |
| *à venir* | « branche feat/filtres. quand on clique sur le bouton ☰ en haut à gauche je veux pouvoir modifier mon profil : réutilise le FormulaireBienvenue mais pré-rempli avec le profil actuel, et le titre "Mon profil" au lieu de "Bienvenue !". quand on valide, la suggestion affichée disparaît (elle correspond plus au profil). pas de nouvelle librairie. ajoute les tests qui vont avec » | | |
| *à venir* | « branche feat/info. le bouton ⓘ doit ouvrir une fenêtre "À propos" dans le même style que le formulaire (fond gris, bords arrondis, croix pour fermer). dedans : à quoi sert l'appli, que les suggestions viennent d'une IA locale (Ollama) qui peut se tromper, que la carte vient d'OpenStreetMap, et que le profil reste dans le navigateur. textes courts, pas de blabla marketing » | | |
| *à venir* | « dans server/db/seed.sql les téléphones sont à NULL. je vais les chercher moi-même sur les sites officiels, toi dis moi juste comment mettre à jour le seed proprement et comment recréer ma base goodmaps.db sans tout casser. n'invente aucun numéro » | | |
| *à venir* | « branche feat/favoris. je veux un bouton ❤️ sur la fiche suggestion pour mettre un lieu en favori, stocké dans le localStorage comme le profil. ensuite les favoris sont envoyés au serveur avec la demande de suggestion, et l'IA doit proposer un lieu proche de ce que j'aime mais pas un favori. le serveur doit vérifier que les ids de favoris sont des entiers (comme exclure). explique moi le changement dans le prompt envoyé à ollama » | | |
| *à venir* | « je vais faire 3 captures (démarrage, formulaire, carte avec une suggestion) et les mettre dans docs/captures/. ajoute une section "Aperçu" dans le README qui les affiche côte à côte, et vérifie que les instructions d'installation sont encore à jour avec tout ce qu'on a ajouté (ollama pull, .env, etc) » | | |
| *à venir* | « pose moi 10 questions qu'un prof pourrait me poser sur mon projet good maps (stack, sécurité, CI, IA, choix techniques). une question à la fois, attends ma réponse et dis moi ce qui manque dans ce que j'ai répondu. sois exigeant » | | |

> Les lignes *à venir* sont les prompts préparés pour les prochaines étapes : la date et les colonnes « gardé / corrigé » sont remplies au moment où le prompt est réellement utilisé.
