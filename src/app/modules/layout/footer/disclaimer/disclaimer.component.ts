import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css'],
  imports:[CommonModule]
})
export class DisclaimerComponent {
  effectiveDate: string = environment.LastUpdatedDisclaimer;

  disclaimerSections = [
    {
      title: 'General Information',
      content: `
        <p>The information provided on ipriyanka.com is for general informational purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website for any purpose.</p>
      `
    },
    {
      title: 'No Professional Advice',
      content: `
        <p>Any content on ipriyanka.com related to graphic design, digital files, or other related fields is for informational purposes only. It is not intended as professional advice. Users should seek advice from qualified professionals before making decisions based on any content found on this website.</p>
      `
    },
    {
      title: 'Limitation of Liability',
      content: `
        <p>ipriyanka.com shall not be liable for any loss or damage, including but not limited to indirect or consequential loss or damage, arising from the use of or reliance on the information provided on this website. This includes, without limitation, any issues related to the digital files purchased or downloaded from the website.</p>
      `
    },
    {
      title: 'External Links',
      content: `
        <p>Our website may contain links to external websites that are not under the control of ipriyanka.com. We are not responsible for the content, availability, or privacy practices of any linked sites. Providing links does not imply endorsement or approval of the external site’s content.</p>
      `
    },
    {
      title: 'No Warranty',
      content: `
        <p>All content and digital files provided on ipriyanka.com are offered "as is" and without warranties of any kind, either express or implied. We do not warrant that the digital files or the website will be error-free, uninterrupted, or free of viruses or other harmful components.</p>
      `
    },
    {
      title: 'Indemnification',
      content: `
        <p>You agree to indemnify, defend, and hold harmless ipriyanka.com, its affiliates, employees, and agents from any claims, damages, liabilities, and expenses arising from your use of the website or any violation of these disclaimers or terms.</p>
      `
    },
    {
      title: 'Changes to the Disclaimer',
      content: `
        <p>We reserve the right to update or modify this Disclaimer at any time without prior notice. Any changes will be posted on this page, and you are advised to review it regularly. Your continued use of the website after changes have been made constitutes your acceptance of the modified Disclaimer.</p>
      `
    }
  ];
}
