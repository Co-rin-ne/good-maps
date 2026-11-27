-- Structure de la base de données Good Maps.
-- "IF NOT EXISTS" permet de relancer ce script sans erreur si la table existe déjà.

CREATE TABLE IF NOT EXISTS lieux (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  nom             TEXT    NOT NULL,
  -- Catégorie limitée à une liste fixe (contrainte CHECK)
  categorie       TEXT    NOT NULL CHECK (categorie IN ('culture', 'nature', 'sport', 'gastronomie')),
  description     TEXT    NOT NULL,
  adresse         TEXT    NOT NULL,
  latitude        REAL    NOT NULL,
  longitude       REAL    NOT NULL,
  -- SQLite n'a pas de type booléen : 1 = oui, 0 = non
  accessible_pmr  INTEGER NOT NULL DEFAULT 0 CHECK (accessible_pmr IN (0, 1)),
  prix            TEXT    NOT NULL CHECK (prix IN ('gratuit', '€', '€€', '€€€')),
  -- Horaires au format "HH:MM"
  heure_ouverture TEXT    NOT NULL,
  heure_fermeture TEXT    NOT NULL,
  telephone       TEXT,
  site            TEXT
);
