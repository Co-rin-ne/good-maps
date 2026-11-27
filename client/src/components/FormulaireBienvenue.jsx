// Écran 2 de la maquette : fenêtre "Bienvenue !" par-dessus la carte,
// avec 6 questions pour personnaliser les suggestions.
import { useState } from 'react'
import {
  VILLES, ACCESSIBILITES, INTERETS, BUDGETS, COMPAGNIES,
  PRENOM_LONGUEUR_MAX, validerProfil,
} from '../services/profil.js'
import './FormulaireBienvenue.css'

const PROFIL_VIDE = {
  prenom: '',
  ville: 'paris',
  accessibilite: '',
  interets: [],
  budget: '',
  compagnie: '',
}

// Transforme un objet de choix { valeur: texte } en balises <option>
function Options({ choix }) {
  return Object.entries(choix).map(([valeur, texte]) => (
    <option key={valeur} value={valeur}>{texte}</option>
  ))
}

// onValider(profil) : appelé avec le profil rempli et valide
// onFermer() : appelé quand on clique sur la croix
function FormulaireBienvenue({ onValider, onFermer }) {
  const [profil, setProfil] = useState(PROFIL_VIDE)
  const [erreurs, setErreurs] = useState({})

  // Met à jour un champ du profil sans toucher aux autres
  function changerChamp(champ, valeur) {
    setProfil((precedent) => ({ ...precedent, [champ]: valeur }))
  }

  // Coche ou décoche un centre d'intérêt
  function basculerInteret(interet) {
    const interets = profil.interets.includes(interet)
      ? profil.interets.filter((i) => i !== interet)
      : [...profil.interets, interet]
    changerChamp('interets', interets)
  }

  function envoyer(evenement) {
    // Empêche le navigateur de recharger la page (comportement par défaut d'un formulaire)
    evenement.preventDefault()
    const profilPropre = { ...profil, prenom: profil.prenom.trim() }
    const nouvellesErreurs = validerProfil(profilPropre)
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length === 0) {
      onValider(profilPropre)
    }
  }

  return (
    <div className="fond-modale">
      <div className="modale" role="dialog" aria-modal="true" aria-labelledby="titre-bienvenue">
        <button className="modale-fermer" onClick={onFermer} aria-label="Fermer">×</button>
        <h2 id="titre-bienvenue">Bienvenue !</h2>
        <p className="modale-intro">
          Pour mieux personnaliser vos suggestions d'activités, merci de remplir ce formulaire.
        </p>

        {/* noValidate : on affiche nos propres messages d'erreur, en français */}
        <form onSubmit={envoyer} noValidate>
          <label htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            value={profil.prenom}
            maxLength={PRENOM_LONGUEUR_MAX}
            onChange={(e) => changerChamp('prenom', e.target.value)}
          />
          {erreurs.prenom && <p className="champ-erreur">{erreurs.prenom}</p>}

          <label htmlFor="ville">Ville</label>
          <select id="ville" value={profil.ville} onChange={(e) => changerChamp('ville', e.target.value)}>
            <Options choix={VILLES} />
          </select>
          {erreurs.ville && <p className="champ-erreur">{erreurs.ville}</p>}

          <label htmlFor="accessibilite">Besoins d'accessibilité</label>
          <select
            id="accessibilite"
            value={profil.accessibilite}
            onChange={(e) => changerChamp('accessibilite', e.target.value)}
          >
            <option value="" disabled>Choisir…</option>
            <Options choix={ACCESSIBILITES} />
          </select>
          {erreurs.accessibilite && <p className="champ-erreur">{erreurs.accessibilite}</p>}

          {/* fieldset + legend : regroupe les cases à cocher sous un même titre */}
          <fieldset>
            <legend>Centres d'intérêt</legend>
            <div className="cases">
              {Object.entries(INTERETS).map(([valeur, texte]) => (
                <label key={valeur} className="case">
                  <input
                    type="checkbox"
                    checked={profil.interets.includes(valeur)}
                    onChange={() => basculerInteret(valeur)}
                  />
                  {texte}
                </label>
              ))}
            </div>
          </fieldset>
          {erreurs.interets && <p className="champ-erreur">{erreurs.interets}</p>}

          <label htmlFor="budget">Budget</label>
          <select id="budget" value={profil.budget} onChange={(e) => changerChamp('budget', e.target.value)}>
            <option value="" disabled>Choisir…</option>
            <Options choix={BUDGETS} />
          </select>
          {erreurs.budget && <p className="champ-erreur">{erreurs.budget}</p>}

          <label htmlFor="compagnie">Avec qui ?</label>
          <select
            id="compagnie"
            value={profil.compagnie}
            onChange={(e) => changerChamp('compagnie', e.target.value)}
          >
            <option value="" disabled>Choisir…</option>
            <Options choix={COMPAGNIES} />
          </select>
          {erreurs.compagnie && <p className="champ-erreur">{erreurs.compagnie}</p>}

          <button type="submit" className="bouton-principal">Passer à la carte</button>
        </form>
      </div>
    </div>
  )
}

export default FormulaireBienvenue
