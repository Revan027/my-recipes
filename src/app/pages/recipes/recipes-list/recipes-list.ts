import {
    Component,
    ElementRef,
    HostListener,
    Signal,
    signal,
    viewChild,
} from '@angular/core';
import { SearchField } from '../../../components/fields/search-field/search-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeService } from '../../../Services/recipe.service';
import { AppInitService } from '../../../Services/app-init.service';
import { RecipeResult } from '../../../Models/RecipeResult';
import { RecipeCard } from '../../../components/recipe-card/recipe-card';
import { RouterLink } from '@angular/router';
import { RecipeListService } from '../../../Services/recipe-list.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecipeSearch } from '../../../Models/RecipeSearch';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-recipes-list',
    imports: [
        SearchField,
        MatIconModule,
        MatButtonModule,
        RecipeCard,
        MatProgressSpinnerModule,
        RouterLink,
        ReactiveFormsModule,
    ],
    templateUrl: './recipes-list.html',
    styleUrl: './recipes-list.scss',
})
export class RecipesList {
    list = viewChild<ElementRef>("list");
    searchField = viewChild(SearchField);

    protected searchControl = signal<FormControl<any>>(new FormControl<any>(''));

    recipeResult: Signal<RecipeResult>;
    recipeSearch: Signal<RecipeSearch>;
    isLoading: Signal<boolean>;
    numVersion!: Signal<string>;

    recipeSearch$!: Observable<RecipeSearch>;

    private pictureClass: { key: number; class: string }[] = [];  
    private timeout?: number = 0;
    formGroup!: FormGroup;
   
    constructor(
        private appInitService: AppInitService,
        private recipeService: RecipeService,
        private recipeListService: RecipeListService,
        private formBuilder: FormBuilder
    ) {
        this.recipeResult = this.recipeService.recipeResult;
        this.recipeSearch = this.recipeService.recipeSearch;
        this.isLoading = this.recipeListService.isLoading;
    }

    @HostListener('window:scroll')
    async onScroll() {
        const offsetScroll = 50;

        if (window.scrollY + window.innerHeight > this.list()?.nativeElement.scrollHeight - offsetScroll && !this.isLoading()) 
        {
    
            await this.recipeListService.loadNextPage();

            this.pictureClass = this.recipeListService.getPictureClass();
        }
    }

    async ngOnInit() {
        this.numVersion = this.appInitService.appVersion;

        this.setPictureClass();

        this.createForm();
    }

    async onSubmit(event: any) {
        if (!this.formGroup.invalid) {
            this.resetTimetout();

            this.launchTimetout();
        }
    }

    private launchTimetout() {
        if (this.timeout == 0) {
            this.timeout = window.setTimeout(async () => {
                this.recipeListService.loadSearch(this.formGroup.get('searchText')?.value); // on lance la recherche si pendat 1 seconde pas de texte tapé

                await this.recipeListService.loadNextPage();

                this.setPictureClass();

                this.resetTimetout();
            }, 1000);
        }
    }

    private resetTimetout() {
        clearTimeout(this.timeout); //on arrete le timeout
        this.timeout = 0;
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            searchText: [this.recipeSearch().searchText, null],
        });

        this.searchControl.set(this.formGroup.controls['searchText'] as FormControl);
    }

    private setPictureClass() {
        this.pictureClass = this.recipeListService.getPictureClass();
    }

    findPictureClass(id: number) {
        return this.recipeListService.findPictureClass(this.pictureClass, id);
    }
}
