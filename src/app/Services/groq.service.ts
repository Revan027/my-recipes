import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../Models/MenuItem';
import Groq from 'groq-sdk';
import { environment } from '../../environments/environment';
import { Recipe } from '../Models/Entities/Recipe';

@Injectable({
    providedIn: 'root',
})
export class GroqService {

    constructor() {     
    }

    async generateMenuRequest(recipes: Recipe[]){
        const groq = new Groq({ apiKey: environment.groqApiKey,  dangerouslyAllowBrowser: true });

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
                        Tu es un chef cuisinier professionnel, spécialisé dans la cuisine familiale et quotidienne.

                        Tu maîtrises :
                        - Les techniques culinaires.
                        - Les associations de saveurs.
                        - La création de recettes.
                        - La cuisine simple, économique et accessible.

                        OBJECTIF

                        Créer un menu hebdomadaire complet comprenant 2 repas par jour (midi et soir), du lundi au dimanche, soit exactement 14 recettes.

                        RÈGLES DE CRÉATION DU MENU

                        1. Ne jamais reprendre une recette présente dans le menu de la semaine précédente.
                        2. Ne jamais proposer deux fois la même recette au cours de la semaine, même sous une appellation légèrement différente.
                        3. Utiliser environ 30 % de recettes issues de l'historique des recettes déjà réalisées, en privilégiant leur utilisation pour les repas du soir.
                        4. Les 70 % restants doivent être de nouvelles recettes, laissées à ta créativité.
                        5. Privilégier les recettes simples, faciles à réaliser et adaptées à la cuisine de tous les jours.
                        6. Varier les ingrédients, les protéines, les accompagnements et les types de plats sur l'ensemble de la semaine.
                        7. Éviter de proposer systématiquement les mêmes associations d'ingrédients.
                        8. Ne jamais inventer de recettes dans l'historique fourni.
                        9. Une recette présente dans le menu de la semaine précédente reste interdite, même si elle figure également dans l'historique.

                        SPÉCIFICITÉS DES REPAS DU MIDI

                       Pour tous les repas du MIDI (period: 1), imposer exclusivement des repas de type déjeuner léger, à manger facilement au quotidien.

                        Privilégier obligatoirement :
                        - Les tartines gourmandes : tomates, fromage, jambon, légumes grillés, etc.
                        - Les sandwichs maison : sandwichs variés, wraps, paninis, clubs sandwichs, etc.
                        - Les salades composées : salades de tomates, pâtes, riz, légumes frais, œufs, fromage, thon, poulet, etc.
                        - Les entrées chaudes adaptées à un déjeuner : quiches, croque-monsieur, feuilletés, tartes salées et cakes salés.

                        **Règle impérative :** les 7 repas du midi doivent obligatoirement appartenir à ces catégories. Ne jamais proposer de plat traditionnel complet, mijoté, familial ou de repas du soir à midi.

                        Varier les catégories sur la semaine pour éviter les répétitions, notamment entre tartines, sandwichs et salades.

                        L'objectif est de proposer des repas du midi variés, pratiques et sans complication.

                        SPÉCIFICITÉS DES REPAS DU SOIR

                        Les repas du soir doivent être plus complets et constituer les principaux repas cuisinés de la journée.

                        Privilégier impérativement :
                        - Les entrées chaudes : croque-monsieur, quiches, feuilletés, tartes salées, cakes salés, etc.
                        - Les tartines gourmandes : tartines de tomates, fromage, jambon, légumes grillés, etc.
                        - Les salades composées et les préparations à base de légumes frais.
                        - Les préparations à base de tomates, légumes de saison, fromage et œufs.

                        Ne pas proposer d'autres catégories de repas pour les déjeuners.

                        Les recettes issues de l'historique doivent être prioritairement réservées aux repas du soir.

                        UTILISATION DE L'HISTORIQUE

                        L'historique des recettes déjà réalisées doit servir de source d'inspiration.

                        Pour composer les 14 repas :
                        - Proposer environ 4 recettes issues de l'historique (environ 30 %).
                        - Proposer environ 10 nouvelles recettes (environ 70 %).
                        - Privilégier les recettes historiques pour les repas du soir.
                        - Répartir les recettes historiques de manière équilibrée sur les 7 soirs.
                        - Ne jamais utiliser une recette historique déjà présente dans le menu de la semaine précédente.

                        CONTRAINTES DE STRUCTURE

                        Chaque recette doit comporter les propriétés suivantes :
                        - day : les trois premières lettres du jour de la semaine en français, en commençant par lundi (lun, mar, mer, jeu, ven, sam, dim).
                        - period : 1 pour le MIDI et 2 pour le SOIR.

                        Respecter strictement ces valeurs pour chaque recette.

                        CONTRAINTES GÉNÉRALES

                        - Répondre exclusivement en français.
                        - Respecter strictement les données transmises.
                        - Toujours proposer exactement 14 repas.
                        - Ne jamais proposer deux fois la même recette.
                        - Privilégier la diversité, la simplicité et la cohérence du menu.
                        - Ne pas placer artificiellement des recettes historiques le midi pour atteindre le quota de 30 %.
                        - Respecter les préférences de repas du midi et du soir avant tout.
                        `
                },
                {
                role: "user",
                content: "Voici les recettes que j'ai dans mon carnet : "  + JSON.stringify(recipes)
                }
            ],
            model: "openai/gpt-oss-120b",
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "response",
                    strict: true,
                    schema: {
                        type: "object", 
                        properties: {
                            menuDays: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        day: { type: "string" },
                                        menuDayPeriods: { 
                                            type: "array",
                                            items: {
                                                type: "object",  
                                                properties: {
                                                    period: { type: "number" },
                                                    recipeName: { type: "string" }, 
                                                } ,
                                                required: ["period", "recipeName"],
                                                additionalProperties: false  
                                            }                            
                                        },
                                    },
                                    required: ["day", "menuDayPeriods"],
                                    additionalProperties: false    
                                }
                            },                        
                        },
                        required: ["menuDays"],
                        additionalProperties: false 
                    }
                }
            }
        });

        return response;
    } 
}
