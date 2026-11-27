// Route des suggestions : POST /api/suggestions
// 1. Vérifie le profil   2. Filtre les lieux candidats (règles strictes)
// 3. Demande à l'IA d'en choisir un   4. Vérifie la réponse de l'IA
// 5. Renvoie le lieu avec les VRAIES infos de la base (horaires, téléphone, site)
import { Router } from 'express';
import { formaterLieu } from '../services/lieux.js';
import { champsInvalides } from '../services/profil.js';
import { filtrerCandidats, heureParis, estOuvert } from '../services/candidats.js';

// Nombre maximum de lieux envoyés à l'IA (un message court = une réponse plus rapide)
const MAX_CANDIDATS = 8;
const TITRE_MAX = 80;
const DESCRIPTION_MAX = 400;

// Corrige les contractions que le petit modèle oublie souvent :
// "Visite de le Musée" -> "Visite du Musée", "Balade à le Jardin" -> "Balade au Jardin"
// (?<!\p{L}) et (?!\p{L}) : "pas de lettre juste avant / juste après", accents compris.
// On n'utilise pas \b, qui ne reconnaît pas les lettres accentuées comme "à".
const CONTRACTIONS = [
  [/(?<!\p{L})de le(?!\p{L})/gu, 'du'],
  [/(?<!\p{L})de les(?!\p{L})/gu, 'des'],
  [/(?<!\p{L})à le(?!\p{L})/gu, 'au'],
  [/(?<!\p{L})à les(?!\p{L})/gu, 'aux'],
];

export function corrigerContractions(texte) {
  return CONTRACTIONS.reduce((resultat, [motif, remplacement]) => resultat.replace(motif, remplacement), texte);
}

// Une liste d'identifiants de lieux est valide si c'est un tableau d'au plus 50 entiers
function estListeIds(valeur) {
  return Array.isArray(valeur) && valeur.length <= 50 && valeur.every(Number.isInteger);
}

// Vérifie la réponse de l'IA. Renvoie null si elle est inutilisable.
function verifierReponseIA(reponse, candidats) {
  if (typeof reponse !== 'object' || reponse === null) return null;

  const lieu = candidats.find((candidat) => candidat.id === reponse.id_lieu);
  const titre = typeof reponse.titre === 'string' ? reponse.titre.trim() : '';
  const description = typeof reponse.description === 'string' ? reponse.description.trim() : '';

  // Lieu inventé ou texte vide : on refuse la réponse
  if (!lieu || titre === '' || description === '') return null;

  return {
    lieu,
    titre: corrigerContractions(titre).slice(0, TITRE_MAX),
    description: corrigerContractions(description).slice(0, DESCRIPTION_MAX),
  };
}

// demanderIA : fonction qui interroge l'IA (remplacée par une fausse IA dans les tests)
// horloge : fonction qui donne la date actuelle (remplacée dans les tests)
export default function creerRouterSuggestions(db, { demanderIA, horloge }) {
  const router = Router();

  router.post('/', async (req, res) => {
    // exclure : lieux déjà proposés ; favoris : lieux aimés par la personne
    const { profil, exclure = [], favoris = [] } = req.body ?? {};

    const invalides = champsInvalides(profil);
    if (invalides.length > 0) {
      return res.status(400).json({ erreur: `Profil invalide : ${invalides.join(', ')}` });
    }
    if (!estListeIds(exclure)) {
      return res.status(400).json({ erreur: 'Liste "exclure" invalide' });
    }
    if (!estListeIds(favoris)) {
      return res.status(400).json({ erreur: 'Liste "favoris" invalide' });
    }

    const heure = heureParis(horloge());
    const lieux = db.prepare('SELECT * FROM lieux').all();
    // Les favoris sont déjà connus de la personne : on ne les repropose pas,
    // mais on les donne à l'IA pour qu'elle propose un lieu qui leur ressemble
    const lieuxAimes = lieux.filter((lieu) => favoris.includes(lieu.id));
    const candidats = filtrerCandidats(lieux, profil, heure, [...exclure, ...favoris])
      .slice(0, MAX_CANDIDATS)
      .map((lieu) => ({ ...lieu, ouvert: estOuvert(lieu, heure) }));

    if (candidats.length === 0) {
      return res.status(404).json({
        erreur: 'Aucun lieu ne correspond à votre profil. Essayez d\'élargir vos centres d\'intérêt ou votre budget.',
      });
    }

    // On demande à l'IA. Si elle ne répond pas ou répond n'importe quoi,
    // on prend le premier candidat avec sa description de la base ("secours") :
    // l'utilisateur a toujours une suggestion fiable.
    let suggestion = null;
    try {
      suggestion = verifierReponseIA(await demanderIA(profil, candidats, heure, lieuxAimes), candidats);
    } catch (erreur) {
      console.error('Erreur IA :', erreur.message);
    }

    const source = suggestion ? 'ia' : 'secours';
    if (!suggestion) {
      const [premier] = candidats;
      suggestion = { lieu: premier, titre: premier.nom, description: premier.description };
    }

    const { ouvert, ...lieu } = suggestion.lieu;
    res.json({
      lieu: formaterLieu(lieu),
      titre: suggestion.titre,
      description: suggestion.description,
      ouvert,
      source,
    });
  });

  return router;
}
