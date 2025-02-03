import { Component } from '@angular/core';
import { PaymentService } from '../../../core/services/payment/payment.service';
import rzorpay from 'razorpay';
declare var Razorpay: any;

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    standalone: false
})
export class PaymentComponent {
  Razorpay: any = rzorpay;
  constructor(private paymentService: PaymentService) { }

  pay(amount: number) {
    this.paymentService.createOrder(amount).subscribe((order: any) => {
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: order.amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: order.id,
        handler: (response: any) => {
          this.paymentService.verifyPayment(response).subscribe((res: any) => {
            if (res.status === 'success') {
              alert('Payment successful! You can now download the file.');
              // Provide download link here
            } else {
              alert('Payment verification failed.');
            }
          });
        },
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
          contact: '9999999999'
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();
    });
  }
}