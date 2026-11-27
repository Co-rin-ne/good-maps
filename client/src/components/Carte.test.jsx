// Test de la carte : on vérifie que Leaflet crée bien son conteneur,
// que la mention OpenStreetMap (obligatoire) est présente et qu'il y a un marqueur par lieu.
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Carte from './Carte.jsx'

const lieuxDeTest = [
  { id: 1, nom: 'Opéra Garnier', categorie: 'culture', latitude: 48.872, longitude: 2.3316, accessible_pmr: true },
  { id: 2, nom: 'Jardin du Luxembourg', categorie: 'nature', latitude: 48.8462, longitude: 2.3372, accessible_pmr: true },
]

test('affiche la carte Leaflet avec la mention OpenStreetMap', () => {
  const { container } = render(<Carte />)
  expect(container.querySelector('.leaflet-container')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'OpenStreetMap' })).toBeInTheDocument()
})

test('affiche un marqueur par lieu', () => {
  const { container } = render(<Carte lieux={lieuxDeTest} />)
  expect(container.querySelectorAll('.marqueur')).toHaveLength(2)
})
