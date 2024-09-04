import { Routes } from '@angular/router';
import { filesRoutes } from './modules/files/files.routes';
import { AboutComponent } from './modules/header-items/about/about.component';
import { ServicesComponent } from './modules/header-items/services/services.component';
import { ContactComponent } from './modules/header-items/contact/contact.component';
import { SuccessReceiptComponent } from './core/components/fileshared/fileshared.component';
import { PaymentAuthGuard } from './core/guards/payment-auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { FeaturedWorkComponent } from './modules/personal/featured-work/featured-work.component';

export const appRoutes: Routes = [
    // { path: '', redirectTo: 'files', pathMatch: 'full' },
    { path: '', pathMatch: 'full',component:FeaturedWorkComponent },
    
    // Lazy loading files module
    // {
    //     path: 'files',
    //     loadChildren: () => import('./modules/files/files.module').then(m => m.FilesModule)
    // },
    ...filesRoutes,
    
    { path: 'about', component: AboutComponent, data: { title: 'About Us' } },
    { path: 'services', component: ServicesComponent, data: { title: 'Our Services' } },
    { path: 'contact', component: ContactComponent, data: { title: 'Contact Us' } },
    
    // Protecting the success receipt route
    { path: 'success-receipt', component: SuccessReceiptComponent, canActivate: [PaymentAuthGuard], data: { title: 'Receipt' } },

    // Handling undefined routes
    { path: '**', component: NotFoundComponent, data: { title: '404 - Not Found' } }
];
