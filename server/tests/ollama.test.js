// Tests du message envoyé à l'IA (sans appeler Ollama)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construireMessage } from '../services/ollama.js';

const profil = { accessibilite: 'pmr', interets: ['culture'], budget: '€€', compagnie: 'amis' };
const candidats = [{ id: 1, nom: 'Opéra Garnier', categorie: 'culture', description: '...', accessible_pmr: 1, prix: '€€', ouvert: true }];

test('le message contient le profil en clair et les lieux possibles', () => {
  const message = construireMessage(profil, candidats, '12:00');
  assert.match(message, /mobilité réduite/);
  assert.match(message, /entre amis/);
  assert.match(message, /"nom": "Opéra Garnier"/);
  assert.match(message, /aucun pour le moment/);
});

test('le message cite les lieux aimés', () => {
  const message = construireMessage(profil, candidats, '12:00', [{ nom: 'Musée du Louvre', categorie: 'culture' }]);
  assert.match(message, /Musée du Louvre \(culture\)/);
});
