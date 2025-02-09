import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
  imports: [CommonModule]
})
export class PrivacyPolicyComponent {
  lastUpdated: string = environment.LastUpdatedPrivacyPolicy;

  policySections = [
    {
      title: 'Interpretation and Definitions',
      content: `
        <h3>Interpretation</h3>
        <p>Words with the initial letter capitalized have specific meanings defined below, regardless of their use in singular or plural form.</p>
        <h3>Definitions</h3>
        <ul>
          <li><strong>Account:</strong> A unique account created for You to access parts of Our Service.</li>
          <li><strong>Cookies:</strong> Small files placed on Your Device to store data about Your interaction with the Website.</li>
          <li><strong>Country:</strong> Refers to India.</li>
          <li><strong>Device:</strong> Any tool capable of accessing the Website, such as a smartphone, computer, or tablet.</li>
          <li><strong>Personal Data:</strong> Any information that identifies or can identify an individual.</li>
          <li><strong>Service:</strong> The Website and related services provided by ipriyanka.com.</li>
          <li><strong>Service Provider:</strong> Third-party entities or individuals that process data on Our behalf.</li>
          <li><strong>Usage Data:</strong> Information collected automatically through Your use of the Website (e.g., IP address, browser type, session length).</li>
          <li><strong>You:</strong> The individual accessing the Service or the company/legal entity represented by such an individual.</li>
        </ul>
      `
    },
    {
      title: 'Collecting and Using Your Data',
      content: `
        <h3>Types of Data Collected</h3>
        <ul>
          <li><strong>Personal Data:</strong> Name, email address, payment information (processed through third-party gateways), phone number (if required for customer support).</li>
          <li><strong>Usage Data:</strong> IP address, browser type, operating system, details of pages visited, and session length.</li>
          <li><strong>Cookies:</strong> Includes essential, preference, and analytics Cookies to enhance user experience.</li>
        </ul>
        <h3>Use of Your Data</h3>
        <ul>
          <li>To provide and maintain the Website.</li>
          <li>To process transactions securely.</li>
          <li>To contact You for updates, promotional materials, or inquiries.</li>
          <li>To manage Your Account and access to purchased content.</li>
          <li>To improve the Service through analytics and user feedback.</li>
          <li>To ensure legal compliance.</li>
        </ul>
      `
    },
    {
      title: 'Sharing Your Data',
      content: `
        <p>We may share Your Personal Data in these cases:</p>
        <ul>
          <li>With Service Providers: For payment processing, analytics, or customer support.</li>
          <li>For business transfers: In case of a sale, merger, or acquisition.</li>
          <li>With affiliates: Entities controlled by or under common control with Us.</li>
          <li>With Your consent: When explicitly agreed by You.</li>
        </ul>
      `
    },
    {
      title: 'Your Data Rights',
      content: `
        <p>You have the right to:</p>
        <ul>
          <li>Access: Request details about the Personal Data We hold about You.</li>
          <li>Correct: Update or amend inaccurate information.</li>
          <li>Delete: Request deletion of Your data (subject to legal obligations).</li>
          <li>Withdraw Consent: Opt out of data collection (e.g., Cookies).</li>
        </ul>
        <p>To exercise these rights, contact Us at <a href="mailto:hello@ipriyanka.com">hello@ipriyanka.com</a>.</p>
      `
    },
    {
      title: 'Changes to This Privacy Policy',
      content: `
        <p>We may update this Privacy Policy periodically. Updates will be posted on this page with a "Last updated" date.</p>
      `
    }
  ];
}
