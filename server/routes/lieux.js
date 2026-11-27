// Routes des lieux. La base de données est passée en paramètre,
// ce qui permet aux tests d'utiliser une base en mémoire.
import { Router } from 'express';
// CATEGORIES : seules valeurs acceptées pour le filtre (on ne fait pas confiance à l'utilisateur)
import { CATEGORIES, formaterLieu } from '../services/lieux.js';

export default function creerRouterLieux(db) {
  const router = Router();

  // GET /api/lieux            -> tous les lieux
  // GET /api/lieux?categorie=nature -> seulement les lieux de cette catégorie
  router.get('/', (req, res) => {
    const { categorie } = req.query;

    if (categorie === undefined) {
      const lieux = db.prepare('SELECT * FROM lieux ORDER BY nom').all();
      return res.json(lieux.map(formaterLieu));
    }

    if (!CATEGORIES.includes(categorie)) {
      return res.status(400).json({ erreur: `Catégorie invalide. Valeurs possibles : ${CATEGORIES.join(', ')}` });
    }

    // Requête paramétrée : la valeur est passée à part, jamais collée dans le SQL
    // (protection contre les injections SQL)
    const lieux = db
      .prepare('SELECT * FROM lieux WHERE categorie = :categorie ORDER BY nom')
      .all({ categorie });
    res.json(lieux.map(formaterLieu));
  });

  return router;
}
