// Tests du formulaire de bienvenue : affichage des erreurs et envoi du profil
import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import FormulaireBienvenue from './FormulaireBienvenue.jsx'

function remplirFormulaire() {
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: '  Corinne  ' } })
  fireEvent.change(screen.getByLabelText("Besoins d'accessibilité"), { target: { value: 'pmr' } })
  fireEvent.click(screen.getByLabelText('Culture'))
  fireEvent.change(screen.getByLabelText('Budget'), { target: { value: '€€' } })
  fireEvent.change(screen.getByLabelText('Avec qui ?'), { target: { value: 'amis' } })
}

test('affiche des erreurs si le formulaire est envoyé vide', () => {
  const onValider = vi.fn()
  render(<FormulaireBienvenue onValider={onValider} onFermer={vi.fn()} />)

  fireEvent.click(screen.getByRole('button', { name: 'Passer à la carte' }))

  expect(screen.getByText('Indique ton prénom.')).toBeInTheDocument()
  expect(screen.getByText("Choisis au moins un centre d'intérêt.")).toBeInTheDocument()
  expect(onValider).not.toHaveBeenCalled()
})

test('envoie le profil rempli, avec le prénom nettoyé des espaces', () => {
  const onValider = vi.fn()
  render(<FormulaireBienvenue onValider={onValider} onFermer={vi.fn()} />)

  remplirFormulaire()
  fireEvent.click(screen.getByRole('button', { name: 'Passer à la carte' }))

  expect(onValider).toHaveBeenCalledWith({
    prenom: 'Corinne',
    ville: 'paris',
    accessibilite: 'pmr',
    interets: ['culture'],
    budget: '€€',
    compagnie: 'amis',
  })
})

test('la croix ferme le formulaire', () => {
  const onFermer = vi.fn()
  render(<FormulaireBienvenue onValider={vi.fn()} onFermer={onFermer} />)

  fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))
  expect(onFermer).toHaveBeenCalled()
})
