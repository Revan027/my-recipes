import { Component } from '@angular/core';
import { SearchField } from '../../../components/fields/search-field/search-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Card } from '../../../components/card/card';

@Component({
  selector: 'app-recipes',
  imports: [SearchField, MatIconModule, MatButtonModule, Card],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss'
})
export class Recipes {}
