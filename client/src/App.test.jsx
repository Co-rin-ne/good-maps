// Tests du composant principal : enchaînement des écrans.
// L'appel à l'API (fetch) est simulé : les tests du front ne dépendent pas du serveur.
// Le temps est simulé aussi (vi.useFakeTimers) pour ne pas attendre la fin du Splash.
import { render, screen, act } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App.jsx'
import { DUREE_SPLASH } from './components/Splash.jsx'
import { enregistrerProfil } from './services/profil.js'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

// Fait avancer le temps jusqu'à la fin de l'écran de démarrage
async function passerLeSplash() {
  await act(async () => vi.advanceTimersByTime(DUREE_SPLASH))
}

test("affiche d'abord l'écran de démarrage", () => {
  render(<App />)
  expect(screen.getByText("Suggestions d'activités adaptées")).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Filtres' })).not.toBeInTheDocument()
})

test('sans profil enregistré, affiche le formulaire de bienvenue après le démarrage', async () => {
  render(<App />)
  await passerLeSplash()

  expect(screen.getByRole('heading', { name: /good maps/i })).toBeInTheDocument()
  expect(screen.getByRole('dialog', { name: 'Bienvenue !' })).toBeInTheDocument()
})

test('avec un profil enregistré, va directement à la carte', async () => {
  enregistrerProfil({
    prenom: 'Corinne', ville: 'paris', accessibilite: 'aucun',
    interets: ['nature'], budget: 'gratuit', compagnie: 'seul',
  })
  render(<App />)
  await passerLeSplash()

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByText('Bonjour Corinne !')).toBeInTheDocument()
})

test("affiche un message si l'API ne répond pas", async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
  render(<App />)
  await passerLeSplash()

  expect(screen.getByRole('alert')).toHaveTextContent('Impossible de charger les lieux')
})
