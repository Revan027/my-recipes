import { Component, signal } from '@angular/core';
import { VersionNumber } from '../../../components/version-number/version-number';
import { PageHeader } from '../../../components/page-header/page-header';
import { MatIconModule } from '@angular/material/icon';
import { GroqService } from '../../../Services/groq.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuWeek } from '../../../Models/Entities/MenuWeek';
import { RecipeService } from '../../../Services/recipe.service';

@Component({
    selector: 'app-menus',
    imports: [PageHeader, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './menus.html',
    styleUrl: './menus.scss',
})
export class Menus {
    protected hasLoading = signal<boolean>(false);

    constructor(private groqService: GroqService, private recipeService: RecipeService){

    }

    async onGenerateIdea(){
        this.setHasLoading(true);
        const recipes = await this.recipeService.getAllLight();
        const response = await this.groqService.generateMenuRequest(recipes);
        //gestino d'erreur a faire. faire ajouter le joru de la semine et l'anné à grocq
        // lui expliquer que perdio MATIN SOIR en string
        const menuWeek = JSON.parse(response.choices[0].message.content as string) as MenuWeek;
        console.log(menuWeek);
        alert(JSON.stringify(menuWeek, null, 2));
        this.setHasLoading(false);
    }

    setHasLoading(value: boolean){
        this.hasLoading.set(value)
    }
}
