// Tests de la route /api/lieux, avec une base temporaire en mémoire
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import creerApp from '../app.js';
import { ouvrirBase } from '../db/database.js';

let serveur;
let url;

before(() => {
  serveur = creerApp(ouvrirBase(':memory:')).listen(0);
  url = `http://localhost:${serveur.address().port}`;
});

after(() => serveur.close());

test('GET /api/lieux renvoie les lieux de départ', async () => {
  const reponse = await fetch(`${url}/api/lieux`);
  assert.equal(reponse.status, 200);

  const lieux = await reponse.json();
  assert.ok(lieux.length > 0);

  const opera = lieux.find((lieu) => lieu.nom === 'Opéra Garnier');
  assert.ok(opera);
  assert.equal(typeof opera.latitude, 'number');
  assert.equal(opera.accessible_pmr, true);
});

test('GET /api/lieux?categorie=nature ne renvoie que des lieux nature', async () => {
  const reponse = await fetch(`${url}/api/lieux?categorie=nature`);
  const lieux = await reponse.json();

  assert.ok(lieux.length > 0);
  assert.ok(lieux.every((lieu) => lieu.categorie === 'nature'));
});

test('une catégorie inconnue renvoie une erreur 400', async () => {
  const reponse = await fetch(`${url}/api/lieux?categorie=inconnue`);
  assert.equal(reponse.status, 400);
});

test('une tentative d\'injection SQL est refusée', async () => {
  const injection = encodeURIComponent("nature' OR '1'='1");
  const reponse = await fetch(`${url}/api/lieux?categorie=${injection}`);
  assert.equal(reponse.status, 400);
});
