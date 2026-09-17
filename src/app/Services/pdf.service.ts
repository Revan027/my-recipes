import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Directory } from '@capacitor/filesystem';
import { FileService } from './file.services.common/file.service';
import { folder } from '../constants/folder';
// Les polices de la fiche recette non éditable, telles que déclarées dans public/css/fonts.scss.
// Le bundler les inline en base64 ("loader" dans angular.json), donc ces constantes contiennent
// déjà le contenu des fichiers : c'est le format qu'attend le VFS de pdfmake, rien à convertir.
import karlaRegular from '../../../public/css/fonts/Karla/static/Karla-Regular.ttf';
import karlaBold from '../../../public/css/fonts/Karla/static/Karla-Bold.ttf';
import playfairSemiBold from '../../../public/css/fonts/Playfair_Display/static/PlayfairDisplay-SemiBold.ttf';
import { Recipe } from '../Models/Entities/Recipe';
import { Content, TDocumentDefinitions, ContentUnorderedList, ContentColumns } from 'pdfmake/interfaces';
import { DecimalPipe } from '@angular/common';

@Injectable({
    providedIn: 'root',

})
export class PDFService {
    private _pdfMake = pdfMake;

    constructor(private fileService: FileService, private decimalPipe: DecimalPipe) {
        this._pdfMake.addVirtualFileSystem(pdfFonts);

        // Le service est un singleton (providedIn: 'root'), les polices ne sont donc
        // enregistrées qu'une fois, à la construction.
        this.setFonts();
    }

    private setFonts(): void {
        // Les octets d'abord, la table des familles ensuite : addFonts ne fait que référencer
        // des noms de fichiers, ils doivent déjà exister dans le VFS au moment du rendu.
        this._pdfMake.addVirtualFileSystem({
            'Karla-Regular.ttf': karlaRegular,
            'Karla-Bold.ttf': karlaBold,
            'PlayfairDisplay-SemiBold.ttf': playfairSemiBold,
        });

        // addFonts fusionne au lieu de remplacer : le Roboto embarqué reste disponible en secours.
        this._pdfMake.addFonts({
            // Corps de la fiche : ingrédients et étapes en 400, kickers (type, numéro d'étape) en 700.
            Karla: {
                normal: 'Karla-Regular.ttf',
                bold: 'Karla-Bold.ttf',
            },
            // Le titre de la recette (h2), seule graisse de Playfair Display utilisée par la fiche.
            PlayfairDisplay: {
                normal: 'PlayfairDisplay-SemiBold.ttf',
            },
        });
    }

    private generatePDF(){

    }

    async savePDF(recipe: Recipe): Promise<string>{

        let docDefinition: TDocumentDefinitions = {
            // pdfmake n'a pas de primitive "fond de page" : il faut peindre un rectangle.
            background: (currentPage, pageSize) => ({
                canvas: [{
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: pageSize.width,
                    h: pageSize.height,
                    color: '#f6f0e4',
                }],
            }),
            defaultStyle: {
                font: 'Karla',
            },
            pageMargins: [40, 90, 40, 40],          
            header: { // titre
                text: recipe.title,
                fontSize: 25.5,
                alignment: 'center',
                font: 'PlayfairDisplay',
                margin: [0, 30, 0, 0],
            },       
            content: [
                {  
                    alignment: 'center',
                    margin: [0, 0, 0, 30],
                    image: "data:image/jpeg;base64," + recipe.picture,                 
                    cover: { width:300, height: 300, valign: "center", align: "center" },
                }, 
            ],
        };

        // ingrédients
        const ingredientTitle = {                 
            text: "INGREDIENTS",
            fontSize: 12,
            font: 'PlayfairDisplay',
            margin: [0, 0, 0, 5],
            color: "#bf5333",
            characterSpacing: 2,          
        } as Content;

        (docDefinition.content as Content[]).push(ingredientTitle);

        let sectionIngredients = {                 
            markerColor: '#bf5333',
            fontSize: 12,
            margin: [0, 0, 0, 0],
            font: 'Karla', 
            ul: [],  
        } as ContentUnorderedList;

        (docDefinition.content as Content[]).push(ingredientTitle)

        for(const ingredient of recipe.ingredients){
            (sectionIngredients.ul as string[]).push(ingredient.name)
        }

        (docDefinition.content as ContentUnorderedList[]).push(sectionIngredients);

        // ingrédients
        const stepTitle = {                 
            text: "ETAPES",
            fontSize: 12,
            font: 'PlayfairDisplay',
            margin: [0, 30, 0, 15],
            color: "#bf5333",
            characterSpacing: 2,          
        } as Content;

        (docDefinition.content as Content[]).push(stepTitle);

        // étapes
        for(const step of recipe.steps){
            let contentStep =
                { 
                    columns: [
                        {
                            width: 'auto',
                            text: this.decimalPipe.transform(step.position,  '2.0-0'),
                            color: '#bf5333',
                            fontSize: 12,
                            margin: [0, 0, 0, 10],
                            font: 'Karla', 
                                                   
                        },
                        {
                            width: 'auto',
                            text: step.content,
                            fontSize: 12,
                            margin: [0, 0, 0, 10],
                            font: 'Karla',     
                        },
                    ],
                    columnGap: 10

                    /*text: step.content,
                    fontSize: 11.63,
                    font: 'Karla',
                    margin: [0, 0, 0, 0],*/
                } as ContentColumns;

            (docDefinition.content as Content[]).push(contentStep)
        }

        // await this._pdfMake.createPdf(docDefinition).download();

        // creation du pdf
        const datas = await this._pdfMake.createPdf(docDefinition).getBase64();

        // sauvegarde du pdf en cache pour le partagé
        const result = await this.fileService.writeFile(datas, "recette.pdf", folder.My_Recipes , Directory.Cache);

        return Promise.resolve(result.uri)
    }
}
