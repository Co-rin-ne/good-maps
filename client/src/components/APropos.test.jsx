// Tests de la fenêtre "À propos"
import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import APropos from './APropos.jsx'

test("présente l'appli, l'IA et les sources", () => {
  render(<APropos onFermer={vi.fn()} />)
  expect(screen.getByRole('dialog', { name: 'À propos' })).toBeInTheDocument()
  expect(screen.getByText(/Ollama/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /OpenStreetMap/ })).toHaveAttribute('rel', 'noopener noreferrer')
})

test('se ferme avec la croix ou la touche Échap', () => {
  const onFermer = vi.fn()
  render(<APropos onFermer={onFermer} />)

  fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(onFermer).toHaveBeenCalledTimes(2)
})
