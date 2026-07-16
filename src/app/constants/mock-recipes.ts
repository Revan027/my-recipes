import { Ingredient } from '../Models/Entities/Ingredient';
import { Recipe } from '../Models/Entities/Recipe';
import { Step } from '../Models/Entities/Step';
import { Type } from '../Models/Entities/Type';

export const MOCK_TYPES: Type[] = [
    { id: 1, name: 'Entrée' },
    { id: 2, name: 'Plat' },
    { id: 3, name: 'Dessert' },
    { id: 4, name: 'Apéritif' },
    { id: 5, name: 'Boisson' },
];

export const MOCK_STEPS: Step[] = [
    // Recette 1 - Velouté de potimarron
    {
        id: 1,
        recipeID: 1,
        position: 1,
        title: 'Préparer les légumes',
        content:
            'Éplucher le potimarron, retirer les graines et le couper en cubes. Émincer l’oignon.',
    },
    {
        id: 2,
        recipeID: 1,
        position: 2,
        title: 'Faire revenir',
        content:
            'Faire fondre l’oignon dans une casserole avec un filet d’huile, puis ajouter les cubes de potimarron.',
    },
    {
        id: 3,
        recipeID: 1,
        position: 3,
        title: 'Cuire',
        content:
            'Couvrir de bouillon de légumes et laisser mijoter 25 minutes jusqu’à ce que le potimarron soit tendre.',
    },
    {
        id: 4,
        recipeID: 1,
        position: 4,
        title: 'Mixer et servir',
        content: 'Mixer finement, ajouter une cuillère de crème, saler, poivrer et servir chaud.',
    },

    // Recette 2 - Bœuf bourguignon
    {
        id: 5,
        recipeID: 2,
        position: 1,
        title: 'Saisir la viande',
        content:
            'Faire dorer les morceaux de bœuf sur toutes les faces dans une cocotte avec un peu d’huile.',
    },
    {
        id: 6,
        recipeID: 2,
        position: 2,
        title: 'Ajouter la garniture',
        content:
            'Ajouter les oignons, les carottes et l’ail, puis singer avec une cuillère de farine.',
    },
    {
        id: 7,
        recipeID: 2,
        position: 3,
        title: 'Mouiller au vin',
        content:
            'Verser le vin rouge et le bouillon, ajouter le bouquet garni et porter à frémissement.',
    },
    {
        id: 8,
        recipeID: 2,
        position: 4,
        title: 'Mijoter',
        content:
            'Couvrir et laisser mijoter à feu doux pendant 2h30. Ajouter les champignons en fin de cuisson.',
    },

    // Recette 3 - Risotto aux champignons
    {
        id: 9,
        recipeID: 3,
        position: 1,
        title: 'Préparer le bouillon',
        content: 'Maintenir le bouillon de légumes au chaud dans une casserole à part.',
    },
    {
        id: 10,
        recipeID: 3,
        position: 2,
        title: 'Nacrer le riz',
        content:
            'Faire revenir l’échalote, ajouter le riz arborio et remuer jusqu’à ce qu’il devienne translucide.',
    },
    {
        id: 11,
        recipeID: 3,
        position: 3,
        title: 'Cuisson au bouillon',
        content:
            'Ajouter le bouillon louche par louche en remuant, jusqu’à absorption complète à chaque fois.',
    },
    {
        id: 12,
        recipeID: 3,
        position: 4,
        title: 'Finition',
        content:
            'Incorporer les champignons poêlés, le parmesan et une noix de beurre. Servir aussitôt.',
    },

    // Recette 4 - Fondant au chocolat
    {
        id: 13,
        recipeID: 4,
        position: 1,
        title: 'Faire fondre le chocolat',
        content: 'Faire fondre le chocolat avec le beurre au bain-marie.',
    },
    {
        id: 14,
        recipeID: 4,
        position: 2,
        title: 'Mélanger',
        content: 'Fouetter les œufs avec le sucre, puis incorporer le chocolat fondu et la farine.',
    },
    {
        id: 15,
        recipeID: 4,
        position: 3,
        title: 'Cuire',
        content:
            'Verser dans des moules et enfourner 10 minutes à 200°C pour garder un cœur coulant.',
    },

    // Recette 5 - Tarte aux pommes
    {
        id: 16,
        recipeID: 5,
        position: 1,
        title: 'Préparer la pâte',
        content: 'Étaler la pâte brisée dans un moule et la piquer à la fourchette.',
    },
    {
        id: 17,
        recipeID: 5,
        position: 2,
        title: 'Garnir',
        content: 'Disposer les pommes coupées en lamelles en rosace sur la pâte.',
    },
    {
        id: 18,
        recipeID: 5,
        position: 3,
        title: 'Cuire',
        content:
            'Saupoudrer de sucre, parsemer de noisettes de beurre et cuire 35 minutes à 180°C.',
    },

    // Recette 6 - Houmous maison
    {
        id: 19,
        recipeID: 6,
        position: 1,
        title: 'Mixer les pois chiches',
        content: 'Mixer les pois chiches égouttés avec le tahin, le jus de citron et l’ail.',
    },
    {
        id: 20,
        recipeID: 6,
        position: 2,
        title: 'Assaisonner',
        content:
            'Ajouter l’huile d’olive, le cumin, du sel et de l’eau jusqu’à obtenir une texture onctueuse.',
    },
    {
        id: 21,
        recipeID: 6,
        position: 3,
        title: 'Dresser',
        content:
            'Verser dans un bol, arroser d’huile d’olive et saupoudrer de paprika avant de servir.',
    },

    // Recette 7 - Salade César
    {
        id: 22,
        recipeID: 7,
        position: 1,
        title: 'Préparer la salade',
        content: 'Laver et essorer la laitue romaine, puis la couper en morceaux.',
    },
    {
        id: 23,
        recipeID: 7,
        position: 2,
        title: 'Cuire le poulet',
        content:
            'Faire griller les escalopes de poulet, les assaisonner et les couper en lamelles.',
    },
    {
        id: 24,
        recipeID: 7,
        position: 3,
        title: 'Assembler',
        content:
            'Mélanger la salade avec la sauce césar, ajouter les croûtons, le parmesan et le poulet.',
    },

    // Recette 8 - Pizza Margherita
    {
        id: 25,
        recipeID: 8,
        position: 1,
        title: 'Étaler la pâte',
        content:
            'Étaler la pâte à pizza sur un plan de travail fariné jusqu’à obtenir un disque fin.',
    },
    {
        id: 26,
        recipeID: 8,
        position: 2,
        title: 'Garnir',
        content: 'Étaler la sauce tomate, répartir la mozzarella et quelques feuilles de basilic.',
    },
    {
        id: 27,
        recipeID: 8,
        position: 3,
        title: 'Cuire',
        content:
            'Enfourner 12 minutes à 250°C jusqu’à ce que la pâte soit dorée et le fromage fondu.',
    },

    // Recette 9 - Soupe à l’oignon
    {
        id: 28,
        recipeID: 9,
        position: 1,
        title: 'Émincer les oignons',
        content:
            'Émincer finement les oignons et les faire revenir doucement au beurre jusqu’à coloration.',
    },
    {
        id: 29,
        recipeID: 9,
        position: 2,
        title: 'Mouiller',
        content: 'Singer avec un peu de farine, verser le bouillon et laisser mijoter 20 minutes.',
    },
    {
        id: 30,
        recipeID: 9,
        position: 3,
        title: 'Gratiner',
        content: 'Verser dans des bols, ajouter des croûtons et du gruyère, puis gratiner au four.',
    },

    // Recette 10 - Tiramisu
    {
        id: 31,
        recipeID: 10,
        position: 1,
        title: 'Préparer la crème',
        content: 'Fouetter les jaunes d’œufs avec le sucre, puis incorporer le mascarpone.',
    },
    {
        id: 32,
        recipeID: 10,
        position: 2,
        title: 'Monter',
        content:
            'Tremper les biscuits dans le café et alterner les couches de biscuits et de crème.',
    },
    {
        id: 33,
        recipeID: 10,
        position: 3,
        title: 'Réfrigérer',
        content:
            'Saupoudrer de cacao et laisser reposer au frais au moins 4 heures avant de servir.',
    },

    // Recette 11 - Guacamole
    {
        id: 34,
        recipeID: 11,
        position: 1,
        title: 'Écraser les avocats',
        content: 'Écraser la chair des avocats à la fourchette dans un bol.',
    },
    {
        id: 35,
        recipeID: 11,
        position: 2,
        title: 'Assaisonner',
        content:
            'Ajouter le jus de citron vert, la tomate, l’oignon, la coriandre, du sel et mélanger.',
    },

    // Recette 12 - Poulet rôti
    {
        id: 36,
        recipeID: 12,
        position: 1,
        title: 'Préparer le poulet',
        content:
            'Badigeonner le poulet de beurre, saler, poivrer et glisser des herbes à l’intérieur.',
    },
    {
        id: 37,
        recipeID: 12,
        position: 2,
        title: 'Rôtir',
        content: 'Enfourner 1h15 à 200°C en arrosant régulièrement avec le jus de cuisson.',
    },
    {
        id: 38,
        recipeID: 12,
        position: 3,
        title: 'Reposer',
        content: 'Laisser reposer 10 minutes avant de découper et servir.',
    },

    // Recette 13 - Mojito
    {
        id: 39,
        recipeID: 13,
        position: 1,
        title: 'Piler',
        content: 'Piler la menthe avec le sucre et le jus de citron vert au fond du verre.',
    },
    {
        id: 40,
        recipeID: 13,
        position: 2,
        title: 'Compléter',
        content:
            'Ajouter le rhum, des glaçons et compléter avec de l’eau gazeuse. Mélanger délicatement.',
    },
];

