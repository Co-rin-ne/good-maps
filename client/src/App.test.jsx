// Tests du composant principal. L'appel à l'API (fetch) est simulé :
// les tests du front ne doivent pas dépendre du serveur.
import { render, screen } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import App from './App.jsx'

afterEach(() => vi.unstubAllGlobals())

test("affiche le logo et les boutons de l'en-tête", () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
  render(<App />)
  expect(screen.getByRole('heading', { name: /good maps/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Filtres' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Informations' })).toBeInTheDocument()
})

test("affiche un message si l'API ne répond pas", async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
  render(<App />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger les lieux')
})
