// Création de l'application Express.
// On sépare "app" (la configuration) de "index.js" (le démarrage du serveur)
// pour pouvoir tester l'API sans lancer un vrai serveur sur un port fixe.
// La base de données est passée en paramètre : les tests utilisent une base en mémoire.
import express from 'express';
import santeRouter from './routes/sante.js';
import creerRouterLieux from './routes/lieux.js';

export default function creerApp(db) {
  const app = express();

  // Lit le JSON envoyé dans le corps des requêtes, avec une taille maximale
  // pour éviter qu'un client envoie un énorme fichier (sécurité).
  app.use(express.json({ limit: '10kb' }));

  // Les routes de l'API sont toutes préfixées par /api
  app.use('/api/sante', santeRouter);
  app.use('/api/lieux', creerRouterLieux(db));

  // Route inconnue : on renvoie une erreur 404 propre en JSON
  app.use((req, res) => {
    res.status(404).json({ erreur: 'Route introuvable' });
  });

  return app;
}
