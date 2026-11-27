// Test de la carte : on vérifie que Leaflet crée bien son conteneur
// et que la mention OpenStreetMap (obligatoire) est présente.
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Carte from './Carte.jsx'

test('affiche la carte Leaflet avec la mention OpenStreetMap', () => {
  const { container } = render(<Carte />)
  expect(container.querySelector('.leaflet-container')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'OpenStreetMap' })).toBeInTheDocument()
})
