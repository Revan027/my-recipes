import { Component, DestroyRef, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeService } from '../../../Services/recipe-service';
import { Recipe } from '../../../Models/Entities/Recipe';
import { RecipeComponent } from '../../../components/recipe/recipe.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-edit-recipe',
    imports: [MatButtonModule, MatIconModule, RecipeComponent],
    templateUrl: './edit-recipe.html',
    styleUrl: './edit-recipe.scss',
})
export class EditRecipe {
    recipeComponent = viewChild.required(RecipeComponent);

    private destroyRef = inject(DestroyRef);

    recipe = signal<Recipe>(new Recipe());

    recipeResult: WritableSignal<RecipeResult>;
    id?: number | null;

    constructor(
        private recipeService: RecipeService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private router: Router
    ) {
        this.recipeResult = this.recipeService.recipeResult;
    }

    ngOnInit() {
        this.activatedRoute.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(async (params) => {
                this.id = (params.get('id') || 0) as number;
                const recipe = this.recipeResult().recipes.find((x) => x.id == (this.id ?? (0 as number))) || new Recipe();

                this.recipe.set({...recipe});            
            });
    }

    onSubmit() {
        // appelle la méthode du composant enfant
        this.recipeComponent().submit();
    }

    onReturnBack() {
        if(this.id  && this.id > 0){
            this.router.navigate(["recipes",  + (this.id ?? 0)]);
        }else{
            this.router.navigate(["recipes"]);
        }  
    }
}
