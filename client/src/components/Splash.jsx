// Écran 1 de la maquette : le logo s'affiche quelques instants au lancement.
import { useEffect } from 'react'
import Logo from './Logo.jsx'
import './Splash.css'

// Durée d'affichage, exportée pour que les tests puissent avancer le temps d'autant
export const DUREE_SPLASH = 1500

// onFin : fonction appelée quand l'écran de démarrage a fini de s'afficher
function Splash({ onFin }) {
  useEffect(() => {
    const minuteur = setTimeout(onFin, DUREE_SPLASH)
    // Nettoyage : si le composant disparaît avant la fin, on annule le minuteur
    return () => clearTimeout(minuteur)
  }, [onFin])

  return (
    <div className="splash">
      <Logo taille="grand" />
      <p className="splash-slogan">Suggestions d'activités adaptées</p>
    </div>
  )
}

export default Splash