export const MOCK_INGREDIENTS: Ingredient[] = [
    // Recette 1 - Velouté de potimarron
    { id: 1, recipeID: 1, name: 'Potimarron' },
    { id: 2, recipeID: 1, name: 'Oignon' },
    { id: 3, recipeID: 1, name: 'Bouillon de légumes' },
    { id: 4, recipeID: 1, name: 'Crème fraîche' },
    { id: 5, recipeID: 1, name: 'Huile d’olive' },

    // Recette 2 - Bœuf bourguignon
    { id: 6, recipeID: 2, name: 'Bœuf à braiser' },
    { id: 7, recipeID: 2, name: 'Vin rouge' },
    { id: 8, recipeID: 2, name: 'Carottes' },
    { id: 9, recipeID: 2, name: 'Oignons' },
    { id: 10, recipeID: 2, name: 'Champignons de Paris' },
    { id: 11, recipeID: 2, name: 'Bouquet garni' },

    // Recette 3 - Risotto aux champignons
    { id: 12, recipeID: 3, name: 'Riz arborio' },
    { id: 13, recipeID: 3, name: 'Champignons' },
    { id: 14, recipeID: 3, name: 'Échalote' },
    { id: 15, recipeID: 3, name: 'Bouillon de légumes' },
    { id: 16, recipeID: 3, name: 'Parmesan' },
    { id: 17, recipeID: 3, name: 'Beurre' },

    // Recette 4 - Fondant au chocolat
    { id: 18, recipeID: 4, name: 'Chocolat noir' },
    { id: 19, recipeID: 4, name: 'Beurre' },
    { id: 20, recipeID: 4, name: 'Œufs' },
    { id: 21, recipeID: 4, name: 'Sucre' },
    { id: 22, recipeID: 4, name: 'Farine' },

    // Recette 5 - Tarte aux pommes
    { id: 23, recipeID: 5, name: 'Pâte brisée' },
    { id: 24, recipeID: 5, name: 'Pommes' },
    { id: 25, recipeID: 5, name: 'Sucre' },
    { id: 26, recipeID: 5, name: 'Beurre' },

    // Recette 6 - Houmous maison
    { id: 27, recipeID: 6, name: 'Pois chiches' },
    { id: 28, recipeID: 6, name: 'Tahin' },
    { id: 29, recipeID: 6, name: 'Jus de citron' },
    { id: 30, recipeID: 6, name: 'Ail' },
    { id: 31, recipeID: 6, name: 'Huile d’olive' },
    { id: 32, recipeID: 6, name: 'Cumin' },

    // Recette 7 - Salade César
    { id: 33, recipeID: 7, name: 'Laitue romaine' },
    { id: 34, recipeID: 7, name: 'Escalopes de poulet' },
    { id: 35, recipeID: 7, name: 'Parmesan' },
    { id: 36, recipeID: 7, name: 'Croûtons' },
    { id: 37, recipeID: 7, name: 'Sauce césar' },

    // Recette 8 - Pizza Margherita
    { id: 38, recipeID: 8, name: 'Pâte à pizza' },
    { id: 39, recipeID: 8, name: 'Sauce tomate' },
    { id: 40, recipeID: 8, name: 'Mozzarella' },
    { id: 41, recipeID: 8, name: 'Basilic frais' },

    // Recette 9 - Soupe à l’oignon
    { id: 42, recipeID: 9, name: 'Oignons' },
    { id: 43, recipeID: 9, name: 'Beurre' },
    { id: 44, recipeID: 9, name: 'Bouillon de bœuf' },
    { id: 45, recipeID: 9, name: 'Gruyère râpé' },
    { id: 46, recipeID: 9, name: 'Croûtons' },

    // Recette 10 - Tiramisu
    { id: 47, recipeID: 10, name: 'Mascarpone' },
    { id: 48, recipeID: 10, name: 'Œufs' },
    { id: 49, recipeID: 10, name: 'Sucre' },
    { id: 50, recipeID: 10, name: 'Biscuits à la cuillère' },
    { id: 51, recipeID: 10, name: 'Café' },
    { id: 52, recipeID: 10, name: 'Cacao en poudre' },

    // Recette 11 - Guacamole
    { id: 53, recipeID: 11, name: 'Avocats' },
    { id: 54, recipeID: 11, name: 'Citron vert' },
    { id: 55, recipeID: 11, name: 'Tomate' },
    { id: 56, recipeID: 11, name: 'Oignon' },
    { id: 57, recipeID: 11, name: 'Coriandre' },

    // Recette 12 - Poulet rôti
    { id: 58, recipeID: 12, name: 'Poulet entier' },
    { id: 59, recipeID: 12, name: 'Beurre' },
    { id: 60, recipeID: 12, name: 'Thym' },
    { id: 61, recipeID: 12, name: 'Romarin' },
    { id: 62, recipeID: 12, name: 'Ail' },

    // Recette 13 - Mojito
    { id: 63, recipeID: 13, name: 'Rhum blanc' },
    { id: 64, recipeID: 13, name: 'Menthe fraîche' },
    { id: 65, recipeID: 13, name: 'Citron vert' },
    { id: 66, recipeID: 13, name: 'Sucre de canne' },
    { id: 67, recipeID: 13, name: 'Eau gazeuse' },
];

