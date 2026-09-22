import { Injectable, signal } from '@angular/core';
import { StorageService } from '@common/capacitor/storage-service';
import { Capacitor } from '@capacitor/core';
import { RecipeService } from './recipe.service';
import { RecipeListService } from './recipe-list.service';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FileService } from '@common/capacitor/file.service';

@Injectable({
    providedIn: 'root',
})
export class AppInitService {
    private _isAppInit = signal<boolean>(false);
    private _appVersion = signal<string>("");

    readonly isAppInit = this._isAppInit.asReadonly();
    readonly appVersion = this._appVersion.asReadonly();

    constructor(
        private storageService: StorageService,
        private recipeService: RecipeService,
        private recipeListService: RecipeListService,
        private location: Location,
        private router: Router,
        private fileService: FileService
    ) {}

    async init(): Promise<void>{
        if (Capacitor.isNativePlatform()) {
            await this.storageService.initPlugin();

            await this.loadAppVersion();
        }

        this.intBackListener();   

        const p1 = this.recipeListService.loadNextPage();
        const p2 = this.recipeService.getTypes();
        const p3 = this.fileService.getDocumentsUri("");

        // on attend la résolution des promises
        Promise.all([p1, p2, p3]).then((values) => {
            this.recipeService.loadTypes(values[1]);         
            this.recipeService.loadDocumentURI(values[2]);

            this._isAppInit.set(true);

            this.router.navigateByUrl('recipes');
        })
    }

    private intBackListener(){
        App.addListener('backButton', (event: any) => {
            const regex = /recipes\/(\d)*\/edit/;

            if (event.canGoBack) {
                if(regex.test(this.location.path())){
                    this.router.navigate([this.location.path().replace("/edit", "")]);
                }else{
                    this.location.back();
                }
            } else {
                App.exitApp();
            }
        });
    }

    async loadAppVersion(){
        const info = await App.getInfo();

        this._appVersion.set(info.version);
    }
}
