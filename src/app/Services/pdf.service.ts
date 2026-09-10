import { Injectable, ErrorHandler } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Capacitor } from '@capacitor/core';
import { Directory } from '@capacitor/filesystem';
import { FileService } from './file.services.common/file.service';
import { Share } from '@capacitor/share';
import { folder } from '../constants/folder';

// Les polices de la fiche recette non éditable, telles que déclarées dans public/css/fonts.scss.
// Le bundler les inline en base64 ("loader" dans angular.json), donc ces constantes contiennent
// déjà le contenu des fichiers : c'est le format qu'attend le VFS de pdfmake, rien à convertir.
import karlaRegular from '../../../public/css/fonts/Karla/static/Karla-Regular.ttf';
import karlaBold from '../../../public/css/fonts/Karla/static/Karla-Bold.ttf';
import playfairSemiBold from '../../../public/css/fonts/Playfair_Display/static/PlayfairDisplay-SemiBold.ttf';
import { Recipe } from '../Models/Entities/Recipe';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Step } from '../Models/Entities/Step';

@Injectable({
    providedIn: 'root',
})
export class PDFService {
    private _pdfMake = pdfMake;

    constructor(private fileService: FileService) {
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
                    image: "data:image/jpeg;base64," + recipe.picture /*'data:image/jpeg;base64,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'*/,                 
                    cover: { width: 400, height: 400, valign: "center", align: "center" },
                },
                { // type
                    text: recipe.type.name.toUpperCase(),
                    fontSize: 9,
                    font: 'PlayfairDisplay',
                    margin: [0, 0, 0, 0],
                    color: "#bf5333",
                    characterSpacing: 2,
                }, 
            ],
        };

        // ingrédients
        for(const ingredient of recipe.ingredients){
            let contentIngredient =
                { 
                    text: ingredient.name,
                    fontSize: 11.63,
                    font: 'Karla',
                    margin: [0, 0, 0, 0],
                } as Content;

            (docDefinition.content as Content[]).push(contentIngredient)
        }

        // étapes
        for(const step of recipe.steps){
            let contentStep =
                { 
                    columns: [
                        {
                            width: 'auto',
                            text: step.position                        
                        },
                        {
                            width: 'auto',
                            text: step.content    
                        },
                        {
                        // fixed width
                        width: 100,
                        text: 'Third column'
                        },
                        {
                        // % width
                        width: '20%',
                        text: 'Fourth column'
                        }
                    ],
                    columnGap: 10

                    /*text: step.content,
                    fontSize: 11.63,
                    font: 'Karla',
                    margin: [0, 0, 0, 0],*/
                };

            (docDefinition.content as Content[]).push(contentStep)
        }
        console.log(docDefinition);
        //await this._pdfMake.createPdf(docDefinition).download();
        // creation du pdf
        const datas = await this._pdfMake.createPdf(docDefinition).getBase64();

        // sauvegarde du pdf en cache pour le partagé
        const result = await this.fileService.writeFile(datas, "recette.pdf", folder.My_Recipes , Directory.Cache);

        return Promise.resolve(result.uri)
         return Promise.resolve("")
    }
}
