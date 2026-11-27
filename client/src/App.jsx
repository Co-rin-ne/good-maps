// Composant principal : enchaîne les écrans de la maquette.
// 1. Écran de démarrage  2. Formulaire de bienvenue (si pas de profil)  3. Carte
import { useCallback, useEffect, useState } from 'react'
import APropos from './components/APropos.jsx'
import Carte from './components/Carte.jsx'
import FicheSuggestion from './components/FicheSuggestion.jsx'
import FormulaireBienvenue from './components/FormulaireBienvenue.jsx'
import Logo from './components/Logo.jsx'
import Splash from './components/Splash.jsx'
import { recupererLieux, demanderSuggestion } from './services/api.js'
import { chargerProfil, enregistrerProfil } from './services/profil.js'
import { chargerFavoris, enregistrerFavoris, basculerFavori } from './services/favoris.js'
import './App.css'

function App() {
  const [lieux, setLieux] = useState([])
  const [erreur, setErreur] = useState(null)
  const [splashVisible, setSplashVisible] = useState(true)
  // Profil déjà enregistré lors d'une visite précédente (ou null)
  const [profil, setProfil] = useState(chargerProfil)
  // Le formulaire s'affiche seulement si aucun profil n'est enregistré
  const [formulaireVisible, setFormulaireVisible] = useState(() => profil === null)
  const [aProposVisible, setAProposVisible] = useState(false)
  // Suggestion affichée sous la carte, et état de la demande en cours
  const [suggestion, setSuggestion] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [erreurSuggestion, setErreurSuggestion] = useState(null)
  // Lieux déjà proposés, pour ne pas reproposer le même à chaque clic
  const [dejaVus, setDejaVus] = useState([])
  // Lieux aimés (❤️), mémorisés d'une visite à l'autre
  const [favoris, setFavoris] = useState(chargerFavoris)

  // Au premier affichage, on charge les lieux depuis l'API
  // (pendant l'écran de démarrage, pour gagner du temps)
  useEffect(() => {
    recupererLieux()
      .then(setLieux)
      .catch(() => setErreur('Impossible de charger les lieux. Le serveur est-il lancé ?'))
  }, [])

  // useCallback : garde la même fonction d'un affichage à l'autre,
  // sinon le minuteur du Splash serait relancé à chaque mise à jour d'App
  const finSplash = useCallback(() => setSplashVisible(false), [])

  function validerProfil(nouveauProfil) {
    enregistrerProfil(nouveauProfil)
    setProfil(nouveauProfil)
    setFormulaireVisible(false)
    // La suggestion affichée correspondait à l'ancien profil : on repart de zéro
    setSuggestion(null)
    setErreurSuggestion(null)
    setDejaVus([])
  }

  async function obtenirSuggestion() {
    // Sans profil, impossible de personnaliser : on affiche le formulaire
    if (!profil) {
      setFormulaireVisible(true)
      return
    }

    setChargement(true)
    setErreurSuggestion(null)
    try {
      const nouvelle = await demanderSuggestion(profil, dejaVus, favoris)
      setSuggestion(nouvelle)
      // Quand tous les lieux ont été vus, le serveur recommence : on repart d'une liste vide
      setDejaVus((vus) => (vus.includes(nouvelle.lieu.id) ? [nouvelle.lieu.id] : [...vus, nouvelle.lieu.id]))
    } catch (e) {
      setErreurSuggestion(e.message)
    } finally {
      setChargement(false)
    }
  }

  function changerFavori(idLieu) {
    const nouveauxFavoris = basculerFavori(favoris, idLieu)
    setFavoris(nouveauxFavoris)
    enregistrerFavoris(nouveauxFavoris)
  }

  if (splashVisible) {
    return <Splash onFin={finSplash} />
  }

  return (
    <>
      <header className="entete">
        <button className="bouton-rond" aria-label="Filtres" onClick={() => setFormulaireVisible(true)}>☰</button>
        <h1 className="entete-titre">
          <Logo />
        </h1>
        <button className="bouton-rond" aria-label="Informations" onClick={() => setAProposVisible(true)}>i</button>
      </header>
      <main>
        {erreur && <p className="message-erreur" role="alert">{erreur}</p>}
        {profil && <p className="salutation">Bonjour {profil.prenom} !</p>}
        <Carte lieux={lieux} lieuSelectionne={suggestion?.lieu} />

        <button className="bouton-suggestions" onClick={obtenirSuggestion} disabled={chargement}>
          {chargement ? 'Recherche en cours…' : suggestion ? 'Autre suggestion' : 'Obtenir des suggestions'}
        </button>
        {erreurSuggestion && <p className="message-erreur" role="alert">{erreurSuggestion}</p>}
        {suggestion && (
          <FicheSuggestion
            suggestion={suggestion}
            estFavori={favoris.includes(suggestion.lieu.id)}
            onBasculerFavori={changerFavori}
          />
        )}
      </main>

      {/* Sans profil : fenêtre "Bienvenue !". Avec un profil (bouton ☰) : modification du profil */}
      {formulaireVisible && (profil ? (
        <FormulaireBienvenue
          onValider={validerProfil}
          onFermer={() => setFormulaireVisible(false)}
          profilInitial={profil}
          titre="Mon profil"
          intro="Modifiez vos préférences : les prochaines suggestions en tiendront compte."
          texteBouton="Enregistrer"
        />
      ) : (
        <FormulaireBienvenue onValider={validerProfil} onFermer={() => setFormulaireVisible(false)} />
      ))}

      {aProposVisible && <APropos onFermer={() => setAProposVisible(false)} />}
    </>
  )
}

export default App
