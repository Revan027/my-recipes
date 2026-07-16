import { Component, input, signal, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Recipe } from '../../Models/Entities/Recipe';
import { DecimalPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Type } from '../../Models/Entities/Type';
import { RecipeService } from '../../Services/recipe-service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ingredient } from '../../Models/Entities/Ingredient';
import { ValidatorFn } from '@angular/forms';
import { Step } from '../../Models/Entities/Step';

export function ingredientValidator(ingredientCount: number): ValidatorFn {
  return (control: AbstractControl<string>): {[key: string]: any} | null => {
    const forbidden = ingredientCount < 1 && (control.value === "" || control.value === undefined);
    console.log(ingredientCount);
    return forbidden ? {'forbiddenEmail': {value: control.value}} : null;
  };
}

@Component({
    selector: 'app-recipe-page',
    imports: [
        MatCardModule,
        DecimalPipe,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './recipe.html',
    styleUrl: './recipe.scss',
})
export class RecipePage {
    recipeRequest = signal(new Recipe());

    recipe = input<Recipe>(new Recipe());
    isEditable = input<boolean>(false);

    recipeTypes: WritableSignal<Type[]>;

    formGroup!: FormGroup;

    constructor(
        private recipeService: RecipeService,
        private formBuilder: FormBuilder,
    ) {
        this.recipeTypes = this.recipeService.recipeTypes;
        this.recipeRequest.set(this.recipe());
    }

    async ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            title: [this.recipeRequest().title, Validators.required],
            type: [this.recipeRequest().typeID, Validators.required],
            picture: [this.recipeRequest().picture, null],
            ingredient: ["", null],
        });
    }

    submit() {
        this.formGroup.markAllAsTouched();
        console.log(this.formGroup.value);
    }

    getFormIngredientName(index: number){
        return `ingredient${index + 1}`;
    }

    getFormStepName(index: number){
        return `step${index + 1}`;
    }

    addIngredient(){
        this.formGroup.get("ingredient")?.markAsTouched();

        let recipeRequest = this.recipeRequest();
        let ingredient = { name: this.formGroup.get("ingredient")?.value } as Ingredient;
        let index = recipeRequest.ingredients.length;

        //on créer le controle
        this.formGroup.addControl(
            this.getFormIngredientName(index),
            this.formBuilder.control(ingredient.name, Validators.required),
        );

        recipeRequest.ingredients.push(ingredient);

        this.recipeRequest.set(recipeRequest);

        this.formGroup.get("ingredient")?.setValue("");
        this.formGroup.get("ingredient")?.reset();
    }

    removeIngredient(index: number){
        let recipeRequest = this.recipeRequest();

        this.formGroup.removeControl(this.getFormIngredientName(index))

        recipeRequest.ingredients.splice(index, 1);

        this.recipeRequest.set(recipeRequest);
    }
    
    addStep(){
        let recipeRequest = this.recipeRequest();
        let index = recipeRequest.steps.length;
        let step = new Step();
        step.position = index + 1;

        //on créer le controle
        this.formGroup.addControl(
            this.getFormStepName(index),
            this.formBuilder.control("", Validators.required),
        );

        recipeRequest.steps.push(step);

        this.recipeRequest.set(recipeRequest);
    }
}
