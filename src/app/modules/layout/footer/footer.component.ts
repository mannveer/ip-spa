import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [CommonModule,RouterModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
    currentUrl: string = environment.CurrentUrl;
}
