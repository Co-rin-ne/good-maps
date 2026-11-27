// Point d'entrée : ouvre la base puis démarre le serveur sur le port défini dans .env
import creerApp from './app.js';
import { ouvrirBase } from './db/database.js';

const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || './goodmaps.db';

const app = creerApp(ouvrirBase(DB_PATH));

app.listen(PORT, () => {
  console.log(`API Good Maps démarrée sur http://localhost:${PORT}`);
});
