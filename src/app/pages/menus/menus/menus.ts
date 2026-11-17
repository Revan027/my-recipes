import { Component, OnInit, Signal, signal } from '@angular/core';
import { PageHeader } from '../../../components/page-header/page-header';
import { MatIconModule } from '@angular/material/icon';
import { GroqService } from '../../../Services/groq.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuWeek } from '../../../Models/Entities/MenuWeek';
import { GroqApiError } from '../../../Models/Entities/GroqApiError';
import { MenuWeekService } from '../../../Services/menuWeek.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-menus',
    imports: [PageHeader, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './menus.html',
    styleUrl: './menus.scss',
})
export class Menus implements OnInit{
    protected hasLoading = signal<boolean>(false);
    protected menuWeek: Signal<MenuWeek>;

    constructor(
        private groqService: GroqService, 
        private menuWeekService: MenuWeekService, 
        private toastService: ToastrService)
    {      
        this.menuWeek = this.menuWeekService.menuWeek;
    }

    async ngOnInit() {
        this.menuWeekService.setMenuWeek(await this.menuWeekService.getLast());
    }

    async onGenerateIdea(){
        this.setHasLoading(true);

        const lastRecipes = await this.menuWeekService.getLast();

        let response;

        try{
            response = await this.groqService.generateMenuRequest(lastRecipes.menuDays.map(x => x.menuDayPeriods.map(y => y.recipeName)).flat());
        }
        catch(e: any){
            this.setHasLoading(false);

            throw new GroqApiError (e);
        }

        const menuWeek = JSON.parse(response.choices[0].message.content as string) as MenuWeek;

        // suppression si on redemande une génératiuon la même semaine
        await this.menuWeekService.deleteMenuWeek(menuWeek.year, menuWeek.dateWeek);

        const isSuccess = await this.menuWeekService.create(menuWeek);
       
        if(isSuccess){
            this.toastService.success(`Sauvegarde du menu effectuée`);
        }

        this.menuWeekService.setMenuWeek(menuWeek)
        this.setHasLoading(false);
    }

    setHasLoading(value: boolean){
        this.hasLoading.set(value)
    }
}
