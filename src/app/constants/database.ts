import { tableName } from './table-names';

export const DB_NAME = 'my_receipes_db';
export const DB_VERSION = 1;

export const version1: string[] = [
    `CREATE TABLE IF NOT EXISTS ${tableName.type} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );`,
    `CREATE TABLE IF NOT EXISTS ${tableName.recipe} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    picture TEXT NOT NULL,
    typeID INTEGER NOT NULL,
    FOREIGN KEY(typeID) REFERENCES ${tableName.type}(id)
  );`,
    `CREATE TABLE IF NOT EXISTS ${tableName.step} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    position INTEGER NOT NULL,
    recipeID INTEGER NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES ${tableName.recipe}(id)
  );`,
    `CREATE TABLE IF NOT EXISTS ${tableName.ingredient} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    recipeID INTEGER NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES ${tableName.recipe}(id)
  );`,
    `INSERT INTO ${tableName.type} (name) VALUES
    ('Plat'),
    ('Salade');`,
    `INSERT INTO ${tableName.recipe} (title, picture, typeID) VALUES
    ('Poulet rôti', '', 1),
    ('Salade César', '', 2),
    ('Spaghetti bolognaise', '', 1),
    ('Soupe de légumes', '', 1),
    ('Salade de fruits', '', 2);`,
    `INSERT INTO ${tableName.ingredient} (name, recipeID) VALUES
    ('Poulet', 1), ('Beurre', 1), ('Thym', 1), ('Ail', 1), ('Sel', 1),
    ('Salade romaine', 2), ('Parmesan', 2), ('Croûtons', 2), ('Poulet', 2), ('Sauce César', 2),
    ('Spaghetti', 3), ('Boeuf haché', 3), ('Tomates', 3), ('Oignon', 3), ('Ail', 3),
    ('Carottes', 4), ('Poireaux', 4), ('Pommes de terre', 4), ('Bouillon', 4), ('Sel', 4),
    ('Pommes', 5), ('Bananes', 5), ('Oranges', 5), ('Fraises', 5), ('Sucre', 5);`,
    `INSERT INTO ${tableName.step} (title, content, position, recipeID) VALUES
    ('Préchauffer', 'Préchauffer le four à 200°C.', 1, 1),
    ('Assaisonner', 'Frotter le poulet avec le beurre, le sel et le thym.', 2, 1),
    ('Enfourner', 'Enfourner le poulet pendant 1h15.', 3, 1),
    ('Arroser', 'Arroser le poulet avec son jus toutes les 20 minutes.', 4, 1),
    ('Servir', 'Laisser reposer 10 minutes puis servir.', 5, 1),
    ('Laver', 'Laver et couper la salade romaine.', 1, 2),
    ('Cuire le poulet', 'Faire cuire et émincer le poulet.', 2, 2),
    ('Mélanger', 'Mélanger la salade avec la sauce César.', 3, 2),
    ('Ajouter', 'Ajouter les croûtons et le parmesan.', 4, 2),
    ('Servir', 'Servir immédiatement.', 5, 2),
    ('Cuire les pâtes', 'Faire cuire les spaghetti dans l''eau bouillante salée.', 1, 3),
    ('Revenir la viande', 'Faire revenir le boeuf haché avec l''oignon et l''ail.', 2, 3),
    ('Ajouter les tomates', 'Ajouter les tomates et laisser mijoter 20 minutes.', 3, 3),
    ('Assaisonner', 'Saler, poivrer et ajouter des herbes.', 4, 3),
    ('Dresser', 'Égoutter les pâtes et napper de sauce.', 5, 3),
    ('Éplucher', 'Éplucher et couper les légumes en morceaux.', 1, 4),
    ('Faire revenir', 'Faire revenir les légumes quelques minutes.', 2, 4),
    ('Mouiller', 'Ajouter le bouillon et couvrir.', 3, 4),
    ('Mijoter', 'Laisser mijoter 30 minutes.', 4, 4),
    ('Mixer', 'Mixer la soupe et rectifier l''assaisonnement.', 5, 4),
    ('Laver les fruits', 'Laver tous les fruits.', 1, 5),
    ('Couper', 'Couper les fruits en dés.', 2, 5),
    ('Mélanger', 'Mélanger les fruits dans un saladier.', 3, 5),
    ('Sucrer', 'Ajouter le sucre et mélanger.', 4, 5),
    ('Réserver', 'Réserver au frais avant de servir.', 5, 5);`,
];

export const DB_UPGRADES = [{ toVersion: DB_VERSION, statements: version1 }];
