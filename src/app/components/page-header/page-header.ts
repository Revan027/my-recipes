import { Component, input } from '@angular/core';

@Component({
    selector: 'app-page-header',
    imports: [],
    templateUrl: './page-header.html',
    styleUrl: './page-header.scss',
})
export class PageHeader {
    title = input.required<string>();
    subTitle = input<string>();
}
