import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Directory } from '@capacitor/filesystem';
import { FileService } from '@common/capacitor/file.service';
import { folder } from '../constants/folder';
// Les polices de la fiche recette non éditable, telles que déclarées dans public/css/fonts.scss.
// Le bundler les inline en base64 ("loader" dans angular.json), donc ces constantes contiennent
// déjà le contenu des fichiers : c'est le format qu'attend le VFS de pdfmake, rien à convertir.
import karlaRegular from '../../../public/css/fonts/Karla/static/Karla-Regular.ttf';
import karlaBold from '../../../public/css/fonts/Karla/static/Karla-Bold.ttf';
import playfairSemiBold from '../../../public/css/fonts/Playfair_Display/static/PlayfairDisplay-SemiBold.ttf';
import playfairBold from '../../../public/css/fonts/Playfair_Display/static/PlayfairDisplay-Bold.ttf';
import { Recipe } from '../Models/Entities/Recipe';
import { Content, TDocumentDefinitions, ContentUnorderedList, ContentColumns, Column, CanvasElement } from 'pdfmake/interfaces';
import { DecimalPipe } from '@angular/common';
import { Ingredient } from '../Models/Entities/Ingredient';

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
            'PlayfairDisplay-Bold.ttf': playfairBold,
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
                bold: 'PlayfairDisplay-Bold.ttf',
            },
        });
    }

    private getIngredientPart(ingredients: Ingredient[], start: number, end: number){
        let content: Content[] = [];

        for(let i = start; i < end; i++){
            content.push({ text: ingredients[i].name,  margin: [0, 7, 0, 0] },)
        }

        return content;
    }

    async savePDF(recipe: Recipe): Promise<string>{
        const dataImage = await this.fileService.readFile(recipe.srcPicture as string);

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
            footer: function(currentPage, pageCount) { 
                return [
                    { 
                        text: `${recipe.title} - ${currentPage}/${pageCount}`,
                        fontSize: 8,
                        alignment: 'center',
                        font: 'Karla', 
                        color: '#8a8073',
                    },
                ]       
            },
            defaultStyle: {
                font: 'Karla',
            },
            pageMargins: [40, 40, 40, 40],               
            content: [
                { 
                    text: "LE CARNET",
                    color: '#bf5333',
                    fontSize: 10,  
                    margin: [0, 0, 0, 5],
                    font: 'Karla',
                    characterSpacing: 1.6,    
                    bold: true,   
                },
                { 
                    text: recipe.title,
                    fontSize: 25.5,
                    font: 'PlayfairDisplay',
                    margin: [0, 0, 0, 15],
                },
                {  
			        canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        x2: 50,
                        y1: 0,
                        y2: 0,
                        lineWidth: 2,
                        lineColor: '#bf5333',
                    }],
                    margin: [0, 0, 0, 15],
                },
                {  
                    margin: [0, 0, 0, 30],
                    image: "data:image/jpeg;base64," + dataImage.data,                 
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
            color: '#8a8073',
            characterSpacing: 1.6,  
            bold: true,        
        } as Content;

        (docDefinition.content as Content[]).push(ingredientTitle);

        let countIngredient = recipe.ingredients.length;
        let diffIngredient = countIngredient / 4;
        let startIndex = 0;
        let endIndex = 4;

        let contentColumns = { columnGap: 10 } as ContentColumns;
        let columns = [] as Column[];

        for(let i = 0; i < diffIngredient; i++){
            startIndex = i * 4;
            endIndex = endIndex * (i + 1);
            endIndex = endIndex > countIngredient ? countIngredient : endIndex;

            let column =                                             
                {
                    width: '50%',
                    markerColor: '#bf5333',
                    ul: this.getIngredientPart(recipe.ingredients, startIndex, endIndex),                    
                    fontSize: 12,  
                    margin: [0, 0, 0, 0],
                    font: 'Karla',                           
                } as Column;

            (columns).push(column);

        }
        contentColumns.columns = columns;

        (docDefinition.content as Content[]).push(contentColumns);

        // étapes
        const stepTitle = {                 
            text: "ETAPES",
            fontSize: 12,
            font: 'PlayfairDisplay',
            margin: [0, 30, 0, 15],
            color: '#8a8073',
            bold: true,
            characterSpacing: 1.6,          
        } as Content;

        (docDefinition.content as Content[]).push(stepTitle);

        for(const step of recipe.steps){
            let contentStep =
            { 
                columns: [
                    {
                        width: 'auto',
                        text: this.decimalPipe.transform(step.position,  '2.0-0'),
                        color: '#bf5333',
                        fontSize: 12,  
                        bold: true,
                        margin: [0, 0, 0, 10],
                        font: 'PlayfairDisplay', 
                        characterSpacing: 1.6,                            
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
            } as ContentColumns;

            (docDefinition.content as Content[]).push(contentStep);
        }

        //await this._pdfMake.createPdf(docDefinition).download();

        // creation du pdf
        const datas = await this._pdfMake.createPdf(docDefinition).getBase64();

        // sauvegarde du pdf en cache pour le partagé
        const result = await this.fileService.writeFile(datas, "recette.pdf", folder.My_Recipes , Directory.Cache);

        return Promise.resolve(result.uri);
    }
}
