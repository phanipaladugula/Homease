import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import apiClient from '../api'; 
import { 
  User, 
  Mail, 
  Lock,
  Phone,
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Home,
  ArrowRight,
  CheckCircle,
  Loader2,
  Sparkles,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// signup page edites

// A placeholder component for ImageUpload to prevent compilation errors.
const ImageUpload = ({ onImageSelect, currentImage }: { onImageSelect: (file: File) => void, currentImage: string | null }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageSelect(event.target.files[0]);
        }
    };
    return (
        <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 border-4 border-muted">
                <AvatarImage src={currentImage || "/placeholder.svg"} alt="Profile Preview" className="object-cover" />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    <User/>
                </AvatarFallback>
            </Avatar>
            <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
        </div>
    );
};


const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    userType: '',
    phone: '',
    avatar: '', // To store the image data URL or Base64
    
    // Location
    city: '',
    preferredLocation: '',
    
    // Education/Work
    college: '',
    course: '',
    year: '',
    company: '',
    jobTitle: '',
    workLocation: '',
    
    // Business Info
    businessName: '',
    businessType: '',
    experience: '',
    
    // Lifestyle & Description
    habits: [] as string[],
    description: '',

    // Housing Intent
    intent: '', 
    budget: '',
    roomType: '',
    moveInDate: '',
    stayDuration: '',
    
    // Property Info
    propertyTypes: [] as string[],
    listingLocations: '',

    // Preferences
    amenities: [] as string[],
    restrictions: [] as string[],

    // Agreements
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange('avatar', reader.result as string);
      setImageUrlInput(''); // Clear URL input when a file is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrlInput(url);
    handleInputChange('avatar', url); // Update the main avatar state
  };

  const handleCheckboxGroupChange = (key: 'propertyTypes' | 'habits' | 'amenities' | 'restrictions', value: string, checked: boolean) => {
    const currentValues = formData[key] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    handleInputChange(key, newValues);
  };

  const steps = [
    "Basic Information", "Location Preferences", 
    formData.userType === 'student' ? "Education" : formData.userType === 'professional' ? "Work" : "Business",
    (formData.userType === 'student' || formData.userType === 'professional') ? "Lifestyle" : "Description",
    (formData.userType === 'student' || formData.userType === 'professional') ? "Housing" : "Property Info",
    (formData.userType === 'student' || formData.userType === 'professional') ? "Preferences" : "Final Details",
    "Terms & Conditions"
  ];

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.password && formData.password === formData.confirmPassword && formData.age && formData.gender && formData.userType && formData.phone.length === 10;
      case 2:
        return formData.city && formData.preferredLocation;
      case 3:
        if (formData.userType === 'student') return formData.college && formData.course && formData.year;
        if (formData.userType === 'professional') return formData.company && formData.jobTitle && formData.workLocation;
        if (formData.userType === 'owner' || formData.userType === 'broker') return formData.businessName && formData.businessType;
        return false;
      case 4:
        return formData.description;
      case 5:
        if (formData.userType === 'student' || formData.userType === 'professional') {
          return formData.intent && formData.budget && formData.roomType && formData.moveInDate;
        } else if (formData.userType === 'owner' || formData.userType === 'broker') {
          return formData.propertyTypes.length > 0 && formData.listingLocations;
        }
        return false;
      case 6: // Preferences Step
        return true; // This step is optional
      case 7: // Terms & Conditions
        return formData.agreeTerms && formData.agreePrivacy;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (formData.password !== formData.confirmPassword && currentStep === 1) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        return;
    }
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({ title: "Please fill all required fields", description: "Make sure all fields with a * are completed.", variant: "destructive" });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleGenerateDescription = async () => {
    if (!aiCustomPrompt.trim()) {
      toast({ title: "Please provide instructions", description: "Tell the AI what kind of description you want.", variant: "destructive" });
      return;
    }
    
    setShowAiModal(false);
    setIsGenerating(true);

     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        toast({ title: "AI Generation Failed", description: "API Key is missing.", variant: "destructive" });
        setIsGenerating(false);
        return;
    }

    let prompt = '';
    if (formData.userType === 'student' || formData.userType === 'professional') {
        const baseInfo = `Name: ${formData.name}, Age: ${formData.age}, Role: ${formData.userType}. ${formData.userType === 'student' ? `Studies ${formData.course} at ${formData.college}.` : `Works as a ${formData.jobTitle} at ${formData.company}.`}`;
        prompt = `You are writing a short "About Me" bio for a housing profile. The user is a ${formData.userType}. Their details are: ${baseInfo}. Based on this, write a friendly and appealing bio. The user has requested the following tone: "${aiCustomPrompt}". The goal is to find a great flatmate. Keep it concise, in the first-person, and do not use markdown formatting.`;
    } else if (formData.userType === 'owner' || formData.userType === 'broker') {
        const businessDetails = `Business Name: ${formData.businessName}, Business Type: ${formData.businessType}, Primary Listing Locations: ${formData.listingLocations}.`;
        prompt = `You are writing a professional description for a property ${formData.userType}. Their business details are: ${businessDetails}. Based on this, write a professional and trustworthy description for their housing profile. The user has requested the following tone: "${aiCustomPrompt}". The goal is to attract potential tenants. Highlight their services and expertise. Keep it concise and do not use markdown formatting.`;
    }

    // --- Helper function for exponential backoff ---
    const fetchWithBackoff = async (retries = 4, delay = 1500) => {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.status === 503) { // Specifically handle 503 Overloaded error
                    if (i < retries - 1) {
                        const jitter = Math.random() * 500; // Add jitter to avoid thundering herd
                        await new Promise(resolve => setTimeout(resolve, delay + jitter));
                        delay *= 2; // Exponentially increase delay
                        continue; // Retry the loop
                    } else {
                        throw new Error("The AI model is temporarily overloaded. Please try again in a few moments.");
                    }
                }

                if (!response.ok) {
                    const errorBody = await response.json();
                    console.error("API Error:", errorBody);
                    throw new Error(`API request failed: ${errorBody.error?.message || response.statusText}`);
                }
                
                return await response.json(); // Success
            } catch (error) {
                if (i === retries - 1) throw error; // Throw error on last attempt
            }
        }
    };

    try {
        const result = await fetchWithBackoff();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            const generatedText = result.candidates[0].content.parts[0].text;
            handleInputChange('description', generatedText);
            toast({ title: "Description generated!", variant: "success" });
        } else {
            throw new Error("Invalid API response structure.");
        }
    } catch (error: any) {
        console.error("AI description generation failed:", error);
        toast({ title: "AI Generation Failed", description: error.message || "Please check the console for details.", variant: "destructive" });
    } finally {
        setIsGenerating(false);
        setAiCustomPrompt('');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(steps.length)) {
        toast({ title: "Please accept terms and conditions", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);

    // Prepare data to be sent to the server, including the full avatar string
    const profileData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        userType: formData.userType,
        phone: `+91${formData.phone}`,
        avatar: formData.avatar, // Send the full avatar data (URL or Base64)
        image: formData.avatar,  // Send the full avatar data (URL or Base64)
        location: `${formData.preferredLocation}, ${formData.city}`,
        habits: formData.habits,
        description: formData.description,
        amenities: formData.amenities,
        restrictions: formData.restrictions,
        intent: formData.intent, 
        budget: formData.budget,
        roomType: formData.roomType,
        moveInDate: formData.moveInDate,
        stayDuration: formData.stayDuration,
        type: (formData.intent === 'have-flat-need-flatmate' || formData.userType === 'owner' || formData.userType === 'broker') ? 'flat' : 'flatmate',
        verifications: { phone: false, email: false, college: false, identity: false },
        tags: [formData.userType, formData.city],
        compatibility: Math.floor(Math.random() * (95 - 65 + 1) + 65),
    };

    if (formData.userType === 'student') {
        Object.assign(profileData, {
            college: formData.college,
            course: formData.course,
            year: formData.year,
        });
    } else if (formData.userType === 'professional') {
        Object.assign(profileData, {
            company: formData.company,
            jobTitle: formData.jobTitle,
            workLocation: formData.workLocation,
        });
    } else if (formData.userType === 'owner' || formData.userType === 'broker') {
        Object.assign(profileData, {
            businessName: formData.businessName,
            businessType: formData.businessType,
            experience: formData.experience,
            propertyTypes: formData.propertyTypes,
            listingLocations: formData.listingLocations,
        });
    }

    try {
        const response = await apiClient.post('/profiles', profileData);
        
        const newProfile = response.data.profile;

        // Conditionally handle localStorage to keep small URLs but discard large Base64 data.
        if (newProfile.avatar && newProfile.avatar.startsWith('data:image')) {
            // If it's a Base64 string from a file upload, remove it before saving to avoid errors.
            const { avatar, image, ...profileToStore } = newProfile;
            localStorage.setItem('userProfile', JSON.stringify(profileToStore));
        } else {
            // If it's a URL (or empty), save the whole profile. The URL is small and useful.
            localStorage.setItem('userProfile', JSON.stringify(newProfile));
        }

        toast({ title: "Account Created Successfully!", description: "Welcome! Please verify your phone number." });
        
        const returnUrl = (formData.userType === 'owner' || formData.userType === 'broker') ? '/profile' : '/personality-test';
        navigate(`/phone-verification?return=${returnUrl}&phone=${formData.phone}`);

    } catch (error: any) {
        console.error("Signup failed:", error);
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        toast({ title: "Signup Failed", description: errorMessage, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
};


  const habitsList = ["Clean", "Early Riser", "Vegetarian", "Pet Friendly", "Night Owl", "Cooking", "Social", "Fitness", "Studious", "Quiet", "Non-Smoker"];
  const amenitiesList = ["AC", "Washing Machine", "Parking", "TV", "WiFi", "Gym"];
  const restrictionsList = ["No loud music", "No smoking indoors", "No pets", "Vegetarian only"];

  return (
    <>
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Generate Description with AI</CardTitle>
              <p className="text-sm text-muted-foreground">The AI will use the details you've already entered.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700 mb-2">What kind of description do you want? *</label>
                <Textarea id="aiPrompt" placeholder="e.g., A friendly and welcoming tone..." value={aiCustomPrompt} onChange={(e) => setAiCustomPrompt(e.target.value)} rows={3}/>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowAiModal(false)}>Cancel</Button>
                <Button onClick={handleGenerateDescription} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Our Community</h1>
            <p className="text-gray-600">Create your account to find your perfect flatmate or flat</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }}/></div>
            <p className="text-sm text-gray-600 mt-2">{steps[currentStep - 1]}</p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader><CardTitle className="text-xl text-gray-800">{steps[currentStep - 1]}</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <ImageUpload onImageSelect={handleImageSelect} currentImage={formData.avatar} />
                    <div className="relative my-4 w-full flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paste Image URL</label>
                        <Input value={imageUrlInput} onChange={handleImageUrlChange} placeholder="https://example.com/image.png" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter your full name" className="pl-10"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Age *</label><Input type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} placeholder="Your age" min="18" max="50"/></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter your email" className="pl-10"/></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500">+91</div><Input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit mobile number" className="pl-20" maxLength={10}/></div></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Password *</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Create a password" className="pl-10"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm your password" className="pl-10"/></div></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label><Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">I am a *</label><Select value={formData.userType} onValueChange={(v) => handleInputChange('userType', v)}><SelectTrigger><SelectValue placeholder="Select user type" /></SelectTrigger><SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="professional">Working Professional</SelectItem><SelectItem value="owner">Property Owner</SelectItem><SelectItem value="broker">Real Estate Broker</SelectItem></SelectContent></Select></div>
                  </div>
                </div>
              )}

              {/* Step 2: Location Preferences */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">City *</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Select value={formData.city} onValueChange={(v) => handleInputChange('city', v)}><SelectTrigger className="pl-10"><SelectValue placeholder="Select your city" /></SelectTrigger><SelectContent><SelectItem value="Delhi">Delhi</SelectItem><SelectItem value="Mumbai">Mumbai</SelectItem><SelectItem value="Bangalore">Bangalore</SelectItem><SelectItem value="Pune">Pune</SelectItem><SelectItem value="Hyderabad">Hyderabad</SelectItem><SelectItem value="Chennai">Chennai</SelectItem></SelectContent></Select></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location/Area *</label><Input value={formData.preferredLocation} onChange={(e) => handleInputChange('preferredLocation', e.target.value)} placeholder="e.g., Hauz Khas, Koramangala, Powai"/></div>
                </div>
              )}

              {/* Step 3: Education/Work/Business Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {formData.userType === 'student' && (
                    <>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">College/University *</label><div className="relative"><GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={formData.college} onChange={(e) => handleInputChange('college', e.target.value)} placeholder="Enter your college name" className="pl-10"/></div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Course *</label><Input value={formData.course} onChange={(e) => handleInputChange('course', e.target.value)} placeholder="e.g., B.Tech, MBA, M.Sc"/></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Year *</label><Select value={formData.year} onValueChange={(v) => handleInputChange('year', v)}><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger><SelectContent><SelectItem value="1st Year">1st Year</SelectItem><SelectItem value="2nd Year">2nd Year</SelectItem><SelectItem value="3rd Year">3rd Year</SelectItem><SelectItem value="4th Year">4th Year</SelectItem><SelectItem value="Final Year">Final Year</SelectItem></SelectContent></Select></div>
                      </div>
                    </>
                  )}
                  {formData.userType === 'professional' && (
                    <>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Company *</label><div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={formData.company} onChange={(e) => handleInputChange('company', e.target.value)} placeholder="Enter your company name" className="pl-10"/></div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label><Input value={formData.jobTitle} onChange={(e) => handleInputChange('jobTitle', e.target.value)} placeholder="e.g., Software Engineer"/></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Work Location *</label><Input value={formData.workLocation} onChange={(e) => handleInputChange('workLocation', e.target.value)} placeholder="e.g., Gurgaon, Whitefield"/></div>
                      </div>
                    </>
                  )}
                  {(formData.userType === 'owner' || formData.userType === 'broker') && (
                    <>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label><div className="relative"><Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={formData.businessName} onChange={(e) => handleInputChange('businessName', e.target.value)} placeholder="Enter business/company name" className="pl-10"/></div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label><Select value={formData.businessType} onValueChange={(v) => handleInputChange('businessType', v)}><SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger><SelectContent><SelectItem value="individual">Individual Owner</SelectItem><SelectItem value="property-management">Property Management</SelectItem><SelectItem value="real-estate-agency">Real Estate Agency</SelectItem></SelectContent></Select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Experience</label><Select value={formData.experience} onValueChange={(v) => handleInputChange('experience', v)}><SelectTrigger><SelectValue placeholder="Years of experience" /></SelectTrigger><SelectContent><SelectItem value="less-than-1">Less than 1 year</SelectItem><SelectItem value="1-3">1-3 years</SelectItem><SelectItem value="3-5">3-5 years</SelectItem><SelectItem value="5+">5+ years</SelectItem></SelectContent></Select></div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 4: Lifestyle / Business Description */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {(formData.userType === 'student' || formData.userType === 'professional') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select habits that describe you</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {habitsList.map(habit => (
                          <div key={habit} className="flex items-center space-x-2"><Checkbox id={habit} checked={formData.habits.includes(habit)} onCheckedChange={(c) => handleCheckboxGroupChange('habits', habit, c as boolean)}/><label htmlFor={habit} className="text-sm">{habit}</label></div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        {formData.userType === 'student' || formData.userType === 'professional' ? 'About Me *' : 'Business Description *'}
                      </label>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowAiModal(true)} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Generate with AI
                      </Button>
                    </div>
                    <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Tell us a bit about yourself or your business..." rows={5}/>
                  </div>
                </div>
              )}

              {/* Step 5: Housing / Property Info */}
              {currentStep === 5 && (
                <>
                  {(formData.userType === 'student' || formData.userType === 'professional') ? (
                    <div className="space-y-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">What are you looking for? *</label><Select value={formData.intent} onValueChange={(v) => handleInputChange('intent', v)}><SelectTrigger><SelectValue placeholder="Select your intent" /></SelectTrigger><SelectContent><SelectItem value="looking-for-flat">Looking for a Flat</SelectItem><SelectItem value="looking-for-flatmate">Looking for a Flatmate</SelectItem></SelectContent></Select></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label><Select value={formData.budget} onValueChange={(v) => handleInputChange('budget', v)}><SelectTrigger><SelectValue placeholder="Select budget range" /></SelectTrigger><SelectContent><SelectItem value="5000-10000">₹5,000-₹10,000</SelectItem><SelectItem value="10000-15000">₹10,000-₹15,000</SelectItem><SelectItem value="15000-20000">₹15,000-₹20,000</SelectItem></SelectContent></Select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label><Select value={formData.roomType} onValueChange={(v) => handleInputChange('roomType', v)}><SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger><SelectContent><SelectItem value="Single Room">Single Room</SelectItem><SelectItem value="Shared Room">Shared Room</SelectItem><SelectItem value="Entire Flat">Entire Flat</SelectItem></SelectContent></Select></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Move-in Date *</label><Input type="date" value={formData.moveInDate} onChange={(e) => handleInputChange('moveInDate', e.target.value)}/></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Stay Duration</label><Select value={formData.stayDuration} onValueChange={(v) => handleInputChange('stayDuration', v)}><SelectTrigger><SelectValue placeholder="How long?" /></SelectTrigger><SelectContent><SelectItem value="3-6 months">3-6 months</SelectItem><SelectItem value="6-12 months">6-12 months</SelectItem><SelectItem value="1-2 years">1-2 years</SelectItem></SelectContent></Select></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">What types of properties do you list? *</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Apartment', 'Independent House', 'Villa', 'PG/Hostel'].map(type => (
                            <div key={type} className="flex items-center space-x-2"><Checkbox id={type} checked={formData.propertyTypes.includes(type)} onCheckedChange={(c) => handleCheckboxGroupChange('propertyTypes', type, c as boolean)}/><label htmlFor={type} className="text-sm">{type}</label></div>
                          ))}
                        </div>
                      </div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Primary Listing Locations *</label><Input value={formData.listingLocations} onChange={(e) => handleInputChange('listingLocations', e.target.value)} placeholder="e.g., Koramangala, HSR Layout"/></div>
                    </div>
                  )}
                </>
              )}

              {/* Step 6: Preferences (for students/professionals) */}
              {currentStep === 6 && (
                <>
                  {(formData.userType === 'student' || formData.userType === 'professional') ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">What amenities are you looking for?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {amenitiesList.map(item => (
                            <div key={item} className="flex items-center space-x-2"><Checkbox id={`amenity-${item}`} checked={formData.amenities.includes(item)} onCheckedChange={(c) => handleCheckboxGroupChange('amenities', item, c as boolean)}/><label htmlFor={`amenity-${item}`} className="text-sm">{item}</label></div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Do you have any restrictions?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {restrictionsList.map(item => (
                            <div key={item} className="flex items-center space-x-2"><Checkbox id={`restriction-${item}`} checked={formData.restrictions.includes(item)} onCheckedChange={(c) => handleCheckboxGroupChange('restrictions', item, c as boolean)}/><label htmlFor={`restriction-${item}`} className="text-sm">{item}</label></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-600 p-4">
                      <p>Just one more step to go!</p>
                    </div>
                  )}
                </>
              )}

              {/* Step 7: Terms & Conditions */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-medium text-gray-800 mb-2">Review Your Information</h3><div className="space-y-1 text-sm text-gray-600"><p><strong>Name:</strong> {formData.name}</p><p><strong>Email:</strong> {formData.email}</p><p><strong>Type:</strong> {formData.userType}</p></div></div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3"><Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={(c) => handleInputChange('agreeTerms', c as boolean)}/><label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms and Conditions</Link></label></div>
                    <div className="flex items-start space-x-3"><Checkbox id="privacy" checked={formData.agreePrivacy} onCheckedChange={(c) => handleInputChange('agreePrivacy', c as boolean)}/><label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed">I agree to the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></label></div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><div className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" /><div><p className="text-sm font-medium text-blue-800">What's Next?</p><p className="text-xs text-blue-600 mt-1">{formData.userType === 'owner' || formData.userType === 'broker' ? 'You will be redirected to your profile page.' : 'You will be redirected to a quick personality assessment.'}</p></div></div></div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>Previous</Button>
                {currentStep === steps.length ? (
                  <Button onClick={handleSubmit} disabled={!validateStep(currentStep) || isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Create Account
                    {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                ) : (
                  <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white">
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;