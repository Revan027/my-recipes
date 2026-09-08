import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    imports: [MatDialogActions, MatDialogContent, MatButtonModule, MatDialogClose],
    templateUrl: './dialog.html',
    styleUrl: './dialog.scss',
})
export class DialogComponent {
    data = inject(MAT_DIALOG_DATA);

    dialogRef = inject(MatDialogRef);
    
    onClose(){
        this.dialogRef.close(true);
    }
}