export const MOCK_RECIPES: Recipe[] = [
    {
        id: 1,
        typeID: 1,
        type: MOCK_TYPES[0],
        title: 'Velouté de potimarron',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 1),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 1),
    },
    {
        id: 2,
        typeID: 2,
        type: MOCK_TYPES[1],
        title: 'Bœuf bourguignon',
        picture: 'assets/images/recipes/boeuf-bourguignon.jpg',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 2),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 2),
    },
    {
        id: 3,
        typeID: 2,
        type: MOCK_TYPES[1],
        title: 'Risotto aux champignons',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 3),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 3),
    },
    {
        id: 4,
        typeID: 3,
        type: MOCK_TYPES[2],
        title: 'Fondant au chocolat',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 4),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 4),
    },
    {
        id: 5,
        typeID: 3,
        type: MOCK_TYPES[2],
        title: 'Tarte aux pommes',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 5),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 5),
    },
    {
        id: 6,
        typeID: 4,
        type: MOCK_TYPES[3],
        title: 'Houmous maison',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 6),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 6),
    },
    {
        id: 7,
        typeID: 1,
        type: MOCK_TYPES[0],
        title: 'Salade César',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 7),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 7),
    },
    {
        id: 8,
        typeID: 2,
        type: MOCK_TYPES[1],
        title: 'Pizza Margherita',
        picture: 'assets/images/recipes/pizza-margherita.jpg',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 8),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 8),
    },
    {
        id: 9,
        typeID: 1,
        type: MOCK_TYPES[0],
        title: 'Soupe à l’oignon',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 9),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 9),
    },
    {
        id: 10,
        typeID: 3,
        type: MOCK_TYPES[2],
        title: 'Tiramisu',
        picture: 'assets/images/recipes/tiramisu.jpg',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 10),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 10),
    },
    {
        id: 11,
        typeID: 4,
        type: MOCK_TYPES[3],
        title: 'Guacamole',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 11),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 11),
    },
    {
        id: 12,
        typeID: 2,
        type: MOCK_TYPES[1],
        title: 'Poulet rôti',
        picture: 'assets/images/recipes/poulet-roti.jpg',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 12),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 12),
    },
    {
        id: 13,
        typeID: 5,
        type: MOCK_TYPES[4],
        title: 'Mojito',
        picture: 'assets/images/recipes/mojito.jpg',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 13),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 13),
    },
];
export const MOCK_RECIPES2: Recipe[] = [
    {
        id: 14,
        typeID: 1,
        type: MOCK_TYPES[0],
        title: 'Velouté de potimarron',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 1),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 1),
    },
    {
        id: 15,
        typeID: 2,
        type: MOCK_TYPES[1],
        title: 'Bœuf bourguignon',
        picture: 'assets/images/recipes/boeuf-bourguignon.jpg',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 2),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 2),
    },
    {
        id: 16,
        typeID: 2,
        type: MOCK_TYPES[1],
        title: 'Risotto aux champignons',
        steps: MOCK_STEPS.filter((step) => step.recipeID === 3),
        ingredients: MOCK_INGREDIENTS.filter((ingredient) => ingredient.recipeID === 3),
    },
];
