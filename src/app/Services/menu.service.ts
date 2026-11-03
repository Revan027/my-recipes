import { Injectable, signal } from '@angular/core';
import { MenuTabEnum } from '../Models/Enum/MenuTabEnum';

@Injectable({
    providedIn: 'root',
})
export class MenuService {

 private _menuActive = signal<number>(MenuTabEnum.Home);
    menuActive = this._menuActive.asReadonly();

    constructor() {     
    }

    setMenuActive (value: MenuTabEnum) {
        this._menuActive.set(value);
    }

    getMenuTab(url: string): MenuTabEnum{
        if(url.startsWith("/recipes")){
            if(/\/recipes\/[\d]*/.test(url)){
                return MenuTabEnum.Book;                
            }

            return MenuTabEnum.Home;   
        }
        else if(url.startsWith("menus")){
            return MenuTabEnum.Menus;
        }

        return MenuTabEnum.Home;
    }

    getMenuTabUrl(menuTab: MenuTabEnum): string{
       switch (menuTab) {
            case MenuTabEnum.Home: 
            {
                return "home";
            }
            case MenuTabEnum.Book: 
            {
                return "recipes/1";
            }
            case MenuTabEnum.Menus: 
            {
                return "menus";
            }
        }   
    }
}
