export interface SendOtpRequest {
    email: string;
    purpose: string;
  }
  
  export interface OtpResponse {
    success: boolean;
    message?: string;
  }
  
  export interface VerifyOtpRequest {
    email: string;
    otp: string;
    purpose: string;
  }
  
  export interface VerificationResult {
    success: boolean;
    error?: string;
  }
  