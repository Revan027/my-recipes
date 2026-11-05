import { Component, signal } from '@angular/core';
import { PageHeader } from '../../../components/page-header/page-header';
import { MatIconModule } from '@angular/material/icon';
import { GroqService } from '../../../Services/groq.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuWeek } from '../../../Models/Entities/MenuWeek';
import { RecipeService } from '../../../Services/recipe.service';
import { MOCK_RECIPES } from '../../../constants/mock-recipes';
import { Capacitor } from '@capacitor/core';
import { GroqApiError } from '../../../Models/Entities/GroqApiError';
import { MenuWeekService } from '../../../Services/menuWeek.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-menus',
    imports: [PageHeader, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './menus.html',
    styleUrl: './menus.scss',
})
export class Menus {
    protected hasLoading = signal<boolean>(false);
    protected menuWeek = signal<MenuWeek | undefined>(undefined);

    constructor(
        private groqService: GroqService, 
        private recipeService: RecipeService, 
        private menuWeekService: MenuWeekService, 
        private toastService: ToastrService){}

    async onGenerateIdea(){
        this.setHasLoading(true);

        // recupération des recettes du carnet
        const recipes = Capacitor.isNativePlatform()
            ? await this.recipeService.getAllLight()
            : MOCK_RECIPES;

        let response;

        try{
            response = await this.groqService.generateMenuRequest(recipes);
        }catch(e: any){
            this.setHasLoading(false);

            throw new GroqApiError (e);
        }

        // recupération de la semaine précédente  

        const menuWeek = JSON.parse(response.choices[0].message.content as string) as MenuWeek;
 alert(JSON.stringify(await this.menuWeekService.getAllLight(), null, 2));
        //on ajoute le resultat en base
       /*const isSuccess = await this.menuWeekService.create(menuWeek);
       
        if(isSuccess){
            this.toastService.success(`Sauvegarde du menu effectuée`);
        }else{
            this.toastService.error(`Une erreur est survenue`);
        }*/

        this.setMenuWeek(menuWeek)
        this.setHasLoading(false);
    }

    setHasLoading(value: boolean){
        this.hasLoading.set(value)
    }

    setMenuWeek(value: MenuWeek){
        this.menuWeek.set({...value})
    }
}
