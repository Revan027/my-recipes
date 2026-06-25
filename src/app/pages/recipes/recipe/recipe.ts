import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBar } from '../../../components/progress-bar/progress-bar';

@Component({
  selector: 'app-recipe',
  imports: [MatIconModule, MatButtonModule, ProgressBar],
  templateUrl: './recipe.html',
  styleUrl: './recipe.scss'
})
export class Recipe {}
