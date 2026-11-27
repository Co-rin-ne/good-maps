// Tests des favoris
import { test, expect, beforeEach } from 'vitest'
import { chargerFavoris, enregistrerFavoris, basculerFavori, FAVORIS_MAX } from './favoris.js'

beforeEach(() => localStorage.clear())

test('ajoute puis retire un favori', () => {
  const avec = basculerFavori([1], 2)
  expect(avec).toEqual([1, 2])
  expect(basculerFavori(avec, 1)).toEqual([2])
})

test('garde au plus FAVORIS_MAX favoris en retirant les plus anciens', () => {
  const plein = Array.from({ length: FAVORIS_MAX }, (_, i) => i)
  const resultat = basculerFavori(plein, 999)
  expect(resultat).toHaveLength(FAVORIS_MAX)
  expect(resultat[0]).toBe(1)
  expect(resultat.at(-1)).toBe(999)
})

test('les favoris enregistrés sont retrouvés, un stockage invalide donne []', () => {
  enregistrerFavoris([3, 7])
  expect(chargerFavoris()).toEqual([3, 7])

  localStorage.setItem('goodmaps-favoris', '["1 OR 1=1"]')
  expect(chargerFavoris()).toEqual([])
})
