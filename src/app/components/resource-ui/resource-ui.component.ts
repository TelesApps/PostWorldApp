import { Component, Input, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-resource-ui',
  templateUrl: './resource-ui.component.html',
  styleUrls: ['./resource-ui.component.scss']
})
export class ResourceUiComponent implements OnInit {

  placeholder = 'https://rdetkrgymjviyiabmphl.supabase.co/storage/v1/object/public/Resource_Images/Cooking_52_spice.png?t=2023-11-04T15%3A56%3A19.162Z'
  @Input() nameId: string;
  @Input() srcset?: string = '';
  @Input() alt?: string = 'resource icon';
  @Input() text: string | number = '';
  imgUrl: string = '';

  constructor(private supabase: SupabaseService) { }

  ngOnInit(): void {
    if (this.nameId) {
      const imgUrl = this.supabase.getCashedImgUrl(this.nameId);
      if (imgUrl) {
        this.imgUrl = imgUrl;
      } else {
        this.supabase.getResourceUrlFromCloud(this.nameId).then(url => {
          if (url)
            this.imgUrl = url;
          else
            this.imgUrl = this.placeholder;
        });
      }
    }

  }

}
