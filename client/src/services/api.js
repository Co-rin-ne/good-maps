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
