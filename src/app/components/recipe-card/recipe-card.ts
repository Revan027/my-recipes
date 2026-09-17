import { Component, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Recipe } from '../../Models/Entities/Recipe';
import { RecipeService } from '../../Services/recipe.service';

@Component({
    selector: 'app-recipe-card',
    imports: [MatCardModule],
    templateUrl: './recipe-card.html',
    styleUrl: './recipe-card.scss',
})
export class RecipeCard {
    recipe = input<Recipe>(new Recipe());
    pictureClass = input<string>('');
    test = signal<string>('')

    constructor(private recipeService: RecipeService) {}

    async ngOnInit() {
        this.test.set(this.recipeService.getSrcPicture(this.recipe()))
    }

    getSrcPicture(){
        return this.recipeService.getSrcPicture(this.recipe());
    }
}
