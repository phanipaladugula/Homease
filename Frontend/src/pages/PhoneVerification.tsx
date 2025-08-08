import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Shield, Clock, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

// Mock service for demonstration. In a real app, this would be a real service.
const API_KEY = "94ee5453-6ba5-11f0-a562-0200cd936042"; // Replace with your real API key

const PhoneVerificationService = {
  sendOTP: async (phone: string) => {
    try {
      const response = await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/+91${phone}/AUTOGEN`);
      if (response.data.Status === 'Success') {
        return {
          success: true,
          sessionId: response.data.Details,
          message: 'OTP sent successfully'
        };
      } else {
        return {
          success: false,
          message: response.data.Details
        };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: 'Error sending OTP' };
    }
  },

  verifyOTP: async (sessionId: string, otp: string) => {
    try {
      const response = await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`);
      if (response.data.Status === 'Success') {
        return { success: true, verified: true, message: 'OTP Verified' };
      } else {
        return { success: false, verified: false, message: response.data.Details };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, verified: false, message: 'Error verifying OTP' };
    }
  }
};


const PhoneVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const returnUrl = searchParams.get('return') || '/profile';
  const initialPhone = searchParams.get('phone') || '';
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [isEditingPhone, setIsEditingPhone] = useState(!initialPhone);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const validatePhoneNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleSendOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({ title: "Invalid Phone Number", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await PhoneVerificationService.sendOTP(phoneNumber);
      if (response.success && response.sessionId) {
        setSessionId(response.sessionId);
        setStep('otp');
        setIsEditingPhone(false);
        setTimeLeft(300);
        setCanResend(false);
        toast({ title: "OTP Sent", description: `Check console for OTP sent to +91 ${phoneNumber}` });
      } else {
        toast({ title: "Failed to Send OTP", description: response.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send OTP.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // src/components/auth/PhoneVerification.tsx

  const handleVerifyOTP = async () => {
    if (!sessionId || otp.length !== 6) {
      toast({ title: "Invalid OTP", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const otpResponse = await PhoneVerificationService.verifyOTP(sessionId, otp);
      
      if (otpResponse.success && otpResponse.verified) {
        
        // --- FIXED: BACKEND UPDATE LOGIC ---

        // 1. Get the user's profile from localStorage using the CORRECT key.
        const storedProfile = localStorage.getItem('userProfile');
        
        if (storedProfile) {
            const user = JSON.parse(storedProfile);
            
            // 2. Send request to backend to update verification status.
            const updateResponse = await axios.post('http://localhost:5001/api/profiles/verify-phone', { 
                email: user.email,
                phone: `+91${phoneNumber}`
            });

            // 3. IMPORTANT: Update the userProfile in localStorage with the fresh, verified data from the server.
            if (updateResponse.data && updateResponse.data.profile) {
                localStorage.setItem('userProfile', JSON.stringify(updateResponse.data.profile));
            }
        }
        
        // 4. The 'phoneVerified' flag is no longer needed as the main profile is now updated.
        // localStorage.setItem('phoneVerified', 'true'); // This line is now redundant and can be removed.

        toast({
          title: "Phone Verified!",
          description: "Your phone number has been successfully verified.",
          className: "bg-green-100 border-green-400 text-green-700",
        });

        setTimeout(() => navigate(returnUrl), 1000);

      } else {
        toast({ title: "Verification Failed", description: otpResponse.message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast({ title: "Error", description: "Verification failed due to a server error.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4" /> Back</Button>
          <div className="flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold text-gray-800">Phone Verification</h1></div>
        </div>
        
        {/* Phone Number Step */}
        {step === 'phone' && (
          <Card className="bg-white/95">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-800">Confirm Your Phone Number</CardTitle>
              <p className="text-sm text-gray-600 mt-2">We'll send a verification code to this number.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="phone">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+91</div>
                  <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit mobile number" className="pl-12" maxLength={10} disabled={!isEditingPhone}/>
                  {!isEditingPhone && <Button variant="ghost" size="sm" onClick={() => setIsEditingPhone(true)} className="absolute right-2 top-1/2 -translate-y-1/2"><Edit className="h-4 w-4"/></Button>}
                </div>
              </div>
              <Button onClick={handleSendOTP} disabled={!validatePhoneNumber(phoneNumber) || isLoading} className="w-full bg-primary text-white">
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <Card className="bg-white/95">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-800">Enter Verification Code</CardTitle>
              <p className="text-sm text-gray-600 mt-2">We've sent a 6-digit code to +91 {phoneNumber}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="otp">Verification Code</label>
                <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit code" className="text-center text-lg tracking-widest" maxLength={6} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Clock className="h-4 w-4" /><span>{timeLeft > 0 ? `Resend in: ${formatTime(timeLeft)}` : 'Code expired'}</span></div>
                {canResend && <Button variant="link" onClick={handleSendOTP} disabled={isLoading} className="p-0 h-auto">Resend OTP</Button>}
              </div>
              <Button onClick={handleVerifyOTP} disabled={otp.length !== 6 || isLoading} className="w-full bg-primary text-white">
                {isLoading ? 'Verifying...' : 'Verify Phone Number'}
              </Button>
              <Button variant="outline" onClick={() => setStep('phone')} className="w-full">Change Number</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
