import { Component, HostListener, OnInit } from '@angular/core';
import { LibraryDataService } from './services/library-data.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PostWorld';
  public screenWidth: number;
  themeClass = ''; // Start with the default light theme

  toggleTheme() {
    this.themeClass = this.themeClass === 'dark-theme' ? '' : 'dark-theme';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.storage.screenWidthSubj.next(this.screenWidth);
  }
  
  constructor(private supaBase: LibraryDataService, public storage: StorageService){
    this.screenWidth = window.innerWidth;
    this.storage.screenWidthSubj.next(this.screenWidth);
  }

  ngOnInit(){}

}

