import { tableName } from './table-names';

// Scripts à exécuter une seule fois, hors migrations.
// "guardTitle" : le script n'est pas rejoué si une recette avec ce titre existe déjà.
export const ONE_SHOT_SCRIPTS: { guardTitle: string; statements: string }[] = [
    {
        guardTitle: 'Reste de riz, oeufs et patates',
        statements: `
INSERT INTO ${tableName.recipe} (title, picture, typeID)
VALUES (
    'Reste de riz, oeufs et patates',
    NULL,
    (SELECT id FROM ${tableName.type} WHERE name = 'Plat')
);

INSERT INTO ${tableName.ingredient} (name, recipeID)
SELECT i.name, (SELECT MAX(id) FROM ${tableName.recipe})
FROM (
    SELECT 'Oeuf' AS name
    UNION ALL SELECT 'Riz'
    UNION ALL SELECT 'Patates'
    UNION ALL SELECT 'Oignons'
    UNION ALL SELECT 'Sauce tomate'
    UNION ALL SELECT 'Lait'
) AS i;

INSERT INTO ${tableName.step} (content, position, recipeID)
SELECT s.content, s.position, (SELECT MAX(id) FROM ${tableName.recipe})
FROM (
    SELECT 'Versez de l''huile d''olive dans la poêle.
Versez le riz et le faire revenir.' AS content, 1 AS position
    UNION ALL SELECT 'Couper des patates en dés et les faire dorées dans une poêle, arrosée d''huile d''olive.', 2
    UNION ALL SELECT 'Préparer l''omelette. Lait et oeuf.', 3
    UNION ALL SELECT 'Une fois les patates cuite, mettre un peu de sauce à base de tomates et remuer.', 4
    UNION ALL SELECT 'Versez l''omelette dans le riz, et la laisser cuire.
Server chaque préparation à part une fois le tout prêt.', 5
) AS s;
`,
    },
];
