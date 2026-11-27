// Connexion à la base SQLite, avec le module SQLite intégré à Node (node:sqlite) :
// rien à installer, la base est un simple fichier.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

// Lit un fichier .sql situé dans le même dossier que ce fichier
function lireSql(nomFichier) {
  return readFileSync(new URL(nomFichier, import.meta.url), 'utf8');
}

// Ouvre la base (ou la crée si elle n'existe pas), crée la table
// et ajoute les lieux de départ si la table est vide.
// cheminFichier = ':memory:' crée une base temporaire en mémoire (utile pour les tests).
export function ouvrirBase(cheminFichier) {
  const db = new DatabaseSync(cheminFichier);
  db.exec(lireSql('schema.sql'));

  const { total } = db.prepare('SELECT COUNT(*) AS total FROM lieux').get();
  if (total === 0) {
    db.exec(lireSql('seed.sql'));
  }

  return db;
}
