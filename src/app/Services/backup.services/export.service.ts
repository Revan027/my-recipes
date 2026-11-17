import { Injectable } from '@angular/core';
import { StorageService } from '../capacitor.services.common/storage-service';
import { BackupStep, BackupStepStatusEnum } from './models/backupStep';
import { FileService } from '../capacitor.services.common/file.service';
import { Directory, Encoding } from '@capacitor/filesystem';
import { CapacitorZip } from '@capgo/capacitor-zip';
import { BackupService } from './backupService';
import { folder } from '../../constants/menu';

@Injectable({
    providedIn: 'root',
})
export class ExportService extends BackupService {
    constructor(private storageService: StorageService, private fileService: FileService) {
        super();
    }

    private initExport(): void{
        this.backupSteps = [
            new BackupStep("Exportation des recettes", 1, this.exportData),
            new BackupStep("Exportation du répertoire des images", 2, this.exportDirectoryImages),
            new BackupStep("Exportation terminée"),
        ];

        this._countStep.set(this.backupSteps.filter(x => x.stepOrder).length);

        this.resetStepProgression();
    }

    async launchExport(): Promise<void>{
        this.initExport();

        for (const backupStep of this.backupSteps) {
            this._currentStep.set(backupStep);
          
            if(backupStep.action !== undefined){
                try{
                    this.updateStepProgression(BackupStepStatusEnum.Pending)

                    await backupStep.action.call(this);// on invoke la méthode depuis le contexte du service pour avoir les injections de dépendance

                    this.updateStepProgression(BackupStepStatusEnum.Success)

                    this.loadStepProgression();
                }catch(e: any){
                    this.updateStepProgression(BackupStepStatusEnum.Error)

                    return Promise.resolve();
                } 
            } 
        }
    }

    private async exportData(): Promise<void>{
        //alert(JSON.stringify(this.storageService, null, 2));
        // On exporte la base
        const capSQLiteJson = await this.storageService.exportJson();
    
        // On crée le fichier texte de backup unique avec son contenu en chaine de caractère. Ecriture brut en UTF8
        await this.fileService.writeFile(JSON.stringify(capSQLiteJson.export), `${Date.now()}_backup.txt`, folder.Backup, Directory.Documents, Encoding.UTF8);
    }

    private async exportDirectoryImages(): Promise<void>{
        // Zip du dossier des images
        return CapacitorZip.zip({
            source: this.fileService.getAbsolutePath(await this.fileService.getDocumentsUri(folder.My_Recipes)),
            destination: this.fileService.getAbsolutePath(await this.fileService.getDocumentsUri(`${folder.Backup}/backup.zip`))
        });
    }
}
