import { Component, DestroyRef, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeService } from '../../../Services/recipe.service';
import { Recipe } from '../../../Models/Entities/Recipe';
import { RecipeComponent } from '../../../components/recipe/recipe.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog';
import { PDFService } from '../../../Services/pdf.service';
import { ShareService } from '../../../Services/share.service';

@Component({
    selector: 'app-edit-recipe',
    imports: [MatButtonModule, MatIconModule, RecipeComponent, MatDialogModule],
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
        private matDialog: MatDialog,
        private router: Router, 
        private PDFService: PDFService,
        private shareService: ShareService,

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

    async onSubmit() {
        // appelle la méthode du composant enfant
        //this.recipeComponent().submit();
        const uri = await this.PDFService.savePDF();
        this.shareService.share([uri]);
    }

    onDelete() {
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {
                title: 'Supprimer',
                text: "Confirmer la suppression ?"
            },
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.recipeComponent().delete();
            }
        });
    }

    onReturnBack() {
        if(this.id  && this.id > 0){
            this.router.navigate(["recipes",  + (this.id ?? 0)]);
        }else{
            this.router.navigate(["recipes"]);
        }  
    }
}
