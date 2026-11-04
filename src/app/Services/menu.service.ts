import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../Models/MenuItem';

@Injectable({
    providedIn: 'root',
})
export class MenuService {

    private _menuActive = signal<MenuItem>(new MenuItem());
    private _menus = signal<MenuItem[]>([]);

    menuActive = this._menuActive.asReadonly();
    menus = this._menus.asReadonly();

    constructor() {     
    }

    getAll(firstID: number): MenuItem[]{
        return [
            {name: "Home", baseUrl: "home", icon: "home"} as MenuItem,
            {name: "Book", baseUrl: `recipes/${firstID}`, icon: "menu_book"} as MenuItem,
            {name: "Menus", baseUrl: "menus", icon: "restaurant_menu"} as MenuItem,
        ]
    }

    getMenuItem(url: string): MenuItem | undefined{
        if(url.startsWith("/recipes")){
            if(/\/recipes\/[\d]*/.test(url)){
                return this.menus().find(x => x.name == "Book");                
            }

            return this.menus().find(x => x.name == "Home");      
        }
        else if(url.startsWith("menus")){
            return this.menus().find(x => x.name == "Menus");   
        }

        return this.menus().find(x => x.name == "Home")
    }

    setMenuActive (value: MenuItem) {
        this._menuActive.set({...value});
    }

    setMenus (value: MenuItem[]) {
        this._menus.set(value);
    }
}
