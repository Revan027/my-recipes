import { Component, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-progress-bar',
    imports: [MatProgressBarModule],
    templateUrl: './progress-bar.html',
    styleUrl: './progress-bar.scss',
})
export class ProgressBar {
    current = input<number>(0);
    max = input<number>(0);

    getPercentage(): number {
        return (this.current() * 100) / this.max();
    }
}
