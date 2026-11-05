import { Component, signal } from '@angular/core';
import { VersionNumber } from '../../../components/version-number/version-number';
import { PageHeader } from '../../../components/page-header/page-header';
import { MatIconModule } from '@angular/material/icon';
import { GroqService } from '../../../Services/groq.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-menus',
    imports: [VersionNumber, PageHeader, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './menus.html',
    styleUrl: './menus.scss',
})
export class Menus {
    protected hasLoading = signal<boolean>(false);

    constructor(private groqService: GroqService){

    }

    async onGenerateIdea(){
        this.setHasLoading(true);
        //console.log(await this.groqService.send());
        this.setHasLoading(false);
    }

    setHasLoading(value: boolean){
        this.hasLoading.set(value)
    }
}
