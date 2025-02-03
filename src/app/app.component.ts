import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './modules/layout/header/header.component';
import { FooterComponent } from './modules/layout/footer/footer.component';
import { AvailableFilesComponent } from './modules/files/available-files/available-files.component';
import { FiletempComponent } from './modules/files/filetemp/filetemp.component';
import { fadeAnimation } from './shared/utils/animation';
import { LoaderComponent } from "./core/components/loader/loader.component";
import { CommonTitleService } from './core/services/common-title/common-title.service';
  
  @Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    animations: [fadeAnimation]
})
export class AppComponent {
  title = 'file-sys';
  constructor(
    private commonTitle: CommonTitleService,
  ) {}

  ngOnInit() {
    this.commonTitle.setTitle();
  }
}
