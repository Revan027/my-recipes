import { Component, DestroyRef, inject, ViewChild, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBar } from '../../../components/progress-bar/progress-bar';
import { SwipeDirective } from '../../../Services/swipe-directive';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeService } from '../../../Services/recipe-service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipeBookService } from '../../../Services/recipe-book.service';
import { RecipeComponent } from '../../../components/recipe/recipe.component';

@Component({
    selector: 'app-recipe-book',
    imports: [MatIconModule, MatButtonModule, ProgressBar, SwipeDirective, RecipeComponent],
    templateUrl: './recipe-book.html',
    styleUrl: './recipe-book.scss',
})
export class RecipeBook {
    private destroyRef = inject(DestroyRef);

    @ViewChild(SwipeDirective) swipeService!: SwipeDirective;

    recipeResult: WritableSignal<RecipeResult>;
    currentBookPage: WritableSignal<number>;

    constructor(
        private recipeService: RecipeService,
        private recipeBookService: RecipeBookService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
        this.recipeResult = this.recipeService.recipeResult;
        this.currentBookPage = this.recipeBookService.currentBookPage;
    }

    async ngOnInit() {}

    ngAfterViewInit() {
        this.activatedRoute.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(async (params) => {
                const id = (params.get('id') || 0) as number;
                const position = this.recipeResult().recipes.findIndex((x) => x.id == ((id ?? 0) as number)) + 1;
                const page = this.swipeService.findPageElement((id ?? 0) as number);

                this.swipeService.removeAnimation();
                this.currentBookPage.set(position);
                this.swipeService.translateElement((page as HTMLElement).offsetLeft);

                this.recipeBookService.currentIDPage.set(id)

                setTimeout(() => this.swipeService.addAnimation(), 400); //on laisse le temps au css de faire le transform avant de remettre l'animation
            });
    }

    onReturnBack() {
        this.router.navigate(["recipes"]);
    }

    onEditRecipe(){
        this.router.navigate(["recipes",  + this.recipeBookService.currentIDPage(), 'edit']);
    }
}
