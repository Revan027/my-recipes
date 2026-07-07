import { Component, DestroyRef, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBar } from '../../../components/progress-bar/progress-bar';
import { SwipeDirective } from '../../../Services/swipe-directive';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeService } from '../../../Services/recipe-service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipeBookService } from '../../../Services/recipe-book.service';

@Component({
  selector: 'app-recipe-book',
  imports: [MatIconModule, MatButtonModule, ProgressBar, SwipeDirective],
  templateUrl: './recipe-book.html',
  styleUrl: './recipe-book.scss'
})
export class RecipeBook {
  private destroyRef = inject(DestroyRef);

  @ViewChild('list') list!: ElementRef<HTMLDivElement>;
  @ViewChild(SwipeDirective) swipeService!: SwipeDirective;

  recipeResult: WritableSignal<RecipeResult>;
  currentBookPage: WritableSignal<number>;

  constructor(private recipeService: RecipeService, private recipeBookService: RecipeBookService, private activatedRoute: ActivatedRoute){
    this.recipeResult = this.recipeService.recipeResult;
    this.currentBookPage = this.recipeBookService.currentBookPage;
  }

  async ngOnInit(){  
  }

  ngAfterViewInit(){
  
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
      const id = params.get('id');
      const position = this.recipeResult().recipes.findIndex(x => x.id == (id ?? 0) as number) + 1;
      const page = this.swipeService.findPageElement((id ?? 0) as number);

      this.swipeService.removeAnimation();
      this.currentBookPage.set(position);
      this.swipeService.translateElement((page as HTMLElement).offsetLeft);

      setTimeout(() =>  this.swipeService.addAnimation(), 400)
    });
  }
}
