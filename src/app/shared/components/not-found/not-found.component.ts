import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [RouterModule],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css',
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms ease-in', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class NotFoundComponent {

}
