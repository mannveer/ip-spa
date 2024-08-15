import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { OtpService } from '../../../core/services/otp/otp.service';
import { LoaderComponent } from "../../../core/components/loader/loader.component";
import { FilesService } from '../../../core/services/files/files.service';
import { UserFileInfoService } from '../../../core/services/user-file-info/user-file-info.service';
// declare var Razorpay: any;
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
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
  isPayNoError:boolean = false;
  payErrorMessage:string = ''
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
      name: ['', [Validators.required, Validators.minLength(6)]],
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

  onSubmit(): void {
    const { name, email, otp } = this.checkoutForm.getRawValue();
    if (name && email && this.otpVerified) {
      this.verifyPayLoading = true;
      if (this.data.purpose == 'pay') {
        this.alreadyPaid = false;
        this.confirmPayment();
        if(!this.alreadyPaid) 
        this.payWithRazorpay();
      } else {
        this.confirmPayment();
      }
    } else {
      // Handle validation error
    }
  }
  

  sendOtp() {
    if (this.checkoutForm.get('email')?.valid) {
      this.loading = true;
      this.otpService.sendOtp(this.checkoutForm.get('email')?.value, this.data.purpose).subscribe(
        () => {
          this.otpSent = true;
          this.loading = false;
          this.startTimer(300);
        },
        (error) => {
          if(error.status === 409) {
            error.error.updatedAt = new Date(error.error.updatedAt);
            const time = new Date(error.error.updatedAt).getTime();
            const currentTime = new Date().getTime();
            const diff = currentTime - time;
            this.otpSent = true;
            this.startTimer(300 - Math.floor(diff / 1000));
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
          } else {
            this.checkoutForm.get('otp')?.setErrors({ invalidOtp: true });
            this.verifyOtpLoading = false;
            // Handle OTP verification failure
          }
        },
        (error) => {
          this.checkoutForm.get('otp')?.setErrors({ invalidOtp: true });
          this.verifyOtpLoading = false;
          console.error('Error verifying OTP:', error);
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

  payWithRazorpay() {
    const paymentDetails = {
      amount: this.checkoutForm.get('amount')?.value, // Razorpay works with smallest currency unit
      currency: 'INR',
      receipt: 'receipt_order_74394',
    };

    this.paymentService.createOrder(paymentDetails).subscribe((order: any) => {
      const options = {
        key: 'rzp_test_1C17MRGTCscaEU', // Enter the Key ID generated from the Dashboard
        amount: order.amount,
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

  verifyPayment(paymentResponse: any) {
    console.log(paymentResponse)
    this.paymentService.verifyPayment(paymentResponse).subscribe((verificationResult: any) => {
      if (verificationResult.success) {
        console.log('Payment successful');
        this.userFileInfoService.insertUserFileInfo({
          name: this.checkoutForm.get('name')?.value,
          email: this.checkoutForm.get('email')?.value,
          otp: this.checkoutForm.get('otp')?.value,
          purpose: this.data.purpose,
          purchase: {
              filename: this.data.filename,
              purchase: {
                id: this.data.file._id,
                entity: 'file',
                amount: this.checkoutForm.get('amount')?.value,
                currency: 'INR',
                status: 'success',
                receipt: verificationResult.receipt,
                offer_id: 'offer_12345',
                attempts: 1,
                notes: [],
                updatedAt: new Date().getTime()
              }
            }
        }).subscribe(
          (response: any) => {
            console.log('User file info inserted:', response);
          },
          (error) => {
            console.error('Error inserting user file info:', error);
          }
        );

        this.router.navigate(['/success-receipt']); // Redirect to success-receipt component
        this.dialogRef.close();
      } else {
        console.error('Payment verification failed');
      }
    });
  }

  // confirmVerifyPayment(){
  //   if(this.data.purpose === 'verify') {

  //   }
  // }
  alreadyPaid : boolean = false;
  confirmPayment() {
    // if(this.data.purpose === 'verify') {
    //   const obj = {name: this.checkoutForm.get('name')?.value,
    //   email: this.checkoutForm.get('email')?.value}
      this.verifyPayLoading = true;
      const name = this.checkoutForm.get('name')?.value;
      const email = this.checkoutForm.get('email')?.value;
      const otp = this.checkoutForm.get('otp')?.value;
      this.userFileInfoService.getFileInfo(name,email,otp,this.data.purpose).subscribe((response: any) => {
        if(response.ok) {
          console.log('Payment verif res - ', response);

          response = response.body;

          const fileRec = response.data.user.purchases.find((file: any) => {
            return this.data._id == file._id && file.purchase.status === 'success'
          })

          if(fileRec) {
            this.userFileInfoService.emailFileInfo({fileid:fileRec.id,userid:response.data.user._id}).subscribe((res: any) => {
              console.log('Files info - ', res);
              this.alreadyPaid = true;
            });
          }
          else{
            this.verifyPayLoading = false;
            console.error('Payment verification failed');
          }

          // response.data.purchases.forEach((file: any) => {
          //   if(this.file file.status === 'success') {
          //     this.userFileInfoService.getFilesInfo(file).subscribe((res: any) => {
          //       console.log('Files info - ', res);
          //     });
          //   }
          // }
          // this.router.navigate(['/success-receipt']); // Redirect to success-receipt component
          // this.dialogRef.close();
        } else {
          console.error('Payment verification failed');
          this.verifyPayLoading = false;
        }
      });
    // }
  }
}
