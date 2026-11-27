// Tests du filtrage des lieux candidats (règles strictes appliquées avant l'IA)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtrerCandidats, estOuvert, heureParis } from '../services/candidats.js';

const lieux = [
  { id: 1, categorie: 'culture', prix: '€€', accessible_pmr: 1, heure_ouverture: '10:00', heure_fermeture: '17:00' },
  { id: 2, categorie: 'culture', prix: '€€€', accessible_pmr: 1, heure_ouverture: '09:00', heure_fermeture: '18:00' },
  { id: 3, categorie: 'culture', prix: '€', accessible_pmr: 0, heure_ouverture: '09:00', heure_fermeture: '19:00' },
  { id: 4, categorie: 'nature', prix: 'gratuit', accessible_pmr: 1, heure_ouverture: '07:30', heure_fermeture: '21:00' },
  { id: 5, categorie: 'culture', prix: 'gratuit', accessible_pmr: 1, heure_ouverture: '20:00', heure_fermeture: '23:00' },
];

const profil = { interets: ['culture'], budget: '€€', accessibilite: 'aucun' };

test('garde seulement les centres d\'intérêt et le budget du profil', () => {
  const ids = filtrerCandidats(lieux, profil, '12:00').map((lieu) => lieu.id);
  // 2 est trop cher, 4 n'est pas de la culture
  assert.deepEqual(ids.sort(), [1, 3, 5]);
});

test('une personne PMR ne reçoit que des lieux accessibles', () => {
  const ids = filtrerCandidats(lieux, { ...profil, accessibilite: 'pmr' }, '12:00').map((lieu) => lieu.id);
  assert.ok(!ids.includes(3));
});

test('les lieux ouverts passent en premier', () => {
  const ids = filtrerCandidats(lieux, profil, '21:00').map((lieu) => lieu.id);
  assert.equal(ids[0], 5);
});

test('les lieux déjà vus sont exclus, sauf s\'il n\'en reste aucun', () => {
  assert.deepEqual(filtrerCandidats(lieux, profil, '12:00', [1, 3]).map((lieu) => lieu.id), [5]);
  assert.equal(filtrerCandidats(lieux, profil, '12:00', [1, 3, 5]).length, 3);
});

test('estOuvert compare les horaires', () => {
  assert.equal(estOuvert(lieux[0], '09:59'), false);
  assert.equal(estOuvert(lieux[0], '10:00'), true);
  assert.equal(estOuvert(lieux[0], '17:00'), false);
});

test('heureParis donne l\'heure de Paris', () => {
  // 10:30 UTC en hiver = 11:30 à Paris
  assert.equal(heureParis(new Date('2026-01-15T10:30:00Z')), '11:30');
});
