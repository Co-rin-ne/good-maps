// Fenêtre "À propos", ouverte par le bouton ⓘ en haut à droite.
import Modale from './Modale.jsx'
import './APropos.css'

function APropos({ onFermer }) {
  return (
    <Modale titre="À propos" onFermer={onFermer}>
      <div className="a-propos">
        <h3>Good Maps</h3>
        <p>
          Good Maps vous suggère des activités adaptées à votre profil : vos centres d'intérêt,
          votre budget, avec qui vous sortez et vos besoins d'accessibilité.
        </p>

        <h3>Les suggestions</h3>
        <p>
          Les lieux sont d'abord triés selon votre profil (par exemple, seuls les lieux accessibles
          sont proposés aux personnes à mobilité réduite). Une IA installée sur notre serveur
          (Ollama) choisit ensuite le lieu et rédige sa présentation. Elle peut faire des erreurs :
          vérifiez les horaires avant de vous déplacer.
        </p>

        <h3>Vos données</h3>
        <p>
          Votre profil reste dans votre navigateur. Votre prénom n'est jamais envoyé au serveur.
          Pour modifier votre profil, utilisez le bouton ☰.
        </p>

        <h3>Sources</h3>
        <p>
          Carte : <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            © les contributeurs OpenStreetMap
          </a>, affichée avec Leaflet.
        </p>

        <p className="a-propos-credit">Projet fil rouge B3 · EPSI</p>
      </div>
    </Modale>
  )
}

export default APropos
