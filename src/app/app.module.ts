import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import * as firebase from 'firebase/app';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InformUserService } from './services/inform-user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { GameCreationService } from './services/game-creation.service';
import { HexCreationService } from './services/hex-creation.service';
import { AirtableService } from './services/airtable.service';
import { HttpClientModule } from '@angular/common/http';
import { LibraryDataService } from './services/library-data.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResourceUiComponent } from './components/resource-ui/resource-ui.component';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    MatProgressBarModule,
  ],
  providers: [
    AuthService,
    InformUserService,
    GameCreationService,
    HexCreationService,
    AirtableService,
    LibraryDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
