// Outils partagés sur les lieux, utilisés par plusieurs routes.

// Catégories possibles (mêmes valeurs que la contrainte CHECK de schema.sql)
export const CATEGORIES = ['culture', 'nature', 'sport', 'gastronomie'];

// SQLite stocke les booléens en 0/1 : on les convertit en true/false pour le front
export function formaterLieu(lieu) {
  return { ...lieu, accessible_pmr: lieu.accessible_pmr === 1 };
}
