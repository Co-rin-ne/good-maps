-- Lieux de départ (Paris). Les horaires sont indicatifs et simplifiés :
-- ils changent selon les jours et les saisons, à vérifier sur les sites officiels.
-- Les numéros de téléphone sont à compléter (NULL = non renseigné).

INSERT INTO lieux (nom, categorie, description, adresse, latitude, longitude, accessible_pmr, prix, heure_ouverture, heure_fermeture, telephone, site) VALUES
('Opéra Garnier', 'culture', 'Opéra du XIXe siècle, célèbre pour son grand escalier et son plafond peint par Chagall.', 'Place de l''Opéra, 75009 Paris', 48.8720, 2.3316, 1, '€€', '10:00', '17:00', NULL, 'https://www.operadeparis.fr'),
('Musée du Louvre', 'culture', 'Le plus grand musée du monde : la Joconde, la Vénus de Milo et des milliers d''œuvres.', 'Rue de Rivoli, 75001 Paris', 48.8606, 2.3376, 1, '€€€', '09:00', '18:00', NULL, 'https://www.louvre.fr'),
('Musée d''Orsay', 'culture', 'Musée installé dans une ancienne gare, consacré à l''art de 1848 à 1914, dont les impressionnistes.', '1 rue de la Légion d''Honneur, 75007 Paris', 48.8600, 2.3266, 1, '€€', '09:30', '18:00', NULL, 'https://www.musee-orsay.fr'),
('Sainte-Chapelle', 'culture', 'Chapelle gothique aux vitraux exceptionnels, sur l''île de la Cité.', '10 boulevard du Palais, 75001 Paris', 48.8554, 2.3450, 0, '€€', '09:00', '19:00', NULL, 'https://www.sainte-chapelle.fr'),
('Cité des sciences et de l''industrie', 'culture', 'Musée des sciences interactif, idéal en famille.', '30 avenue Corentin Cariou, 75019 Paris', 48.8956, 2.3880, 1, '€€', '09:30', '18:00', NULL, 'https://www.cite-sciences.fr'),
('Tour Eiffel', 'culture', 'Le monument emblématique de Paris, avec une vue sur toute la ville.', 'Champ de Mars, 75007 Paris', 48.8584, 2.2945, 1, '€€€', '09:30', '23:00', NULL, 'https://www.toureiffel.paris'),
('Jardin du Luxembourg', 'nature', 'Grand jardin à la française avec bassin, statues et chaises en libre accès.', 'Rue de Médicis, 75006 Paris', 48.8462, 2.3372, 1, 'gratuit', '07:30', '21:00', NULL, NULL),
('Jardin des Plantes', 'nature', 'Jardin botanique avec grandes serres, ménagerie et Muséum d''histoire naturelle.', '57 rue Cuvier, 75005 Paris', 48.8441, 2.3596, 1, 'gratuit', '07:30', '20:00', NULL, 'https://www.jardindesplantesdeparis.fr'),
('Parc des Buttes-Chaumont', 'nature', 'Parc vallonné avec un lac, une grotte et un temple perché sur une falaise.', '1 rue Botzaris, 75019 Paris', 48.8809, 2.3828, 0, 'gratuit', '07:00', '22:00', NULL, NULL),
('Piscine Joséphine Baker', 'sport', 'Piscine flottante sur la Seine, avec un toit ouvrant en été.', 'Quai François Mauriac, 75013 Paris', 48.8360, 2.3770, 1, '€', '10:00', '21:00', NULL, NULL),
('Marché des Enfants Rouges', 'gastronomie', 'Le plus ancien marché couvert de Paris, avec des stands de cuisines du monde.', '39 rue de Bretagne, 75003 Paris', 48.8628, 2.3619, 0, '€', '08:30', '20:30', NULL, NULL);
