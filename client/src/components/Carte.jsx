// Carte interactive affichée avec Leaflet et les fonds de carte OpenStreetMap.
// react-leaflet fournit des composants React autour de la bibliothèque Leaflet.
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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

// Déplace la carte en douceur vers le lieu sélectionné.
// useMap() donne accès à la carte Leaflet : il ne marche qu'à l'intérieur de MapContainer.
function Recentrer({ lieu }) {
  const carte = useMap()
  useEffect(() => {
    if (lieu) carte.flyTo([lieu.latitude, lieu.longitude], 15)
  }, [carte, lieu])
  return null
}

// lieux : tableau de lieux venant de l'API (vide par défaut)
// lieuSelectionne : lieu de la suggestion, sur lequel la carte se centre
function Carte({ lieux = [], lieuSelectionne = null }) {
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

      <Recentrer lieu={lieuSelectionne} />
    </MapContainer>
  )
}

export default Carte
