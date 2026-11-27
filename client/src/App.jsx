// Composant principal : l'écran 3 de la maquette (en-tête + carte).
// Le formulaire et les suggestions seront ajoutés fonctionnalité par fonctionnalité.
import { useEffect, useState } from 'react'
import Carte from './components/Carte.jsx'
import { recupererLieux } from './services/api.js'
import './App.css'

function App() {
  const [lieux, setLieux] = useState([])
  const [erreur, setErreur] = useState(null)

  // Au premier affichage, on charge les lieux depuis l'API
  useEffect(() => {
    recupererLieux()
      .then(setLieux)
      .catch(() => setErreur('Impossible de charger les lieux. Le serveur est-il lancé ?'))
  }, [])

  return (
    <>
      <header className="entete">
        <button className="bouton-rond" aria-label="Filtres">☰</button>
        <h1 className="logo">
          <span className="logo-good">GOOD</span> MAPS
        </h1>
        <button className="bouton-rond" aria-label="Informations">i</button>
      </header>
      <main>
        {erreur && <p className="message-erreur" role="alert">{erreur}</p>}
        <Carte lieux={lieux} />
      </main>
    </>
  )
}

export default App
