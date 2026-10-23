// Route de "santé" : permet de vérifier rapidement que l'API répond.
import { Router } from 'express';

const router = Router();

// GET /api/sante -> { statut: "ok" }
router.get('/', (req, res) => {
  res.json({ statut: 'ok' });
});

export default router;
