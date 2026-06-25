import { Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Recipe } from '../../Models/Entities/Recipe';


@Component({
  selector: 'app-recipe-card',
  imports: [MatCardModule],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss'
})
export class RecipeCard {

  recipe = input<Recipe>(new Recipe());
  pictureClass = input<string>("");

  constructor(){}
  
  async ngOnInit(){
  }
}
