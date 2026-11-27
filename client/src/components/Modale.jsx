// Fenêtre par-dessus la carte (fond gris, bords arrondis, croix pour fermer).
// Partagée par le formulaire de profil et la page "À propos".
import { useEffect, useId } from 'react'
import './Modale.css'

// titre : titre affiché en haut ; onFermer : appelé par la croix ou la touche Échap
// children : le contenu de la fenêtre
function Modale({ titre, onFermer, children }) {
  // Identifiant unique pour relier la fenêtre à son titre (lecteurs d'écran)
  const idTitre = useId()

  // La touche Échap ferme la fenêtre, comme dans la plupart des applis
  useEffect(() => {
    function surTouche(evenement) {
      if (evenement.key === 'Escape') onFermer()
    }
    document.addEventListener('keydown', surTouche)
    // Nettoyage : on retire l'écouteur quand la fenêtre disparaît
    return () => document.removeEventListener('keydown', surTouche)
  }, [onFermer])

  return (
    <div className="fond-modale">
      <div className="modale" role="dialog" aria-modal="true" aria-labelledby={idTitre}>
        <button className="modale-fermer" onClick={onFermer} aria-label="Fermer">×</button>
        <h2 id={idTitre}>{titre}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modale
