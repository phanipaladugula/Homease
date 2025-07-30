
// Mock phone verification service
// In production, this would integrate with services like Twilio, AWS SNS, etc.

interface VerificationResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}

interface OTPVerificationResponse {
  success: boolean;
  message: string;
  verified: boolean;
}

class PhoneVerificationService {
  private static instance: PhoneVerificationService;
  private verificationSessions: Map<string, { phone: string; otp: string; expiresAt: Date }> = new Map();

  static getInstance(): PhoneVerificationService {
    if (!PhoneVerificationService.instance) {
      PhoneVerificationService.instance = new PhoneVerificationService();
    }
    return PhoneVerificationService.instance;
  }

  async sendOTP(phoneNumber: string): Promise<VerificationResponse> {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

      // Store OTP session
      this.verificationSessions.set(sessionId, {
        phone: phoneNumber,
        otp,
        expiresAt
      });

      // In production, send actual SMS here
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: `OTP sent to ${phoneNumber}`,
        sessionId
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  async verifyOTP(sessionId: string, otp: string): Promise<OTPVerificationResponse> {
    try {
      const session = this.verificationSessions.get(sessionId);
      
      if (!session) {
        return {
          success: false,
          message: 'Invalid session. Please request a new OTP.',
          verified: false
        };
      }

      if (new Date() > session.expiresAt) {
        this.verificationSessions.delete(sessionId);
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.',
          verified: false
        };
      }

      if (session.otp !== otp) {
        return {
          success: false,
          message: 'Invalid OTP. Please try again.',
          verified: false
        };
      }

      // OTP verified successfully
      this.verificationSessions.delete(sessionId);
      
      return {
        success: true,
        message: 'Phone number verified successfully!',
        verified: true
      };
    } catch (error) {
      return {
        success: false,
        message: 'Verification failed. Please try again.',
        verified: false
      };
    }
  }

  async resendOTP(sessionId: string): Promise<VerificationResponse> {
    try {
      const session = this.verificationSessions.get(sessionId);
      
      if (!session) {
        return {
          success: false,
          message: 'Invalid session. Please start verification again.'
        };
      }

      // Delete old session and create new one
      this.verificationSessions.delete(sessionId);
      return await this.sendOTP(session.phone);
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resend OTP. Please try again.'
      };
    }
  }
}

export default PhoneVerificationService;
