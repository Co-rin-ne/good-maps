// Tests de la validation et de la mémorisation du profil
import { test, expect, beforeEach } from 'vitest'
import { validerProfil, chargerProfil, enregistrerProfil } from './profil.js'

const profilValide = {
  prenom: 'Corinne',
  ville: 'paris',
  accessibilite: 'pmr',
  interets: ['culture', 'nature'],
  budget: '€€',
  compagnie: 'amis',
}

beforeEach(() => localStorage.clear())

test('un profil complet est valide', () => {
  expect(validerProfil(profilValide)).toEqual({})
})

test('un profil vide renvoie une erreur pour chaque champ obligatoire', () => {
  const erreurs = validerProfil({ prenom: '', interets: [] })
  expect(Object.keys(erreurs)).toEqual(['prenom', 'ville', 'accessibilite', 'interets', 'budget', 'compagnie'])
})

test('une valeur hors de la liste est refusée', () => {
  const erreurs = validerProfil({ ...profilValide, budget: '€€€€', interets: ['shopping'] })
  expect(erreurs.budget).toBeDefined()
  expect(erreurs.interets).toBeDefined()
})

test('un prénom trop long est refusé', () => {
  expect(validerProfil({ ...profilValide, prenom: 'a'.repeat(31) }).prenom).toBeDefined()
})

test('le profil enregistré est retrouvé au chargement', () => {
  enregistrerProfil(profilValide)
  expect(chargerProfil()).toEqual(profilValide)
})

test('un stockage abîmé ou modifié à la main donne null', () => {
  localStorage.setItem('goodmaps-profil', '{pas du json')
  expect(chargerProfil()).toBeNull()

  localStorage.setItem('goodmaps-profil', JSON.stringify({ ...profilValide, budget: 'gratuit!!' }))
  expect(chargerProfil()).toBeNull()
})
