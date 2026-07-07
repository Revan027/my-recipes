import { Component, ElementRef, HostListener, signal, ViewChild, WritableSignal } from '@angular/core';
import { SearchField } from '../../../components/fields/search-field/search-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';;
import { RecipeService } from '../../../Services/recipe-service';
import { AppInitService } from '../../../Services/app-init.service';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeCard } from '../../../components/recipe-card/recipe-card';
import { RouterLink } from '@angular/router';
import { RecipeListService } from '../../../Services/recipe-list.service';


@Component({
  selector: 'app-recipes-list',
  imports: [SearchField, MatIconModule, MatButtonModule, RecipeCard, MatProgressSpinnerModule, RouterLink],
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.scss'
})
export class RecipesList {
  
  @ViewChild('list') list!: ElementRef;

  isAppReady: WritableSignal<boolean>;
  recipeResult: WritableSignal<RecipeResult>;
  isLoaded: WritableSignal<boolean>;

  isPageReady = signal<boolean>(false);

  pictureClass: { key: number; class: string }[] = [];

  constructor(private appInitService: AppInitService, private recipeService: RecipeService, private recipeListService: RecipeListService){
    this.isAppReady = this.appInitService.isAppReady;
    this.recipeResult = this.recipeService.recipeResult;
    this.isLoaded = this.recipeListService.isLoaded;
  }
  
  @HostListener('window:scroll')
  onScroll() { 
    const offsetScroll = 30;

    if(window.scrollY + window.innerHeight > this.list.nativeElement.scrollHeight - offsetScroll && this.isLoaded()) {   
      this.recipeListService.loadNextPage();
    }
  }

  async ngOnInit(){
    this.pictureClass = this.recipeListService.getPictureClass();

    this.isPageReady.set(true);
  }

  findPictureClass(id: number){
    return this.recipeListService.findPictureClass(this.pictureClass, id);
  }
}
