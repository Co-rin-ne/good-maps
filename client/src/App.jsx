// Composant principal : enchaîne les écrans de la maquette.
// 1. Écran de démarrage  2. Formulaire de bienvenue (si pas de profil)  3. Carte
import { useCallback, useEffect, useState } from 'react'
import Carte from './components/Carte.jsx'
import FormulaireBienvenue from './components/FormulaireBienvenue.jsx'
import Logo from './components/Logo.jsx'
import Splash from './components/Splash.jsx'
import { recupererLieux } from './services/api.js'
import { chargerProfil, enregistrerProfil } from './services/profil.js'
import './App.css'

function App() {
  const [lieux, setLieux] = useState([])
  const [erreur, setErreur] = useState(null)
  const [splashVisible, setSplashVisible] = useState(true)
  // Profil déjà enregistré lors d'une visite précédente (ou null)
  const [profil, setProfil] = useState(chargerProfil)
  // Le formulaire s'affiche seulement si aucun profil n'est enregistré
  const [formulaireVisible, setFormulaireVisible] = useState(() => profil === null)

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
  }

  if (splashVisible) {
    return <Splash onFin={finSplash} />
  }

  return (
    <>
      <header className="entete">
        <button className="bouton-rond" aria-label="Filtres">☰</button>
        <h1 className="entete-titre">
          <Logo />
        </h1>
        <button className="bouton-rond" aria-label="Informations">i</button>
      </header>
      <main>
        {erreur && <p className="message-erreur" role="alert">{erreur}</p>}
        {profil && <p className="salutation">Bonjour {profil.prenom} !</p>}
        <Carte lieux={lieux} />
      </main>

      {formulaireVisible && (
        <FormulaireBienvenue onValider={validerProfil} onFermer={() => setFormulaireVisible(false)} />
      )}
    </>
  )
}

export default App
