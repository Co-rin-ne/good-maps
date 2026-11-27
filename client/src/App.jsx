// Composant principal : l'écran 3 de la maquette (en-tête + carte).
// Le formulaire et les suggestions seront ajoutés fonctionnalité par fonctionnalité.
import Carte from './components/Carte.jsx'
import './App.css'

function App() {
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
        <Carte />
      </main>
    </>
  )
}

export default App
