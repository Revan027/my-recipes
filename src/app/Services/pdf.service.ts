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


    async savePDF(): Promise<string>{
        var docDefinition = {
             header: 'Fanny',

            // sans defaultStyle le rendu resterait en Roboto, les polices chargées ne serviraient à rien
            defaultStyle: {
                font: 'Karla',
            },

            content: [
                // if you don't need styles, you can use a simple string to define a paragraph
            "Je t'aime mon coeur",
            ]
        };

        // creation du pdf
        const datas = await this._pdfMake.createPdf(docDefinition).getBase64();

        // sauvegarde du pdf en cache pour le partagé
        const result = await this.fileService.writeFile(datas, "recette.pdf", folder.My_Recipes , Directory.Cache);

        return Promise.resolve(result.uri)
    }
}
