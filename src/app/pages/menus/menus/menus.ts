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
        const bookRecipes = await this.recipeService.getTitles();
        const lastRecipes = await this.menuWeekService.getLastRecipes();

        let response;

        try{
            response = await this.groqService.generateMenuRequest(bookRecipes, lastRecipes);
        }
        catch(e: any){
            this.setHasLoading(false);

            throw new GroqApiError (e);
        }

        const menuWeek = JSON.parse(response.choices[0].message.content as string) as MenuWeek;

        // suppression si on redemande une génératiuon la même semaine
         await this.menuWeekService.deleteMenuWeek(menuWeek.year, menuWeek.dateWeek);

        //const isSuccess = await this.menuWeekService.create(menuWeek);
       
        if(true){
            this.toastService.success(`Sauvegarde du menu effectuée`);
        }

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
