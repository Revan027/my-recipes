import { Component, Signal } from '@angular/core';
import { AppInitService } from '../../Services/app-init.service';

@Component({
    selector: 'app-version-number',
    imports: [],
    templateUrl: './version-number.html',
    styleUrl: './version-number.scss',
})
export class VersionNumber {
    numVersion!: Signal<string>;

    constructor(private appInitService: AppInitService)
    {
        this.numVersion = this.appInitService.appVersion;
    }
}
