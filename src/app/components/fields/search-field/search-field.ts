import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-field',
    imports: [MatIconModule, ReactiveFormsModule],
    templateUrl: './search-field.html',
    styleUrl: './search-field.scss',
})
export class SearchField {
    searchControl = input<FormControl>(new FormControl());
    searchText = output<string>();

    onKeyUp(event: any) {
        this.searchText.emit(event.target?.value);
    }
}
