// Favoris : identifiants des lieux aimés, mémorisés dans le localStorage
// comme le profil. Ils servent à recommander des lieux qui leur ressemblent.

const CLE_STOCKAGE = 'goodmaps-favoris'
// Le serveur refuse plus de 50 identifiants
export const FAVORIS_MAX = 50

// Lit les favoris enregistrés. Renvoie [] si rien n'est enregistré ou si c'est invalide.
export function chargerFavoris() {
  try {
    const favoris = JSON.parse(localStorage.getItem(CLE_STOCKAGE))
    if (Array.isArray(favoris) && favoris.every(Number.isInteger)) {
      return favoris.slice(0, FAVORIS_MAX)
    }
  } catch {
    // Stockage abîmé ou bloqué : on repart sans favoris
  }
  return []
}

export function enregistrerFavoris(favoris) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(favoris))
  } catch {
    // Stockage indisponible : les favoris seront perdus à la prochaine visite
  }
}

// Ajoute le lieu s'il n'est pas en favori, le retire sinon (sans modifier la liste reçue).
// Au-delà du maximum, le plus ancien favori est retiré.
export function basculerFavori(favoris, idLieu) {
  if (favoris.includes(idLieu)) {
    return favoris.filter((id) => id !== idLieu)
  }
  return [...favoris, idLieu].slice(-FAVORIS_MAX)
}
