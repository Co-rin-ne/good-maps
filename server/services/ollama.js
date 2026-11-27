// Appel à l'IA locale Ollama pour choisir et présenter une activité.
// L'IA reçoit UNIQUEMENT les lieux déjà filtrés et doit répondre par l'id de l'un d'eux :
// elle choisit et rédige, elle n'invente ni lieu, ni horaire, ni numéro.

// Texte affiché à l'IA pour décrire le profil (les valeurs viennent de listes fermées)
const TEXTES_PROFIL = {
  accessibilite: {
    aucun: 'aucun besoin particulier',
    pmr: 'personne à mobilité réduite (PMR)',
    malvoyant: 'personne malvoyante',
    malentendant: 'personne malentendante',
  },
  compagnie: { seul: 'seul(e)', couple: 'en couple', famille: 'en famille', amis: 'entre amis' },
};

const CONSIGNES = `Tu es l'assistant de l'application Good Maps, qui suggère des activités adaptées à chaque personne.
Règles :
- Choisis UN SEUL lieu dans la liste fournie, celui qui convient le mieux au profil.
- Réponds avec son "id" exact. N'invente jamais de lieu, d'horaire, de prix ni de numéro de téléphone.
- "titre" : "Visite de", "Balade au", "Découverte du"... suivi du nom exact du lieu.
- "description" : 2 phrases maximum, en français simple et correct, en vouvoyant ("Découvrez", "Profitez").
  Utilise seulement les informations de la description du lieu fournie : n'invente rien
  et n'utilise pas de mots rares ou anglais. Tiens compte du profil (accessibilité, avec qui la personne sort).
- Privilégie les lieux ouverts maintenant.
- Si la personne a déjà aimé des lieux, choisis celui qui leur ressemble le plus
  (même catégorie, même ambiance) et dis-le en une courte phrase.

Exemple de bonne réponse :
{"id_lieu": 1, "titre": "Visite de l'Opéra Garnier", "description": "Explorez l'Opéra Garnier et son architecture magnifique, avec des installations pour les PMR. Idéal pour une sortie entre amis."}`;

// Format de réponse imposé à l'IA (Ollama "structured outputs") : un JSON avec ces 3 champs
const FORMAT_REPONSE = {
  type: 'object',
  properties: {
    id_lieu: { type: 'integer' },
    titre: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['id_lieu', 'titre', 'description'],
};

// Construit le message envoyé à l'IA : le profil, les lieux aimés et la liste des lieux possibles
export function construireMessage(profil, candidats, heure, lieuxAimes = []) {
  const lieux = candidats.map((lieu) => ({
    id: lieu.id,
    nom: lieu.nom,
    categorie: lieu.categorie,
    description: lieu.description,
    accessible_pmr: lieu.accessible_pmr === 1,
    prix: lieu.prix,
    ouvert_maintenant: lieu.ouvert,
  }));

  return `Profil :
- Besoins d'accessibilité : ${TEXTES_PROFIL.accessibilite[profil.accessibilite]}
- Centres d'intérêt : ${profil.interets.join(', ')}
- Budget : ${profil.budget}
- Sort : ${TEXTES_PROFIL.compagnie[profil.compagnie]}
- Heure actuelle : ${heure}

Lieux déjà aimés par la personne : ${
  lieuxAimes.length > 0 ? lieuxAimes.map((lieu) => `${lieu.nom} (${lieu.categorie})`).join(', ') : 'aucun pour le moment'
}

Lieux possibles (JSON) :
${JSON.stringify(lieux, null, 2)}`;
}

// Envoie la demande à Ollama et renvoie sa réponse brute { id_lieu, titre, description }.
// Lance une erreur si Ollama ne répond pas ou répond autre chose que du JSON.
export async function demanderSuggestion(profil, candidats, heure, lieuxAimes = []) {
  const url = process.env.OLLAMA_URL || 'http://localhost:11434';
  const modele = process.env.OLLAMA_MODEL || 'llama3.2';

  const reponse = await fetch(`${url}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modele,
      stream: false,
      format: FORMAT_REPONSE,
      // Température basse : réponses plus sages et régulières, moins d'invention
      options: { temperature: 0.3 },
      messages: [
        { role: 'system', content: CONSIGNES },
        { role: 'user', content: construireMessage(profil, candidats, heure, lieuxAimes) },
      ],
    }),
    // On n'attend pas indéfiniment : au-delà de 60 s, on abandonne
    signal: AbortSignal.timeout(60_000),
  });

  if (!reponse.ok) {
    throw new Error(`Ollama a répondu ${reponse.status}`);
  }
  const donnees = await reponse.json();
  return JSON.parse(donnees.message.content);
}
