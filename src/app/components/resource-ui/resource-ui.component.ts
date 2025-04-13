import { Component, Input, OnInit } from '@angular/core';
import { LibraryDataService } from 'src/app/services/library-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resource-ui',
  templateUrl: './resource-ui.component.html',
  styleUrls: ['./resource-ui.component.scss']
})
export class ResourceUiComponent implements OnInit {

  placeholder: string = '/assets/images/resource-any.png'
  @Input() nameId: string;
  @Input() srcset?: string = '';
  @Input() alt?: string = 'resource icon';
  @Input() text: string | number = '';
  @Input() width: string = '40px';
  @Input() tooltip: string = '';
  @Input() tooltipPosition: any = 'above';

  imgUrl: string = '';

  constructor(private library: LibraryDataService) { }

  ngOnInit(): void {
    this.setResource();
  }

  async setResource() {
    if (this.nameId) {
      const resource = await this.library.getResource(this.nameId);
      if (resource) {
        if (resource.img_url) {
          this.imgUrl = environment.firebaseStorageUrl + resource.img_url + '?alt=media';
        } else {
          this.imgUrl = this.placeholder;
        }
        if(resource.label) {
          this.tooltip = resource.label;
          this.alt = resource.label;
        }
      }
    }
  }

}
