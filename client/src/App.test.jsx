// Test de l'en-tête : on vérifie que le logo et les deux boutons s'affichent
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import App from './App.jsx'

test("affiche le logo et les boutons de l'en-tête", () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /good maps/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Filtres' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Informations' })).toBeInTheDocument()
})
