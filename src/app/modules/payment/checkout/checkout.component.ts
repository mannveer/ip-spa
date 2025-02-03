import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { OtpService } from '../../../core/services/otp/otp.service';
import { UserFileInfoService } from '../../../core/services/user-file-info/user-file-info.service';
// import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { constant } from '../../../shared/constant';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '../../../core/components/custom-snackbar/snackbar.service';

// declare var Razorpay: any;
declare var Razorpay: any;

@Component({
    selector: 'app-checkout',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIcon,
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
  disableEmailInput: boolean = false;
  paySuccessMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private dialogRef: MatDialogRef<CheckoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private otpService: OtpService,
    private userFileInfoService: UserFileInfoService,
    private snackbarService: SnackbarService
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, this.digitValidator(6)]],
      amount: [{ value: this.data.file.price, disabled: true }]
    });
  }

  validationMessages: any = {
    required: 'This field is required.',
    minlength: 'Minimum length not met.',
    email: 'Enter a valid email address.',
    pattern: 'Enter a valid OTP.',
    invalidOtp: 'Invalid OTP.'
  };


  getErrorMessage(controlName: string): string {
    const control = this.checkoutForm.get(controlName);
    if (control && control.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      return this.validationMessages[firstErrorKey] || '';
    }
    return '';
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
        this.paySuccessMessage = '';
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

showSnackbar(message: string, isError: boolean = false) {
  this.snackbarService.openSnackBar({
    message,
    action: 'Close',
    duration: 5000,
    panelClass: isError ? 'custom-error-snackbar' : 'custom-snackbar',
  });
}



  sendOtp() {
    if (this.checkoutForm.get('email')?.valid) {
      this.loading = true;
      this.disableEmailInput = true;
      this.otpService.sendOtp(this.checkoutForm.get('email')?.value, this.data.purpose).subscribe(
        () => {
          this.showSnackbar('OTP sent successfully!');
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
          else if ([500, 503, 504, 0].includes(error.status)) {
            this.checkoutForm.get('email')?.setErrors({ serverError: true });
          }

          this.showSnackbar('Error sending OTP. Please try again.', true);
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
            localStorage.setItem('userEmail', this.checkoutForm.get('email')?.value);
            this.checkoutForm.get('email')?.disable();
            this.verifyOtpLoading = false;
            this.startSessionTimer(); 
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

  onEmailChange(event:any) {
    this.disableEmailInput = false;
    this.otpSent = false;
    this.otpVerified = false;
    this.checkoutForm.get('otp')?.reset();
  }


  startTimer(t:number) {
    this.timer = t;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        // this.otpSent = false;
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
        key: environment.razorpayKey, 
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
            fileid: this.data.file._id,
            amount: this.checkoutForm.get('amount')?.value,
            currency: 'INR',
            offer_id: 'offer_12345',
            updatedAt: new Date().getTime(),
            paymentid: paymentResponse.razorpay_payment_id,
            status: 'success',
            entity: "file",
            orderid:paymentResponse.razorpay_order_id
        },
        };
  
        try {
          const response = await this.userFileInfoService.insertUserFileInfo(userFileInfo).toPromise();
          console.log('User file info inserted:', response);
          this.router.navigate([`/success-receipt/${this.data.file._id}`]);
          this.dialogRef.close();
  
        } catch (error) {
          this.handlePaymentFailure('Payment successful, Failed to update user file info');
          console.error('Error inserting user file info:', error);
          this.saveUserInfoToJson(userFileInfo);
        }
  
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
      // const otp = this.checkoutForm.get('otp')?.value;
  
      const response = await firstValueFrom(this.userFileInfoService.getUserFileInfoAsync(name, email,this.data.file._id));
  
      if (response.ok) {
        const response1 = response.body as any;
        console.log('User file info:', response1);
        if (response1.data) {
          this.alreadyPaid = true;
          this.userFileInfoService.emailFileInfo({fileid:this.data.file._id,email})
          .subscribe({
              next: (res: any) => {
                this.paySuccessMessage = 'Already paid. A confirmation email has been resent.';
                console.log('File info sent successfully:', res);
                this.verifyPayLoading = false;
              },
              error: (err: any) => {
                console.error('Failed to send file info:', err);
                this.isPayNoError = false;
                this.payErrorMessage = 'Alreaady paid but fFailed to send file info email';
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
    
      if (this.data.purpose !== 'pay') {
        this.verifyPayLoading = false;
      }
    }
  }
  
}
