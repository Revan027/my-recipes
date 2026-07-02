import { Component, signal, WritableSignal } from '@angular/core';
import { SearchField } from '../../../components/fields/search-field/search-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';;
import { RecipeService } from '../../../Services/recipe-service';
import { AppInitService } from '../../../Services/app-init-service';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeCard } from '../../../components/recipe-card/recipe-card';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-recipes-list',
  imports: [SearchField, MatIconModule, MatButtonModule, RecipeCard, MatProgressSpinnerModule, RouterLink],
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.scss'
})
export class RecipesList {
  isAppReady: WritableSignal<boolean>;
  recipeResult: WritableSignal<RecipeResult>;

  isPageReady = signal<boolean>(false);

  pictureClass: { key: number; class: string }[] = [];

  constructor(private appInitService: AppInitService, private recipeService: RecipeService){
    this.isAppReady = this.appInitService.isAppReady;
    this.recipeResult = this.recipeService.recipeResult;
  }

  async ngOnInit(){
    this.pictureClass = this.recipeService.getPictureClass();

    this.isPageReady.set(true);
  }

  findPictureClass(id: number){
    return this.recipeService.findPictureClass(this.pictureClass, id);
  }
}
