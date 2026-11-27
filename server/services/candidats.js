// Sélection des lieux "candidats" : ceux qui respectent les règles strictes du profil.
// Ces règles sont appliquées par le code, pas par l'IA : on est sûr qu'un lieu
// non accessible ne sera jamais proposé à une personne à mobilité réduite.
import { BUDGETS } from './profil.js';

// Heure actuelle à Paris au format "HH:MM", quel que soit le fuseau du serveur
export function heureParis(date) {
  return date.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
}

// Les heures "HH:MM" se comparent directement comme du texte ("09:30" < "18:00")
export function estOuvert(lieu, heure) {
  return lieu.heure_ouverture <= heure && heure < lieu.heure_fermeture;
}

// Renvoie les lieux qui correspondent au profil, les lieux ouverts en premier.
// exclure : identifiants des lieux déjà proposés, pour varier les suggestions.
export function filtrerCandidats(lieux, profil, heure, exclure = []) {
  const budgetMax = BUDGETS.indexOf(profil.budget);

  const correspondants = lieux.filter(
    (lieu) =>
      profil.interets.includes(lieu.categorie) &&
      BUDGETS.indexOf(lieu.prix) <= budgetMax &&
      (profil.accessibilite !== 'pmr' || lieu.accessible_pmr === 1),
  );

  // Si tous les lieux ont déjà été proposés, on recommence depuis le début
  const nonVus = correspondants.filter((lieu) => !exclure.includes(lieu.id));
  const candidats = nonVus.length > 0 ? nonVus : correspondants;

  const ouverts = candidats.filter((lieu) => estOuvert(lieu, heure));
  const fermes = candidats.filter((lieu) => !estOuvert(lieu, heure));
  return [...ouverts, ...fermes];
}
