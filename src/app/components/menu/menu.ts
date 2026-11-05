import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../Services/menu.service';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from '../../Models/MenuItem';
import { VersionNumber } from '../version-number/version-number';

@Component({
    selector: 'app-menu',
    imports: [MatIconModule, VersionNumber],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
})
export class Menu { 
    private destroyRef = inject(DestroyRef);

    protected menuActive: Signal<MenuItem>;
    protected menus: Signal<MenuItem[]>;

    constructor(private menuService: MenuService, private router: Router) {  
        this.menuActive = this.menuService.menuActive; 
        this.menus = this.menuService.menus;   

        //ecoute du changement sur le routing
        this.router.events
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(async (event) => {
                switch (true) {
                    case event instanceof NavigationStart: {
                        this.menuService.setMenuActive(this.menuService.getMenuItem(event.url) as MenuItem)                    
                        break;
                    }
                }        
            });
    }

    onNavigate(menuItem: MenuItem){
        this.router.navigateByUrl(menuItem.baseUrl);
    }
}
