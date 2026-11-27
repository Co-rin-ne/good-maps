// Tests de la fiche de suggestion
import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import FicheSuggestion from './FicheSuggestion.jsx'
import { formaterHeure } from '../services/horaires.js'

const lieu = {
  id: 1,
  nom: 'Opéra Garnier',
  adresse: "Place de l'Opéra, 75009 Paris",
  heure_ouverture: '10:00',
  heure_fermeture: '17:30',
  site: 'https://www.operadeparis.fr',
  telephone: null,
}

const suggestion = {
  lieu,
  titre: "Visite de l'Opéra Garnier",
  description: "Explorez l'Opéra Garnier.",
  ouvert: true,
  source: 'ia',
}

test('formaterHeure écrit les heures à la française', () => {
  expect(formaterHeure('17:00')).toBe('17h')
  expect(formaterHeure('09:30')).toBe('9h30')
})

test('affiche le titre, la description et les horaires', () => {
  render(<FicheSuggestion suggestion={suggestion} />)
  expect(screen.getByRole('heading', { name: "Visite de l'Opéra Garnier" })).toBeInTheDocument()
  expect(screen.getByText("Explorez l'Opéra Garnier.")).toBeInTheDocument()
  expect(screen.getByText("Ouvert maintenant et jusqu'à 17h30")).toBeInTheDocument()
})

test("affiche l'heure d'ouverture si le lieu est fermé", () => {
  render(<FicheSuggestion suggestion={{ ...suggestion, ouvert: false }} />)
  expect(screen.getByText('Fermé pour le moment · ouvre à 10h')).toBeInTheDocument()
})

test("n'affiche que les boutons dont l'information existe", () => {
  render(<FicheSuggestion suggestion={suggestion} />)
  const reserver = screen.getByRole('link', { name: /réservez en ligne/i })
  expect(reserver).toHaveAttribute('href', 'https://www.operadeparis.fr')
  expect(reserver).toHaveAttribute('rel', 'noopener noreferrer')
  // Pas de téléphone dans la base : pas de bouton "Appelez"
  expect(screen.queryByRole('link', { name: /appelez/i })).not.toBeInTheDocument()
})

test("prévient quand la suggestion ne vient pas de l'IA", () => {
  render(<FicheSuggestion suggestion={{ ...suggestion, source: 'secours' }} />)
  expect(screen.getByText(/L'IA n'a pas pu répondre/)).toBeInTheDocument()
})

test('le cœur indique si le lieu est en favori et prévient au clic', () => {
  const onBasculerFavori = vi.fn()
  const { rerender } = render(<FicheSuggestion suggestion={suggestion} onBasculerFavori={onBasculerFavori} />)

  const coeur = screen.getByRole('button', { name: 'Ajouter aux favoris' })
  expect(coeur).toHaveAttribute('aria-pressed', 'false')
  fireEvent.click(coeur)
  expect(onBasculerFavori).toHaveBeenCalledWith(1)

  rerender(<FicheSuggestion suggestion={suggestion} estFavori onBasculerFavori={onBasculerFavori} />)
  expect(screen.getByRole('button', { name: 'Retirer des favoris' })).toHaveAttribute('aria-pressed', 'true')
})
