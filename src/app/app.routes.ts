import { Routes } from '@angular/router';
import { filesRoutes } from './modules/files/files.routes';
import { AboutComponent } from './modules/header-items/about/about.component';
import { ServicesComponent } from './modules/header-items/services/services.component';
import { ContactComponent } from './modules/header-items/contact/contact.component';
import { SuccessReceiptComponent } from './core/components/success-receipt/success-receipt.component';
import { PaymentAuthGuard } from './core/guards/payment-auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { FeaturedWorkComponent } from './modules/personal/featured-work/featured-work.component';
import { PrivacyPolicyComponent } from './modules/layout/footer/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './modules/layout/footer/terms-and-conditions/terms-and-conditions.component';
import { RefundPolicyComponent } from './modules/layout/footer/refund-policy/refund-policy.component';
import { DisclaimerComponent } from './modules/layout/footer/disclaimer/disclaimer.component';

export const appRoutes: Routes = [
    // { path: '', redirectTo: 'files', pathMatch: 'full' },
    { path: '', pathMatch: 'full',component:FeaturedWorkComponent },
    
    ...filesRoutes,
    
    { path: 'about', component: AboutComponent, data: { title: 'About Us' } },
    { path: 'services', component: ServicesComponent, data: { title: 'Our Services' } },
    { path: 'contact', component: ContactComponent, data: { title: 'Contact Us' } },
    { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { title: 'Privacy Policy' } },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent, data: { title: 'Terms and Conditions' } },
    { path: 'refund-and-cancellation', component: RefundPolicyComponent, data: { title: 'Refund and Cancellation' } },
    { path: 'disclaimer', component: DisclaimerComponent, data: { title: 'Disclaimer' } },

    // Protecting the success receipt route
    { 
        path: 'success-receipt/:fileId', 
        component: SuccessReceiptComponent, 
        canActivate: [PaymentAuthGuard], 
        data: { title: 'Receipt' } 
      },
      
    // Handling undefined routes
    { path: '**', component: NotFoundComponent, data: { title: '404 - Not Found' } }
];
