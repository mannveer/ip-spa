import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { OtpService } from '../../../core/services/otp/otp.service';
import { LoaderComponent } from "../../../core/components/loader/loader.component";
import { UserFileInfoService } from '../../../core/services/user-file-info/user-file-info.service';
// import { writeFile } from 'fs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { constant } from '../../../shared/constant';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

// declare var Razorpay: any;
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  otpSent: boolean = false;
  otpVerified: boolean = false;
  timer: number = 0;
  private timerInterval: any;
  loading: boolean = false;
  verifyOtpLoading: boolean = false;
  verifyPayLoading: boolean = false;
  isPayNoError:boolean = true;
  payErrorMessage:string = ''
  alreadyPaid : boolean = false;
  sessionDuration: number = 15 * 60; // 15 minutes in seconds
  formattedTime: string = '00:00';
  isPaymentStarted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private dialogRef: MatDialogRef<CheckoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private otpService: OtpService,
    private userFileInfoService: UserFileInfoService
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, this.digitValidator(6)]],
      amount: [{ value: this.data.file.price, disabled: true }]
    });
  }

  digitValidator(num: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value == "") return null

      const isValid = new RegExp(`^\\d{${num}}$`).test(control.value);
      return isValid ? null : { 'digitValidator': { value: control.value, requiredDigits: num } };
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    const { name, email, otp } = this.checkoutForm.getRawValue();
    if (name && email && this.otpVerified) {
      this.isPaymentStarted = true;
        this.payErrorMessage = '';
        this.isPayNoError = true;
        this.verifyPayLoading = true;
        const isSessionActive = await this.isSessionActive();
      if(isSessionActive) {
        if (this.data.purpose == 'pay') {
          this.alreadyPaid = false;
          await this.confirmPayment();

          if (!this.alreadyPaid && this.isPayNoError) {
              this.payWithRazorpay(); 
          }
      } else {
          await this.confirmPayment();
      }
      }
      else{
        this.verifyPayLoading = false;
        this.isPayNoError = false;
        this.payErrorMessage = 'Session time out. Please try again.';
      }

    } else {
      this.isPayNoError = false;
      this.payErrorMessage = 'Please enter valid details';
        // Handle validation error
    }
}

startSessionTimer() {
  this.updateTimerDisplay(this.sessionDuration);

  this.timerInterval = setInterval(() => {
    if (this.sessionDuration > 0) {
      this.sessionDuration--;
      this.updateTimerDisplay(this.sessionDuration);
    } else {
      clearInterval(this.timerInterval);
      // Optionally, handle session expiration (e.g., log the user out)
    }
  }, 1000);
}

