import { Component, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { BackupStep } from '../../Services/capacitor.services.common/backup/models/backupStep';
import { PageHeader } from '../../components/page-header/page-header';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressBar } from '../../components/progress-bar/progress-bar';
import { ExportService } from '@common/capacitor/backup/export.service';
import { ImportService } from '@common/capacitor/backup/import.service';
import { folder } from '../../constants/folder';

@Component({
    selector: 'app-backup',
    imports: [PageHeader, MatIconModule, MatButtonModule, MatProgressSpinnerModule, ProgressBar],
    templateUrl: './backup.html',
    styleUrl: './backup.scss',
})
export class BackupPage {
    @ViewChild('inputFile') inputFile!: ElementRef;

    launchBackup = signal<boolean>(false);
    stepProgression = signal<number>(0);
    countStep = signal<number>(0);
    currentStep = signal<BackupStep | null>(null);

    constructor(
        private exportService: ExportService,
        private importService: ImportService) 
    {
        effect( () => {
            const currenStep = this.exportService.currentStep();
            const countStep = this.exportService.countStep();
            const stepProgression = this.exportService.stepProgression();

            this.currentStep.set(currenStep);
            this.countStep.set(countStep);
            this.stepProgression.set(stepProgression);
        });

        effect( () => {          
            const currenStep = this.importService.currentStep();
            const countStep = this.importService.countStep();
            const stepProgression = this.importService.stepProgression();

            this.currentStep.set(currenStep);
            this.countStep.set(countStep);
            this.stepProgression.set(stepProgression);
        });
    }
    
    async export() {  
        this.launchBackup.set(true); 

        await this.exportService.launchExport(folder);

        setTimeout(() => {this.launchBackup.set(false);}, 3000)     
    }

    async import(event: any) {
        this.launchBackup.set(true);
  
        await this.importService.launchImport(event.target.files[0], event.target.files[1], folder);

        setTimeout(() => {this.launchBackup.set(false);}, 3000)     
    }

    openFileSelector() {
        this.inputFile.nativeElement.click();
    }
}
