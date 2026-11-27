// Logo Good Maps : un marqueur noir avec un rond rouge, suivi du nom.
// Utilisé dans l'écran de démarrage et dans l'en-tête (taille différente).
import './Logo.css'

function Logo({ taille = 'petit' }) {
  return (
    <span className={`logo logo-${taille}`}>
      {/* aria-hidden : l'icône est décorative, le texte suffit aux lecteurs d'écran */}
      <svg className="logo-icone" viewBox="0 0 24 32" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="var(--noir)" />
        <circle cx="12" cy="12" r="6" fill="var(--blanc)" />
        <circle cx="12" cy="12" r="3.5" fill="var(--rouge)" />
      </svg>
      <span className="logo-texte">
        <span className="logo-good">GOOD</span> MAPS
      </span>
    </span>
  )
}

export default Logo
