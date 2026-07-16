import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeService } from '../../../Services/recipe-service';
import { Recipe } from '../../../Models/Entities/Recipe';
import { RecipePage } from '../../../components/recipe/recipe';

@Component({
  selector: 'app-edit-recipe',
  imports: [MatButtonModule, MatIconModule, DecimalPipe, RecipePage],
  templateUrl: './edit-recipe.html',
  styleUrl: './edit-recipe.scss'
})
export class EditRecipe {
  private destroyRef = inject(DestroyRef);

  recipe = signal<Recipe>(new Recipe());

  recipeResult: WritableSignal<RecipeResult>;

  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute)
  {
    this.recipeResult = this.recipeService.recipeResult;
  }

  ngOnInit(){
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
      const id = params.get('id');

      this.recipe.set(this.recipeResult().recipes.find(x => x.id == (id ?? 0 as number)) || new Recipe());   
    });
   }
}
