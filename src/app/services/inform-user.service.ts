import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class InformUserService {

  constructor(private snackBar: MatSnackBar) { }

  displayToast(message: string, action: string, duration?: number) {
    if (duration === null || duration === undefined) duration = 4000
    this.snackBar.open(message, action, {
      panelClass: 'mat-snackbar-theme',
      verticalPosition: 'top',
      duration: duration,
    });
  }
}
