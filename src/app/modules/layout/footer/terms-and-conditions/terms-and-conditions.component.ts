import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [CommonModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {
  effectiveDate: string = environment.LastUpdatedRefundPolicy;

  termsSections = [
    {
      title: 'Acceptance of Terms',
      content: `
        <p>By accessing, browsing, or using the Website, you acknowledge that you have read, understood, and agree to these Terms and any additional terms and conditions that may apply to specific sections of the Website or products and services available through the Website.</p>
      `
    },
    {
      title: 'Eligibility',
      content: `
        <p>You must be at least 18 years old or have the permission of a legal guardian to use this Website. By using the Website, you confirm that you meet these eligibility requirements.</p>
      `
    },
    {
      title: 'Products and Services',
      content: `
        <p><strong>Digital Files:</strong> ipriyanka.com offers digital graphic design files for sale and free downloads. These files may include templates, mockups, illustrations, icons, and other design assets.</p>
        <p><strong>Licenses:</strong> All purchases and downloads are provided under a non-exclusive, non-transferable license. You may use the files for personal or commercial projects unless otherwise specified. Redistribution, reselling, or sublicensing of the digital files in their original or modified form is prohibited.</p>
      `
    },
    {
      title: 'Account Registration',
      content: `
        <p>Creating an account may be required to access certain features or purchase products. By registering, you agree to provide accurate, complete, and current information and to keep your login credentials secure. You are responsible for all activities conducted through your account.</p>
      `
    },
    {
      title: 'Payment and Pricing',
      content: `
        <p>All prices are listed in Indian Rupees (INR) and are subject to change without notice. Payments are processed securely through third-party payment providers like Razorpay, Paytm, or other trusted Indian payment gateways. By completing a purchase, you agree to the payment terms of the provider.</p>
        <p>ipriyanka.com is not responsible for any payment processing errors or issues arising from third-party services.</p>
      `
    },
    {
      title: 'Refund and Cancellation Policy',
      content: `
        <p>Due to the nature of digital downloads, all sales are final, and no refunds will be provided once the product has been downloaded or accessed.</p>
        <p>If you experience any issues with your purchase, please contact support at <a href="mailto:hello@ipriyanka.com">hello@ipriyanka.com</a>. Our team will assist you in resolving the issue.</p>
      `
    },
    {
      title: 'Free Files',
      content: `
        <p>Free files provided on the Website are for personal or limited commercial use unless explicitly stated otherwise. Redistribution or resale is strictly prohibited. You are responsible for ensuring compliance with the specific usage terms mentioned with each free file.</p>
      `
    },
    {
      title: 'Intellectual Property',
      content: `
        <p>All content on ipriyanka.com, including digital files, designs, images, text, and other assets, is the property of ipriyanka.com or its content providers and is protected by the Copyright Act, 1957, and other applicable Indian intellectual property laws. Unauthorized use or reproduction is strictly prohibited.</p>
      `
    },
    {
      title: 'User Conduct',
      content: `
        <p>By using the Website, you agree not to:</p>
        <ul>
          <li>Violate any applicable laws or regulations in India.</li>
          <li>Use the digital files in a manner that infringes on the rights of others.</li>
          <li>Distribute malware, viruses, or other harmful components through the Website.</li>
        </ul>
      `
    },
    {
      title: 'Termination',
      content: `
        <p>ipriyanka.com reserves the right to suspend or terminate your access to the Website without notice for any breach of these Terms.</p>
      `
    },
    {
      title: 'Third-Party Links',
      content: `
        <p>The Website may contain links to third-party websites. ipriyanka.com is not responsible for the content, privacy policies, or practices of third-party sites.</p>
      `
    },
    {
      title: 'Disclaimer of Warranties',
      content: `
        <p>All products and services provided on ipriyanka.com are offered “as is” without any warranties, express or implied. We do not guarantee that the digital files will meet your requirements or that the Website will operate without interruption or errors.</p>
      `
    },
    {
      title: 'Limitation of Liability',
      content: `
        <p>ipriyanka.com shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of the Website or its products, to the fullest extent permitted by Indian law.</p>
      `
    },
    {
      title: 'Changes to Terms',
      content: `
        <p>We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Website after changes are posted constitutes acceptance of the revised Terms.</p>
      `
    },
    {
      title: 'Governing Law and Dispute Resolution',
      content: `
        <p>These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.</p>
      `
    }
  ];
}