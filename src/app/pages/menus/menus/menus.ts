import { Component, signal } from '@angular/core';
import { VersionNumber } from '../../../components/version-number/version-number';
import { PageHeader } from '../../../components/page-header/page-header';
import { MatIconModule } from '@angular/material/icon';
import { GroqService } from '../../../Services/groq.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuWeek } from '../../../Models/Entities/MenuWeek';

@Component({
    selector: 'app-menus',
    imports: [PageHeader, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './menus.html',
    styleUrl: './menus.scss',
})
export class Menus {
    protected hasLoading = signal<boolean>(false);

    constructor(private groqService: GroqService){

    }

    async onGenerateIdea(){
        this.setHasLoading(true);
        const response = await this.groqService.generateMenuRequest();
        //gestino d'erreur a faire. faire ajouter le joru de la semine et l'anné à grocq
        const menuWeek = JSON.parse(response.choices[0].message.content as string) as MenuWeek;
        menuWeek.dayWeek = 1;
        console.log(menuWeek);
        this.setHasLoading(false);
    }

    setHasLoading(value: boolean){
        this.hasLoading.set(value)
    }
}
