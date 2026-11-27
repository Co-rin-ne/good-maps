// Fonctions d'appel à l'API Express. Regrouper les appels ici évite de
// répéter les URL et la gestion d'erreur dans chaque composant.

// Récupère la liste des lieux (grâce au proxy Vite, /api va vers le port 3001)
export async function recupererLieux() {
  const reponse = await fetch('/api/lieux')
  if (!reponse.ok) {
    throw new Error(`Erreur ${reponse.status} lors du chargement des lieux`)
  }
  return reponse.json()
}

// Demande une suggestion adaptée au profil.
// exclure : identifiants des lieux déjà proposés, pour varier les suggestions.
// favoris : identifiants des lieux aimés, pour recommander des lieux qui leur ressemblent.
export async function demanderSuggestion(profil, exclure = [], favoris = []) {
  // Le prénom n'est pas envoyé : le serveur n'en a pas besoin (moins de données personnelles)
  const { ville, accessibilite, interets, budget, compagnie } = profil

  const reponse = await fetch('/api/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profil: { ville, accessibilite, interets, budget, compagnie }, exclure, favoris }),
  })
  const donnees = await reponse.json().catch(() => ({}))
  if (!reponse.ok) {
    throw new Error(donnees.erreur || `Erreur ${reponse.status} lors de la suggestion`)
  }
  return donnees
}
