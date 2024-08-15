import { Routes } from '@angular/router';
import { filesRoutes } from './modules/files/files.routes';
import { AvailableFilesComponent } from './modules/files/available-files/available-files.component';
import { FileDetailsComponent } from './modules/files/file-details/file-details.component';
import { AboutComponent } from './modules/header-items/about/about.component';
import { ServicesComponent } from './modules/header-items/services/services.component';
import { ContactComponent } from './modules/header-items/contact/contact.component';
import { CheckoutComponent } from './modules/payment/checkout/checkout.component';
import { SuccessReceiptComponent } from './core/components/fileshared/fileshared.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'files', pathMatch: 'full' },
    ...filesRoutes,
    { path: 'about', component: AboutComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'contact', component: ContactComponent },
    {path: 'success-receipt', component: SuccessReceiptComponent},
    // {path: 'check-out', component: CheckoutComponent}
    // { path: 'files', component: AvailableFilesComponent },
    // { path: 'file-details/:fileName', component: FileDetailsComponent },  
];
