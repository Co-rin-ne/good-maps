// Carte interactive affichée avec Leaflet et les fonds de carte OpenStreetMap.
// react-leaflet fournit des composants React autour de la bibliothèque Leaflet.
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
// Le CSS de Leaflet est obligatoire, sinon les morceaux de carte s'affichent dans le désordre
import 'leaflet/dist/leaflet.css'
import './Carte.css'

// Centre par défaut : Paris (latitude, longitude)
const CENTRE_PARIS = [48.8566, 2.3522]
const ZOOM_PAR_DEFAUT = 13

// Marqueur rouge de la maquette, dessiné en CSS (voir Carte.css).
// iconAnchor = le point de l'icône posé exactement sur les coordonnées du lieu (la pointe).
const iconeMarqueur = L.divIcon({
  className: 'marqueur',
  html: '<div class="marqueur-goutte"><span class="marqueur-point"></span></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
})

// lieux : tableau de lieux venant de l'API (vide par défaut)
function Carte({ lieux = [] }) {
  return (
    <MapContainer center={CENTRE_PARIS} zoom={ZOOM_PAR_DEFAUT} className="carte">
      {/* Les "tuiles" sont les petites images qui composent le fond de carte.
          La mention des contributeurs OpenStreetMap est obligatoire (licence). */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Un marqueur par lieu ; la "key" aide React à suivre chaque élément de la liste */}
      {lieux.map((lieu) => (
        <Marker key={lieu.id} position={[lieu.latitude, lieu.longitude]} icon={iconeMarqueur}>
          <Popup>
            <strong>{lieu.nom}</strong>
            <br />
            {lieu.categorie}
            {lieu.accessible_pmr && ' · accessible PMR'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Carte
