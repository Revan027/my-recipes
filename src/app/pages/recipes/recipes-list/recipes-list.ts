import {
    Component,
    ElementRef,
    HostListener,
    signal,
    viewChild,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { SearchField } from '../../../components/fields/search-field/search-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeService } from '../../../Services/recipe-service';
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
    @ViewChild('list') list!: ElementRef;
    searchField = viewChild(SearchField);

    isAppReady: WritableSignal<boolean>;
    recipeResult: WritableSignal<RecipeResult>;
    recipeSearch: WritableSignal<RecipeSearch>;
    isLoading: WritableSignal<boolean>;

    recipeSearch$!: Observable<RecipeSearch>;

    isPageReady = signal<boolean>(false);
    searchControl = signal<FormControl<any>>(new FormControl<any>(''));

    pictureClass: { key: number; class: string }[] = [];
    formGroup!: FormGroup;
    timeout?: number = 0;
    numVersion!: string;

    constructor(
        private appInitService: AppInitService,
        private recipeService: RecipeService,
        private recipeListService: RecipeListService,
        private formBuilder: FormBuilder
    ) {
        this.isAppReady = this.appInitService.isAppReady;
        this.recipeResult = this.recipeService.recipeResult;
        this.recipeSearch = this.recipeService.recipeSearch;
        this.isLoading = this.recipeListService.isLoading;
    }

    @HostListener('window:scroll')
    onScroll() {
        const offsetScroll = 30;

        if (
            window.scrollY + window.innerHeight >
                this.list.nativeElement.scrollHeight - offsetScroll &&
            !this.isLoading()
        ) {
            this.recipeListService.loadNextPage();

            this.pictureClass = this.recipeListService.getPictureClass();
        }
    }

    async ngOnInit() {
        this.numVersion = this.appInitService.appVersion();

        this.setPictureClass();

        this.isPageReady.set(true);

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
            this.timeout = setTimeout(async () => {
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
