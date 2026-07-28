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
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ingredient } from '../../Models/Entities/Ingredient';
import { ValidatorFn } from '@angular/forms';
import { Step } from '../../Models/Entities/Step';
import { MediaService } from '../../Services/media.services.common/media.service';
import { ToastrService } from 'ngx-toastr';
import { RecipeListService } from '../../Services/recipe-list.service';
import { Router } from '@angular/router';

export function ingredientValidator(ingredientCount: number): ValidatorFn {
  return (control: AbstractControl<string>): {[key: string]: any} | null => {
    const forbidden = ingredientCount < 1 && (control.value === "" || control.value === undefined);

    return forbidden ? {'forbiddenEmail': {value: control.value}} : null;
  };
}

@Component({
    selector: 'app-recipe-component',
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
    templateUrl: './recipe.component.html',
    styleUrl: './recipe.component.scss',
})
export class RecipeComponent {
    recipeRequest = signal(new Recipe());

    recipe = input<Recipe>(new Recipe());
    isEditable = input<boolean>(false);

    recipeTypes: WritableSignal<Type[]>;

    formGroup!: FormGroup;
    isSubmit: boolean = false;

    get ingredients() {
        return this.formGroup.get('ingredients') as FormArray;
    }

    get steps() {
        return this.formGroup.get('steps') as FormArray;
    }

    constructor(
        private recipeService: RecipeService,
        private formBuilder: FormBuilder,
        private mediaService: MediaService,
        private recipeListService: RecipeListService,
        private toastrService: ToastrService,
        private router: Router,
    ) {
        this.recipeTypes = this.recipeService.recipeTypes;
    }

    async ngOnInit() {     
        this.recipeRequest.set(this.recipe());
        this.createForm();
    }

    private createForm() {
        
        this.formGroup = this.formBuilder.group({
            title: [this.recipeRequest().title, Validators.required],
            typeID: [this.recipeRequest().typeID.toString(), Validators.required],
            newIngredient: ["", null],
            ingredients: this.formBuilder.array([]), // le form array sert pour les formulaire dynamique, pour des listes
            steps: this.formBuilder.array([]),
        });  

        // peuplement des formArray des ingrédients et étapes
        if(this.recipeRequest().id > 0){
            this.recipeRequest().ingredients.forEach((ingredient : Ingredient, index: number) => {
                // on créée le formGroup d'une ligne d'ingredient
                // le formGroupName permet d'accéder à chaque FormGroup individuel dans le FormArray
                this.ingredients.push(this.createIngredientFormGroup(ingredient));
            })

            this.recipeRequest().steps.forEach((step : Step, index: number) => {
                this.steps.push(this.createStepFormGroup(step));
            })     
        }
    }

    private createIngredientFormGroup(ingredient : Ingredient){
        return this.formBuilder.group({ ingredient: [ingredient.name], });
    }

    private createStepFormGroup(step : Step){
        return this.formBuilder.group({ stepTitle: [step.title], stepContent: [step.content], });
    }

    async submit() {
        this.formGroup.markAllAsTouched();

        if(!this.formGroup.invalid && !this.isSubmit){
            this.isSubmit = true;

            const value = this.formGroup.value;

            // on reconstruit l'objet recette
            this.recipeRequest.update((recipe: Recipe) => { 
                recipe.title = this.formGroup.get("title")?.value;
                recipe.typeID = this.formGroup.get("typeID")?.value;
                
                recipe.ingredients = value.ingredients.map( (element: any) => {
                    return {name : element.ingredient} as Ingredient
                });

                recipe.steps = value.steps.map( (element: any, i: number) => {
                    return {title : element.stepTitle, content: element.stepContent, position: i + 1} as Step
                });

                return recipe;
            })

            if( this.recipeRequest().id > 0){
                const isSuccess = await this.recipeService.update(this.recipeRequest());

                if(isSuccess){
                    this.toastrService.success(`Modification effectuée`);

                    await this.recipeListService.refreshResult(); 
                }else{
                    this.toastrService.error(`Une erreur est survenue`);
                }

                this.isSubmit = false;
            }else{
                const isSuccess = await this.recipeService.create(this.recipeRequest());

                if(isSuccess){
                    this.toastrService.success(`Création effectuée`);
                }else{
                    this.toastrService.error(`Une erreur est survenue`);
                }
                
                await this.recipeListService.reloadPage(); 
                await this.recipeListService.loadNextPage();

                this.isSubmit = false;

                this.router.navigate(["recipes"]);
            }  
        }
    }

    async onClickPicture(){
        const isAuth = await this.mediaService.requestPhotoPermissions();

        if(!isAuth) 
            return;

        const photo = await this.mediaService.pickFromGallery(true);
    
        let recipeRequest = this.recipeRequest();
        recipeRequest.picture = photo.base64String;

        this.recipeRequest.set({...recipeRequest});
    }

    addIngredient(){
        this.formGroup.get("newIngredient")?.markAsTouched();

        this.ingredients.push(this.createIngredientFormGroup({ name: this.formGroup.get("newIngredient")?.value } as Ingredient));

        // on reset l'input de création d'ingrédient
        this.formGroup.get("newIngredient")?.setValue("");
        this.formGroup.get("newIngredient")?.reset();
    }

    removeIngredient(index: number){
        this.ingredients.removeAt(index);
    }
    
    addStep(){
        this.steps.push(this.createStepFormGroup(new Step()));
    }

    removeStep(index: number){
        this.steps.removeAt(index);
    }

    getFormIngredientName(index: number){
        return `ingredient${index + 1}`;
    }

    getFormStepName(index: number){
        return `step${index + 1}`;
    }

    getSrcPicture(){
        return this.recipeService.getSrcPicture(this.recipeRequest());
    }
}
