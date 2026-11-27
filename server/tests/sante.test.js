// Tests de l'API avec le lanceur de tests intégré à Node (node --test).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import creerApp from '../app.js';
import { ouvrirBase } from '../db/database.js';

let serveur;
let url;

// Avant les tests : on démarre l'API sur un port libre choisi par le système (port 0),
// avec une base temporaire en mémoire
before(() => {
  serveur = creerApp(ouvrirBase(':memory:')).listen(0);
  url = `http://localhost:${serveur.address().port}`;
});

// Après les tests : on arrête le serveur
after(() => serveur.close());

test('GET /api/sante renvoie le statut ok', async () => {
  const reponse = await fetch(`${url}/api/sante`);
  assert.equal(reponse.status, 200);
  assert.deepEqual(await reponse.json(), { statut: 'ok' });
});

test('une route inconnue renvoie 404', async () => {
  const reponse = await fetch(`${url}/api/nexiste-pas`);
  assert.equal(reponse.status, 404);
});
