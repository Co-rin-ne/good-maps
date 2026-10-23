// Composant principal : pour l'instant, seulement l'en-tête de l'écran 3 de la maquette.
// La carte, le formulaire et les suggestions seront ajoutés fonctionnalité par fonctionnalité.
import './App.css'

function App() {
  return (
    <header className="entete">
      <button className="bouton-rond" aria-label="Filtres">☰</button>
      <h1 className="logo">
        <span className="logo-good">GOOD</span> MAPS
      </h1>
      <button className="bouton-rond" aria-label="Informations">i</button>
    </header>
  )
}

export default App
