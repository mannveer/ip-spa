import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-refund-policy',
  imports: [CommonModule],
  templateUrl: './refund-policy.component.html',
  styleUrl: './refund-policy.component.css'
})
export class RefundPolicyComponent {
  effectiveDate: string = environment.LastUpdatedRefundPolicy;

  policySections = [
    {
      title: 'Refund Policy for Digital Products',
      content: `
        <p>Thank you for purchasing digital files from our website. Please read this Refund Policy carefully before making a purchase, as it outlines our policy regarding refunds for digital products.</p>
      `
    },
    {
      title: 'No Refund Policy',
      content: `
        <p>Due to the nature of digital products, all sales are final. Once a file has been purchased and delivered, we cannot issue a refund, exchange, or cancellation. When you purchase our digital files, you agree to these terms.</p>
      `
    },
    {
      title: 'Why No Refunds Are Offered',
      content: `
        <ul>
          <li><strong>Instant Delivery:</strong> Digital files are delivered instantly upon payment, ensuring you receive the product immediately.</li>
          <li><strong>Non-Returnable Nature:</strong> Digital files cannot be "returned" like physical products. Once downloaded, they are permanently in your possession.</li>
          <li><strong>Intellectual Property:</strong> Our digital files represent intellectual property that, once accessed, cannot be revoked or undone.</li>
        </ul>
      `
    },
    {
      title: 'Fees and Charges',
      content: `
        <p>We do not collect any fees, charges, or monies from the End Users (as defined under the Terms and Conditions) except the fees, charges, or monies payable by the End Users to you, which may be collected by us on your behalf.</p>
        <p>Accordingly, we do not provide any refund to the End Users for any such amounts payable by them to you.</p>
      `
    },
    {
      title: 'Modification of Terms',
      content: `
        <p>We reserve the right to make changes to these terms and conditions at any time. Modifications may include changes to reflect updates in the law or improvements to our services. Any such changes will be posted on our website, and you should review the terms regularly.</p>
        <p>Your continued use of the services after any amendments shall constitute your acceptance of the modified terms and conditions.</p>
      `
    },
    {
      title: 'Alignment with Terms and Conditions',
      content: `
        <p>This Refund Policy is to be read in conjunction with our <a href="https://www.ipriyanka.com/privacy-policy" rel="noopener" target="_blank">Terms and Conditions</a>. All terms defined in the Terms and Conditions hold the same meaning in this Refund Policy.</p>
      `
    },
    {
      title: 'Customer Support',
      content: `
        <p>We understand that sometimes issues may arise. If you experience problems such as:</p>
        <ul>
          <li>Difficulty downloading files</li>
          <li>Receiving corrupted files</li>
          <li>Issues accessing the purchased content</li>
        </ul>
        <p>Please contact us at <a href="mailto:support@ipriyanka.com">support@ipriyanka.com</a> with your order details, and we will work to resolve the issue promptly.</p>
      `
    }
  ];
}
