// Gestion du profil utilisateur : choix possibles, validation et mémorisation.
// Le profil est enregistré dans le localStorage du navigateur, pour ne pas
// redemander le formulaire à chaque visite (c'est la "mémorisation" du bonus).

const CLE_STOCKAGE = 'goodmaps-profil'
export const PRENOM_LONGUEUR_MAX = 30

// Choix proposés dans le formulaire : { valeur enregistrée: texte affiché }
export const VILLES = { paris: 'Paris' }
export const ACCESSIBILITES = {
  aucun: 'Aucun besoin particulier',
  pmr: 'Mobilité réduite (PMR)',
  malvoyant: 'Malvoyant',
  malentendant: 'Malentendant',
}
// Mêmes valeurs que les catégories de lieux côté serveur
export const INTERETS = {
  culture: 'Culture',
  nature: 'Nature',
  sport: 'Sport',
  gastronomie: 'Gastronomie',
}
export const BUDGETS = {
  gratuit: 'Gratuit',
  '€': '€ (petit budget)',
  '€€': '€€ (moyen)',
  '€€€': '€€€ (pas de limite)',
}
export const COMPAGNIES = {
  seul: 'Seul(e)',
  couple: 'En couple',
  famille: 'En famille',
  amis: 'Entre amis',
}

// Vérifie un profil et renvoie les erreurs par champ ({} si tout est bon).
// On vérifie que chaque valeur fait partie des choix autorisés :
// on ne fait jamais confiance à ce qui vient de l'utilisateur ou du stockage.
export function validerProfil(profil) {
  const erreurs = {}
  const prenom = typeof profil.prenom === 'string' ? profil.prenom.trim() : ''

  if (prenom === '') {
    erreurs.prenom = 'Indique ton prénom.'
  } else if (prenom.length > PRENOM_LONGUEUR_MAX) {
    erreurs.prenom = `${PRENOM_LONGUEUR_MAX} caractères maximum.`
  }
  if (!(profil.ville in VILLES)) erreurs.ville = 'Choisis une ville.'
  if (!(profil.accessibilite in ACCESSIBILITES)) erreurs.accessibilite = 'Choisis une option.'
  if (
    !Array.isArray(profil.interets) ||
    profil.interets.length === 0 ||
    !profil.interets.every((interet) => interet in INTERETS)
  ) {
    erreurs.interets = 'Choisis au moins un centre d\'intérêt.'
  }
  if (!(profil.budget in BUDGETS)) erreurs.budget = 'Choisis un budget.'
  if (!(profil.compagnie in COMPAGNIES)) erreurs.compagnie = 'Choisis une option.'

  return erreurs
}

// Lit le profil enregistré. Renvoie null s'il n'existe pas ou s'il est invalide.
// try/catch : le localStorage peut être bloqué (navigation privée) ou contenir du JSON abîmé.
export function chargerProfil() {
  try {
    const profil = JSON.parse(localStorage.getItem(CLE_STOCKAGE))
    if (profil && Object.keys(validerProfil(profil)).length === 0) {
      return profil
    }
  } catch {
    // On ignore l'erreur : l'utilisateur remplira simplement le formulaire
  }
  return null
}

// Enregistre le profil. Si le stockage est impossible, l'appli continue de fonctionner.
export function enregistrerProfil(profil) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(profil))
  } catch {
    // Stockage indisponible : le profil sera redemandé à la prochaine visite
  }
}
