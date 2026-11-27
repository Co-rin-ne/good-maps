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

test('le bouton affiche une suggestion, sans envoyer le prénom au serveur', async () => {
  enregistrerProfil({
    prenom: 'Corinne', ville: 'paris', accessibilite: 'pmr',
    interets: ['culture'], budget: '€€', compagnie: 'amis',
  })
  const suggestion = {
    lieu: { id: 1, nom: 'Opéra Garnier', latitude: 48.872, longitude: 2.3316, adresse: 'Paris',
      heure_ouverture: '10:00', heure_fermeture: '17:00', site: null, telephone: null },
    titre: "Visite de l'Opéra Garnier",
    description: 'Une belle visite.',
    ouvert: true,
    source: 'ia',
  }
  // Fausse API : la liste des lieux, puis la suggestion
  const fausseApi = vi.fn(async (url) => ({
    ok: true,
    json: async () => (url === '/api/suggestions' ? suggestion : []),
  }))
  vi.stubGlobal('fetch', fausseApi)

  render(<App />)
  await passerLeSplash()
  await act(async () => screen.getByRole('button', { name: 'Obtenir des suggestions' }).click())

  expect(screen.getByRole('heading', { name: "Visite de l'Opéra Garnier" })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Autre suggestion' })).toBeInTheDocument()

  const [, options] = fausseApi.mock.calls.find(([url]) => url === '/api/suggestions')
  expect(JSON.parse(options.body).profil.prenom).toBeUndefined()
})

test("affiche un message si l'API ne répond pas", async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
  render(<App />)
  await passerLeSplash()

  expect(screen.getByRole('alert')).toHaveTextContent('Impossible de charger les lieux')
})
