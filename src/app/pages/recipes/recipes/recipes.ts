import { Component } from '@angular/core';
import { SearchField } from '../../../components/fields/search-field/search-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recipes',
  imports: [SearchField, MatIconModule, MatButtonModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss'
})
export class Recipes {}
