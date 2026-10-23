// Point d'entrée : démarre le serveur sur le port défini dans .env
import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API Good Maps démarrée sur http://localhost:${PORT}`);
});
