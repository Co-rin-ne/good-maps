// Fiche de la suggestion, sous la carte (bas de l'écran 3 de la maquette) :
// titre, description, horaires, boutons Réserver / Appeler, avertissement IA.
import { formaterHeure } from '../services/horaires.js'
import './FicheSuggestion.css'

// estFavori : le lieu est-il dans les favoris ? onBasculerFavori : clic sur le cœur
function FicheSuggestion({ suggestion, estFavori = false, onBasculerFavori }) {
  const { lieu, titre, description, ouvert, source } = suggestion

  return (
    <section className="fiche" aria-live="polite">
      <div className="fiche-entete">
        <h2 className="fiche-titre">{titre}</h2>
        {/* aria-pressed : indique aux lecteurs d'écran si le bouton est "enfoncé" (favori ou non) */}
        <button
          className="fiche-favori"
          onClick={() => onBasculerFavori(lieu.id)}
          aria-pressed={estFavori}
          aria-label={estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {estFavori ? '❤️' : '🤍'}
        </button>
      </div>
      <p className="fiche-description">{description}</p>

      <p className="fiche-horaires">
        {ouvert
          ? `Ouvert maintenant et jusqu'à ${formaterHeure(lieu.heure_fermeture)}`
          : `Fermé pour le moment · ouvre à ${formaterHeure(lieu.heure_ouverture)}`}
      </p>
      <p className="fiche-adresse">{lieu.adresse}</p>

      {/* Les boutons n'apparaissent que si l'information existe dans la base */}
      <div className="fiche-actions">
        {lieu.site && (
          // rel="noopener noreferrer" : le site ouvert ne peut pas contrôler notre onglet (sécurité)
          <a className="fiche-action" href={lieu.site} target="_blank" rel="noopener noreferrer">
            <span className="fiche-action-icone" aria-hidden="true">+</span>
            Réservez en ligne
          </a>
        )}
        {lieu.telephone && (
          <a className="fiche-action" href={`tel:${lieu.telephone}`}>
            <span className="fiche-action-icone" aria-hidden="true">▶</span>
            Appelez maintenant
          </a>
        )}
      </div>

      <p className="fiche-avertissement">
        {source === 'ia'
          ? 'Suggestion rédigée par une IA (Ollama) : elle peut faire des erreurs. Vérifiez les informations importantes.'
          : "L'IA n'a pas pu répondre : voici une suggestion de notre sélection."}
      </p>
    </section>
  )
}

export default FicheSuggestion
