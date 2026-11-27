// Tests de la route POST /api/suggestions, avec une FAUSSE IA :
// les tests ne dépendent pas d'Ollama et vérifient comment le serveur
// réagit aux bonnes et aux mauvaises réponses de l'IA.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import creerApp from '../app.js';
import { ouvrirBase } from '../db/database.js';
import { corrigerContractions } from '../routes/suggestions.js';

const profil = { ville: 'paris', accessibilite: 'pmr', interets: ['culture'], budget: '€€', compagnie: 'amis' };
// Midi à Paris : la plupart des lieux sont ouverts
const horloge = () => new Date('2026-01-15T11:00:00Z');

const serveurs = [];
after(() => serveurs.forEach((serveur) => serveur.close()));

// Démarre l'API avec la fausse IA donnée et renvoie une fonction pour demander une suggestion
function demarrer(demanderIA) {
  const db = ouvrirBase(':memory:');
  const serveur = creerApp(db, { demanderIA, horloge }).listen(0);
  serveurs.push(serveur);
  const url = `http://localhost:${serveur.address().port}/api/suggestions`;

  return (corps) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps),
    });
}

test('renvoie le lieu choisi par l\'IA, avec les vraies infos de la base', async () => {
  // La fausse IA choisit le premier candidat qu'on lui propose
  const demander = demarrer(async (p, candidats) => ({
    id_lieu: candidats[0].id,
    titre: 'Une belle visite',
    description: 'Description écrite par l\'IA.',
  }));

  const reponse = await demander({ profil });
  assert.equal(reponse.status, 200);

  const suggestion = await reponse.json();
  assert.equal(suggestion.source, 'ia');
  assert.equal(suggestion.titre, 'Une belle visite');
  assert.equal(suggestion.lieu.categorie, 'culture');
  assert.equal(suggestion.lieu.accessible_pmr, true);
  assert.equal(typeof suggestion.ouvert, 'boolean');
});

test('si l\'IA invente un lieu, le serveur utilise une suggestion de secours', async () => {
  const demander = demarrer(async () => ({ id_lieu: 9999, titre: 'Lieu inventé', description: 'Faux.' }));

  const suggestion = await (await demander({ profil })).json();
  assert.equal(suggestion.source, 'secours');
  assert.notEqual(suggestion.titre, 'Lieu inventé');
});

test('si l\'IA ne répond pas, le serveur utilise une suggestion de secours', async () => {
  const demander = demarrer(async () => {
    throw new Error('Ollama est éteint');
  });

  const reponse = await demander({ profil });
  assert.equal(reponse.status, 200);
  assert.equal((await reponse.json()).source, 'secours');
});

test('l\'IA ne reçoit que des lieux qui respectent le profil', async () => {
  let candidatsRecus = [];
  const demander = demarrer(async (p, candidats) => {
    candidatsRecus = candidats;
    return null;
  });

  await demander({ profil });
  assert.ok(candidatsRecus.length > 0);
  assert.ok(candidatsRecus.every((lieu) => lieu.categorie === 'culture' && lieu.accessible_pmr === 1));
});

test('un profil invalide est refusé', async () => {
  const demander = demarrer(async () => null);

  const reponse = await demander({ profil: { ...profil, budget: 'illimité' } });
  assert.equal(reponse.status, 400);
  assert.equal((await demander({})).status, 400);
});

test('une liste "exclure" invalide est refusée', async () => {
  const demander = demarrer(async () => null);
  assert.equal((await demander({ profil, exclure: ['1 OR 1=1'] })).status, 400);
});

test('corrige les contractions oubliées par l\'IA', () => {
  assert.equal(corrigerContractions("Visite de le Musée d'Orsay"), "Visite du Musée d'Orsay");
  assert.equal(corrigerContractions('Balade à le Jardin, près de les serres'), 'Balade au Jardin, près des serres');
  // Ne touche pas aux mots qui contiennent ces lettres
  assert.equal(corrigerContractions('Visite de leur quartier'), 'Visite de leur quartier');
});
