export interface PaymentDetails {
    amount: number;
    currency: string;
    receipt: string;
  }
  
  export interface OrderResponse {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  }
  
  export interface VerifyPaymentDetails {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  export interface VerificationResult {
    success: boolean;
    error?: string;
  }
  