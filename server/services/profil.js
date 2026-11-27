// Validation du profil envoyé par le front.
// Le front vérifie déjà le formulaire, mais le serveur revérifie toujours :
// n'importe qui peut appeler l'API directement avec des données fabriquées.
import { CATEGORIES } from './lieux.js';

export const ACCESSIBILITES = ['aucun', 'pmr', 'malvoyant', 'malentendant'];
// Ordre croissant : sert aussi à comparer un budget au prix d'un lieu
export const BUDGETS = ['gratuit', '€', '€€', '€€€'];
export const COMPAGNIES = ['seul', 'couple', 'famille', 'amis'];
export const VILLES = ['paris'];

// Renvoie la liste des champs invalides (vide si le profil est correct).
// Le prénom n'est pas demandé : le serveur n'en a pas besoin (moins de données personnelles).
export function champsInvalides(profil) {
  if (typeof profil !== 'object' || profil === null) return ['profil'];

  const invalides = [];
  if (!VILLES.includes(profil.ville)) invalides.push('ville');
  if (!ACCESSIBILITES.includes(profil.accessibilite)) invalides.push('accessibilite');
  if (
    !Array.isArray(profil.interets) ||
    profil.interets.length === 0 ||
    profil.interets.length > CATEGORIES.length ||
    !profil.interets.every((interet) => CATEGORIES.includes(interet))
  ) {
    invalides.push('interets');
  }
  if (!BUDGETS.includes(profil.budget)) invalides.push('budget');
  if (!COMPAGNIES.includes(profil.compagnie)) invalides.push('compagnie');
  return invalides;
}
