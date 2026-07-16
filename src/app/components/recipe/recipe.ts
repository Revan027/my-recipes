import { Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Recipe } from '../../Models/Entities/Recipe';
import { DecimalPipe } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recipe-page',
  imports: [MatCardModule, DecimalPipe, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './recipe.html',
  styleUrl: './recipe.scss'
})
export class RecipePage {

  recipe = input<Recipe>(new Recipe());
  isEditable = input<boolean>(false);

  constructor(){}
  
  async ngOnInit(){
  }
}