updateTimerDisplay(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  this.formattedTime = `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
}

pad(value: number): string {
  return value.toString().padStart(2, '0');
}

  sendOtp() {
    if (this.checkoutForm.get('email')?.valid) {
      this.loading = true;
      this.otpService.sendOtp(this.checkoutForm.get('email')?.value, this.data.purpose).subscribe(
        () => {
          this.otpSent = true;
          this.loading = false;
          this.startTimer(constant.otpexpiry);
        },
        (error) => {
          if(error.status === 409) {
            error.error.updatedAt = new Date(error.error.updatedAt);
            const time = new Date(error.error.updatedAt).getTime();
            const currentTime = new Date().getTime();
            const diff = currentTime - time;
            this.otpSent = true;
            this.startTimer(constant.otpexpiry - Math.floor(diff / 1000));
          }

          else if (error.status === 429) {
            // Handle rate limiting error
          }
          else if(error.status === 500){
            this.checkoutForm.get('email')?.setErrors({ serverError: true });
          }


          console.error('Error sending OTP:', error);
          this.loading = false;
        }
      );
    }
  }

  verifyOtp() {
    if (this.checkoutForm.get('otp')?.valid) {
      this.verifyOtpLoading = true;
      this.otpService.verifyOtp({
        email: this.checkoutForm.get('email')?.value,
        otp: this.checkoutForm.get('otp')?.value,
        purpose: this.data.purpose
      }).subscribe(
        (response: any) => {
          if (response.ok) {
            this.otpVerified = true;
            this.checkoutForm.get('email')?.disable();
            this.verifyOtpLoading = false;
            this.startSessionTimer(); // Start the session timer upon OTP verification
          } else {
            this.checkoutForm.get('otp')?.setErrors({ invalidOtp: true });
            this.verifyOtpLoading = false;
          }
        },
        (error) => {
          this.checkoutForm.get('otp')?.setErrors({ invalidOtp: true });
          this.verifyOtpLoading = false;
        }
      );
    }
  }


  startTimer(t:number) {
    this.timer = t;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.otpSent = false;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  generateReceiptNumber = () => {
    const timestamp = Date.now();
    const email = this.checkoutForm.get('email')?.value;
    return `${email}${timestamp}`;
  };

  async isSessionActive(): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.userFileInfoService.userSession());
      console.log('Session active:', res);
      return true;
    } catch (err) {
      console.error('Session inactive:', err);
      return false;
    }
  }

  payWithRazorpay() {
    const paymentDetails = {
      amount: this.checkoutForm.get('amount')?.value,
      currency: 'INR',
      receipt: this.generateReceiptNumber(),
    };

    this.paymentService.createOrder(paymentDetails).subscribe((order: any) => {
      const options = {
        key: environment.razorpayKey, // Enter the Key ID generated from the Dashboard
        amount: parseInt(order.amount),
        currency: order.currency,
        name: 'Priyanka\'s Repository',
        description: 'Purchase Description',
        order_id: order.id,
        handler: (response: any) => {
          this.verifyPayment(response);
        },
        prefill: {
          name: this.checkoutForm.get('name')?.value,
          email: this.checkoutForm.get('email')?.value,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  }


  async verifyPayment(paymentResponse: any) {
    try {
      const verificationResult = await this.paymentService.verifyPayment(paymentResponse).toPromise();
      if (verificationResult?.success) {  
        const userFileInfo = {
          name: this.checkoutForm.get('name')?.value,
          email: this.checkoutForm.get('email')?.value,
          purchase: {
            filename: this.data.filename,
            purchase: {
              fileid: this.data.file._id,
              amount: this.checkoutForm.get('amount')?.value,
              currency: 'INR',
              offer_id: 'offer_12345',
              updatedAt: new Date().getTime(),
              paymentid: paymentResponse.razorpay_payment_id,
              status: 'success',
              entity: "file"
            },
          },
        };
  
        try {
          const response = await this.userFileInfoService.insertUserFileInfo(userFileInfo).toPromise();
          console.log('User file info inserted:', response);
        } catch (error) {
          console.error('Error inserting user file info:', error);
          this.saveUserInfoToJson(userFileInfo);
        }
  
        this.router.navigate(['/success-receipt']);
        this.dialogRef.close();
      } else {
        this.handlePaymentFailure('Payment verification failed');
      }
    } catch (error) {
      console.error('Error during payment verification:', error);
      this.handlePaymentFailure('An unexpected error occurred during payment verification');
    }
  }
  
  
  private saveUserInfoToJson(userFileInfo: any) {
    // const jsonContent = JSON.stringify(userFileInfo, null, 2);
    // writeFile('user-payment-success.json', jsonContent, 'utf8', (err) => {
    //   if (err) {
    //     console.error('Error writing JSON file:', err);
    //   } else {
    //     console.log('JSON file has been saved.');
    //   }
    // });
  }
  
  private handlePaymentFailure(errorMessage: string) {
    this.verifyPayLoading = false;
    this.payErrorMessage = errorMessage;
    console.error(errorMessage);
  }
  

  async confirmPayment() {
    try {
      this.verifyPayLoading = true;
      const name = this.checkoutForm.get('name')?.value;
      const email = this.checkoutForm.get('email')?.value;
      const otp = this.checkoutForm.get('otp')?.value;
  
      const response = await this.userFileInfoService.getUserFileInfoAsync(name, email);
  
      if (response.ok) {
        const response1 = response.body as any;
  
        const fileRec = response1.data.user.purchases.find((file: any) => {
          return this.data.file._id == file.purchase.id && file.purchase.status === 'success';
        });
  
        if (fileRec) {
          this.alreadyPaid = true;
          this.userFileInfoService.emailFileInfo({fileid:fileRec.id,userid:response1.data.user._id})
          .subscribe({
              next: (res: any) => {
                console.log('File info sent successfully:', res);
                this.verifyPayLoading = false;
              },
              error: (err: any) => {
                console.error('Failed to send file info:', err);
                this.verifyPayLoading = false;
              }
            });
        } else {
          this.verifyPayLoading = false;
          console.error('Payment verification failed');
        }
        // this.router.navigate(['/success-receipt']); // Redirect to success-receipt component
        // this.dialogRef.close();
      } else {
        console.error('Payment verification failed');
        this.verifyPayLoading = false;
      }
    } catch (error:any) {
      console.error('An unexpected error occurred during payment verification:', error);

      this.isPayNoError = false;
    
      if (!error.ok) {
        // Error response from server
        switch (error.status) {
          case 400:
            this.payErrorMessage = 'Session time out. Please try again.';
            break;
          case 401:
            this.payErrorMessage = 'Unauthorized. Please log in and try again.';
            break;
          case 403:
            this.payErrorMessage = 'Forbidden. You do not have permission to perform this action.';
            break;
          case 404:
            if(this.data.purpose == 'pay'){
              this.payErrorMessage = '';
              this.isPayNoError = true;
            }
            else
            this.payErrorMessage = 'Not Found. The requested resource could not be found.';
            break;
          case 500:
            this.payErrorMessage = 'Internal Server Error. Please try again later.';
            break;
          default:
            this.payErrorMessage = 'An unexpected error occurred. Please try again.';
        }
        // this.payErrorMessage = error.error.message;
      } else if (error.request) {
        // No response received from server
        this.payErrorMessage = 'No response from server. Please check your internet connection and try again.';
      } else {
        // Other errors
        this.payErrorMessage = error.message + ' ...Please try again';
      }
    
      this.verifyPayLoading = false;
    }
  }
  
}
