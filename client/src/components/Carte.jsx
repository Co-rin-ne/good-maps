// Carte interactive affichée avec Leaflet et les fonds de carte OpenStreetMap.
// react-leaflet fournit des composants React autour de la bibliothèque Leaflet.
import { MapContainer, TileLayer } from 'react-leaflet'
// Le CSS de Leaflet est obligatoire, sinon les morceaux de carte s'affichent dans le désordre
import 'leaflet/dist/leaflet.css'
import './Carte.css'

// Centre par défaut : Paris (latitude, longitude)
const CENTRE_PARIS = [48.8566, 2.3522]
const ZOOM_PAR_DEFAUT = 13

function Carte() {
  return (
    <MapContainer center={CENTRE_PARIS} zoom={ZOOM_PAR_DEFAUT} className="carte">
      {/* Les "tuiles" sont les petites images qui composent le fond de carte.
          La mention des contributeurs OpenStreetMap est obligatoire (licence). */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
    </MapContainer>
  )
}

export default Carte
