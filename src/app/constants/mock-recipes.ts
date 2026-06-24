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

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    typeID: 1,
    type: MOCK_TYPES[0],
    title: 'Velouté de potimarron',
    picture: 'assets/images/recipes/veloute-potimarron.jpg',
  },
  {
    id: 2,
    typeID: 2,
    type: MOCK_TYPES[1],
    title: 'Bœuf bourguignon',
    picture: 'assets/images/recipes/boeuf-bourguignon.jpg',
  },
  {
    id: 3,
    typeID: 2,
    type: MOCK_TYPES[1],
    title: 'Risotto aux champignons',
    picture: 'assets/images/recipes/risotto-champignons.jpg',
  },
  {
    id: 4,
    typeID: 3,
    type: MOCK_TYPES[2],
    title: 'Fondant au chocolat',
    picture: 'assets/images/recipes/fondant-chocolat.jpg',
  },
  {
    id: 5,
    typeID: 3,
    type: MOCK_TYPES[2],
    title: 'Tarte aux pommes',
    picture: 'assets/images/recipes/tarte-pommes.jpg',
  },
  {
    id: 6,
    typeID: 4,
    type: MOCK_TYPES[3],
    title: 'Houmous maison',
    picture: 'assets/images/recipes/houmous.jpg',
  },
];

export const MOCK_STEPS: Step[] = [
  // Recette 1 - Velouté de potimarron
  { id: 1, recipeID: 1, position: 1, title: 'Préparer les légumes', content: 'Éplucher le potimarron, retirer les graines et le couper en cubes. Émincer l’oignon.' },
  { id: 2, recipeID: 1, position: 2, title: 'Faire revenir', content: 'Faire fondre l’oignon dans une casserole avec un filet d’huile, puis ajouter les cubes de potimarron.' },
  { id: 3, recipeID: 1, position: 3, title: 'Cuire', content: 'Couvrir de bouillon de légumes et laisser mijoter 25 minutes jusqu’à ce que le potimarron soit tendre.' },
  { id: 4, recipeID: 1, position: 4, title: 'Mixer et servir', content: 'Mixer finement, ajouter une cuillère de crème, saler, poivrer et servir chaud.' },

  // Recette 2 - Bœuf bourguignon
  { id: 5, recipeID: 2, position: 1, title: 'Saisir la viande', content: 'Faire dorer les morceaux de bœuf sur toutes les faces dans une cocotte avec un peu d’huile.' },
  { id: 6, recipeID: 2, position: 2, title: 'Ajouter la garniture', content: 'Ajouter les oignons, les carottes et l’ail, puis singer avec une cuillère de farine.' },
  { id: 7, recipeID: 2, position: 3, title: 'Mouiller au vin', content: 'Verser le vin rouge et le bouillon, ajouter le bouquet garni et porter à frémissement.' },
  { id: 8, recipeID: 2, position: 4, title: 'Mijoter', content: 'Couvrir et laisser mijoter à feu doux pendant 2h30. Ajouter les champignons en fin de cuisson.' },

  // Recette 3 - Risotto aux champignons
  { id: 9, recipeID: 3, position: 1, title: 'Préparer le bouillon', content: 'Maintenir le bouillon de légumes au chaud dans une casserole à part.' },
  { id: 10, recipeID: 3, position: 2, title: 'Nacrer le riz', content: 'Faire revenir l’échalote, ajouter le riz arborio et remuer jusqu’à ce qu’il devienne translucide.' },
  { id: 11, recipeID: 3, position: 3, title: 'Cuisson au bouillon', content: 'Ajouter le bouillon louche par louche en remuant, jusqu’à absorption complète à chaque fois.' },
  { id: 12, recipeID: 3, position: 4, title: 'Finition', content: 'Incorporer les champignons poêlés, le parmesan et une noix de beurre. Servir aussitôt.' },

  // Recette 4 - Fondant au chocolat
  { id: 13, recipeID: 4, position: 1, title: 'Faire fondre le chocolat', content: 'Faire fondre le chocolat avec le beurre au bain-marie.' },
  { id: 14, recipeID: 4, position: 2, title: 'Mélanger', content: 'Fouetter les œufs avec le sucre, puis incorporer le chocolat fondu et la farine.' },
  { id: 15, recipeID: 4, position: 3, title: 'Cuire', content: 'Verser dans des moules et enfourner 10 minutes à 200°C pour garder un cœur coulant.' },

  // Recette 5 - Tarte aux pommes
  { id: 16, recipeID: 5, position: 1, title: 'Préparer la pâte', content: 'Étaler la pâte brisée dans un moule et la piquer à la fourchette.' },
  { id: 17, recipeID: 5, position: 2, title: 'Garnir', content: 'Disposer les pommes coupées en lamelles en rosace sur la pâte.' },
  { id: 18, recipeID: 5, position: 3, title: 'Cuire', content: 'Saupoudrer de sucre, parsemer de noisettes de beurre et cuire 35 minutes à 180°C.' },

  // Recette 6 - Houmous maison
  { id: 19, recipeID: 6, position: 1, title: 'Mixer les pois chiches', content: 'Mixer les pois chiches égouttés avec le tahin, le jus de citron et l’ail.' },
  { id: 20, recipeID: 6, position: 2, title: 'Assaisonner', content: 'Ajouter l’huile d’olive, le cumin, du sel et de l’eau jusqu’à obtenir une texture onctueuse.' },
  { id: 21, recipeID: 6, position: 3, title: 'Dresser', content: 'Verser dans un bol, arroser d’huile d’olive et saupoudrer de paprika avant de servir.' },
];
