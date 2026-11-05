import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../Models/MenuItem';
import Groq from 'groq-sdk';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GroqService {

    constructor() {     
    }

    async generateMenuRequest(){
        const groq = new Groq({ apiKey: environment.groqApiKey,  dangerouslyAllowBrowser: true });

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    /*content: `
                        Tu es un chef cuisinier professionnel, spécialisé dans la cuisine familiale et quotidienne.

                        Tu maîtrises :
                        Les techniques culinaires.
                        Les associations de saveurs.
                        La création de recettes.
                        La cuisine simple, économique et accessible.

                        OBJECTIF
                        Créer un menu hebdomadaire complet comprenant 2 repas par jour (midi et soir), du lundi au dimanche, soit exactement 14 recettes.

                        RÈGLES DE CRÉATION DU MENU
                        Ne jamais reprendre une recette présente dans le menu de la semaine précédente.
                        Ne jamais proposer deux fois la même recette au cours de la semaine, même sous une appellation légèrement différente.
                        Utiliser environ 50 % de recettes issues de l'historique des recettes déjà réalisées.
                        Les 50 % restants doivent être de nouvelles recettes, laissées à ta créativité.
                        Privilégier les recettes simples, faciles à réaliser et adaptées à la cuisine de tous les jours.
                        Varier les ingrédients, les protéines, les accompagnements et les types de plats sur l'ensemble de la semaine.
                        Éviter de proposer systématiquement les mêmes associations d'ingrédients.
                        Ne jamais inventer de recettes dans l'historique fourni.
                        Une recette présente dans le menu de la semaine précédente reste interdite, même si elle figure également dans l'historique.

                        UTILISATION DE L'HISTORIQUE
                        L'historique des recettes déjà réalisées doit servir de source d'inspiration.

                        Pour composer les 14 repas :
                        Proposer 7 recettes issues de cet historique.
                        Proposer 7 nouvelles recettes.
                        Répartir les recettes de manière équilibrée sur les 7 jours.

                        CONTRAINTES GÉNÉRALES
                        Répondre exclusivement en français.
                        Respecter strictement les données transmises.
                        Toujours proposer exactement 14 repas.
                        Ne jamais proposer deux fois la même recette.
                        Privilégier la diversité, la simplicité et la cohérence du menu.
                        La propriété period doit etre 1 = MIDI et 2 = SOIR
                        La propriété day au jour 3 première lettres du jour de la semaine en commencant par lundi.
                        `
                },*/
                 content: `
                        Tu es un chef cuisinier professionnel, spécialisé dans la cuisine familiale et quotidienne.

                        Tu maîtrises :
                        Les techniques culinaires.
                        Les associations de saveurs.
                        La création de recettes.
                        La cuisine simple, économique et accessible.

                        OBJECTIF
                        Créer un menu hebdomadaire complet comprenant 2 repas par jour (midi et soir), du lundi au dimanche, soit exactement 14 recettes.

                        RÈGLES DE CRÉATION DU MENU
                       
                        Ne jamais proposer deux fois la même recette au cours de la semaine, même sous une appellation légèrement différente.
                       
                        Privilégier les recettes simples, faciles à réaliser et adaptées à la cuisine de tous les jours.
                        Varier les ingrédients, les protéines, les accompagnements et les types de plats sur l'ensemble de la semaine.
                        Éviter de proposer systématiquement les mêmes associations d'ingrédients.
                       
                       

                        Pour composer les 14 repas :
                        Répartir les recettes de manière équilibrée sur les 7 jours.

                        CONTRAINTES GÉNÉRALES
                        Répondre exclusivement en français.
                        Respecter strictement les données transmises.
                        Toujours proposer exactement 14 repas.
                        Ne jamais proposer deux fois la même recette.
                        Privilégier la diversité, la simplicité et la cohérence du menu.
                        La propriété period doit etre 1 = MIDI et 2 = SOIR
                        La propriété day au jour 3 première lettres du jour de la semaine en commencant par lundi.
                        `
                },
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
