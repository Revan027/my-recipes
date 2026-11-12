import { Injectable } from '@angular/core';
import Groq from 'groq-sdk';
import { environment } from '../../environments/environment';
import { Recipe } from '../Models/Entities/Recipe';
import { MenuWeek } from '../Models/Entities/MenuWeek';

const SYSTEM_PROMPT = `Tu es un chef cuisinier spécialisé dans la cuisine familiale du quotidien : simple, économique, facile à réaliser.

OBJECTIF
Créer le menu de la semaine : midi (period 1) et soir (period 2), du lundi au dimanche, soit exactement 14 recettes, toutes différentes (même sous un nom légèrement différent).

RÈGLES
- Interdit : toute recette du menu de la semaine précédente, même si elle est dans le carnet.
- Environ 4 recettes du carnet (30 %), réparties sur les soirs. Ne jamais en placer le midi juste pour atteindre ce quota. Ne jamais présenter comme venant du carnet une recette qui n'y est pas.
- Environ 10 nouvelles recettes (70 %), laissées à ta créativité.
- Cuisine exclusivement française ou italienne (traditionnelle, familiale ou variante moderne), en respectant leurs ingrédients, associations et techniques. Varier les deux sur la semaine. Aucune autre cuisine du monde.
- Interdits : pizza, soupe, dessert.
- Varier ingrédients, protéines, accompagnements et types de plats. Éviter de répéter les mêmes associations.
- Noms de recettes sans caractères spéciaux.

MIDI (period 1), règle impérative
Les 7 midis sont des déjeuners légers et pratiques, uniquement dans ces catégories, à varier sur la semaine :
- tartines gourmandes (tomates, fromage, jambon, légumes grillés...)
- sandwichs maison (wraps, paninis, clubs...)
- salades composées (tomates, pâtes, riz, légumes, oeufs, fromage, thon, poulet...)
- entrées chaudes de déjeuner (quiches, croque-monsieur, feuilletés, tartes et cakes salés)
Jamais de plat complet, mijoté ou de repas du soir à midi.

SOIR (period 2)
Repas plus complets. C'est là que vont en priorité les recettes du carnet.

PRIORITÉ : les règles midi/soir passent avant le quota de 30 %.

FORMAT
- day : lun, mar, mer, jeu, ven, sam, dim.
- year : l'année de la date du jour (YYYY).
- dateWeek : le numéro de semaine ISO de la date du jour (semaine commençant le lundi).
- Répondre en français.`;

@Injectable({
    providedIn: 'root',
})
export class GroqService {

    constructor() { }

    async generateMenuRequest(booRecipes: Recipe[], lastMenuWeek: string[]){
        const groq = new Groq({ apiKey: environment.groqApiKey,  dangerouslyAllowBrowser: true });

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: `Date du jour : ${new Date().toLocaleDateString('fr-FR')}.
Recettes de mon carnet : ${booRecipes.map(r => r.title).join(', ')}.
Menu de la semaine précédente : ${lastMenuWeek.length > 0 ? lastMenuWeek.join(', ') : 'aucun'}.`
                }
            ],
            model: "openai/gpt-oss-120b",
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "response",
                    strict: true,
                    schema: {
                        type: "object", // MenuWeek
                        properties: {
                            year: { type: "number" },
                            dateWeek: { type: "number" },
                            menuDays: {
                                type: "array", // MenuDays
                                items: {
                                    type: "object",
                                    properties: {
                                        day: { type: "string" },
                                        menuDayPeriods: { 
                                            type: "array",// MenuDayPeriods
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
                        required: ["year","dateWeek","menuDays"],
                        additionalProperties: false 
                    }
                }
            }
        });

        return response;
    } 
}
