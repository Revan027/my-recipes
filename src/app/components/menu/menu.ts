import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuTabEnum } from '../../Models/Enum/MenuTabEnum';
import { MenuService } from '../../Services/menu.service';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-menu',
    imports: [MatIconModule],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
})
export class Menu { 
    private destroyRef = inject(DestroyRef);

    MenuTabEnum = MenuTabEnum;

    protected menuActive: Signal<MenuTabEnum>;

    constructor(private menuService: MenuService, private router: Router) {  
        this.menuActive = this.menuService.menuActive;   

        //ecoute du changement sur le routing
        this.router.events
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(async (event) => {
                switch (true) {
                    case event instanceof NavigationStart: {
                        this.menuService.setMenuActive(this.menuService.getMenuTab(event.url))                    
                        break;
                    }
                }        
            });
    }

    onNavigate(menuTab: MenuTabEnum){
        this.router.navigateByUrl(this.menuService.getMenuTabUrl(menuTab));
    }
}
