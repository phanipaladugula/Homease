import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Home, Upload, Plus, X, Sparkles, Loader2, PartyPopper, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useToast } from '@/hooks/use-toast';
//added:- niharika
// A placeholder component for ImageUpload to prevent compilation errors.
const ImageUpload = ({ onImageSelect, className }: { onImageSelect: (file: File) => void, className?: string }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageSelect(event.target.files[0]);
        }
    };
    return (
        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${className}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
    );
};


const PostFlat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    rent: '',
    deposit: '',
    flatType: '',
    furnishing: '',
    amenities: [] as string[],
    images: [] as string[],
    genderPreference: '',
    occupancy: '',
    availability: '',
    posterType: ''
  });

  // State for AI functionality
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Load the currently logged-in user's data from localStorage
    const loggedInData = localStorage.getItem('userProfile'); // ✅ Corrected key
    if (loggedInData) {
      setCurrentUser(JSON.parse(loggedInData));
    } else {
      // If no user is logged in, redirect them to the login page
      toast({ title: "Please log in to post a flat.", variant: "destructive" });
      navigate('/login');
    }
  }, [navigate, toast]);


  const posterTypes = [
    { id: 'owner', title: 'Property Owner', description: 'I own this property and want to rent it out' },
    // { id: 'tenant', title: 'Current Tenant', description: 'I live here and am looking for a flatmate' },
    { id: 'broker', title: 'Broker/Agent', description: 'I am listing this property on behalf of the owner' }
  ];

  const amenitiesList = ['WiFi', 'Parking', 'Security', 'Gym', 'Swimming Pool', 'Laundry', 'Kitchen', 'Balcony', 'Air Conditioning', 'Elevator', 'Power Backup'];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleGenerateDescription = async () => {
    if (!aiCustomPrompt.trim()) {
      toast({ title: "Please provide instructions for the AI.", variant: "destructive" });
      return;
    }
    setShowAiModal(false);
    setIsGenerating(true);
    
// In PostFlat.tsx, inside handleGenerateDescription:
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Ensure this path is used exactly:
    const { title, location, rent, flatType, furnishing, amenities } = formData;
    
    const prompt = `Write a compelling and friendly property listing description for a flat. 
    Use the following user instruction for the tone and style: "${aiCustomPrompt}".
    
    Incorporate these details seamlessly into the description:
    - Title: "${title}"
    - Location: "${location}"
    - Rent: "₹${rent} per month"
    - Type: "${flatType}"
    - Furnishing: "${furnishing}"
    - Key Amenities: "${amenities.join(', ')}"
    
    The target audience is students or young professionals. Keep it concise and highlight the best features. Do not use markdown or special formatting.`;

    try {
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            const generatedText = result.candidates[0].content.parts[0].text;
            setFormData(prev => ({ ...prev, description: generatedText }));
        } else {
            throw new Error("Invalid response structure from API.");
        }
    } catch (error) {
        console.error("Error generating description:", error);
        toast({ title: "AI Generation Failed", description: "Please try again.", variant: "destructive" });
    } finally {
        setIsGenerating(false);
        setAiCustomPrompt('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        toast({ title: "Login session expired. Please log in again.", variant: "destructive" });
        navigate('/login');
        return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);

    // **FIXED:** Create a new profile object for the flat with a unique email and a dummy password
    const flatProfileData = {
        name: formData.title,
        description: `Posted by: ${currentUser.name}\nContact: ${currentUser.email}\n\n${formData.description}`,
        location: formData.location,
        budget: `₹${formData.rent}`,
        type: 'flat',
        userType: formData.posterType,
        amenities: formData.amenities,
        image: formData.images[0] || '',
        flatType: formData.flatType,
        furnishing: formData.furnishing,
        gender: formData.genderPreference.toLowerCase().replace(' only', ''),
        moveInDate: formData.availability,
        
        // Generate a unique email for this flat listing to avoid database conflicts
        email: `flat-${Date.now()}@flatmate.vibe`,
        // **FIX:** Add a dummy password to satisfy the backend signup endpoint
        password: `dummy-password-${Date.now()}`,
        
        // Add default values for other fields to ensure validation passes
        age: null,
        tags: [formData.flatType, formData.furnishing].filter(Boolean),
        compatibility: Math.floor(Math.random() * (95 - 75 + 1) + 75),
    };

    try {
        // This POST request creates a new profile document AND a new account document in the database
        await apiClient.post('/profiles', flatProfileData);
        setSubmitStatus('success');
        toast({ title: "Success!", description: "Your flat has been posted." });
        setTimeout(() => navigate('/home'), 2000);
    } catch (error: any) {
        console.error('Error posting flat:', error);
        setSubmitStatus('error');
        const errorMessage = error.response?.data?.message || "Please check your form for errors and try again.";
        toast({ title: "Submission Failed", description: errorMessage, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* AI Style Selection Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Generate Description with AI</CardTitle>
              <CardDescription>
                The AI will use the details you've already provided to write a description.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="aiPrompt">What kind of description do you want?</Label>
                <Textarea id="aiPrompt" placeholder="e.g., A friendly and welcoming tone for students..." value={aiCustomPrompt} onChange={(e) => setAiCustomPrompt(e.target.value)} rows={3}/>
                <p className="text-xs text-muted-foreground mt-1">Example: "Make it sound luxurious and professional."</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowAiModal(false)}>Cancel</Button>
                <Button onClick={handleGenerateDescription} disabled={isGenerating}>
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Home className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Post Your Flat</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader><CardTitle>1. Who are you?</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={formData.posterType} onValueChange={(value) => setFormData(prev => ({ ...prev, posterType: value }))} className="space-y-3">
                  {posterTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value={type.id} id={type.id} />
                      <div>
                        <Label htmlFor={type.id} className="font-medium cursor-pointer">{type.title}</Label>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>2. Add Property Images</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image} alt={`Property ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <ImageUpload onImageSelect={handleImageUpload} className="h-32" />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader><CardTitle>3. Basic Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label htmlFor="title">Property Title</Label><Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Spacious 2BHK in Koramangala" required /></div>
                  <div><Label htmlFor="location">Location</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="location" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} placeholder="Enter area, city" className="pl-10" required /></div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="rent">Monthly Rent (₹)</Label><Input id="rent" type="number" value={formData.rent} onChange={(e) => setFormData(prev => ({ ...prev, rent: e.target.value }))} placeholder="25000" required /></div>
                    <div><Label htmlFor="deposit">Security Deposit (₹)</Label><Input id="deposit" type="number" value={formData.deposit} onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))} placeholder="50000" required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Flat Type</Label><Select value={formData.flatType} onValueChange={(v) => setFormData(p => ({ ...p, flatType: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="1 BHK">1 BHK</SelectItem><SelectItem value="2 BHK">2 BHK</SelectItem><SelectItem value="3 BHK">3 BHK</SelectItem></SelectContent></Select></div>
                    <div><Label>Furnishing</Label><Select value={formData.furnishing} onValueChange={(v) => setFormData(p => ({ ...p, furnishing: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Fully Furnished">Fully Furnished</SelectItem><SelectItem value="Semi Furnished">Semi Furnished</SelectItem><SelectItem value="Unfurnished">Unfurnished</SelectItem></SelectContent></Select></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>4. Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label>Gender Preference</Label><Select value={formData.genderPreference} onValueChange={(v) => setFormData(p => ({ ...p, genderPreference: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Male only">Male only</SelectItem><SelectItem value="Female only">Female only</SelectItem></SelectContent></Select></div>
                  <div><Label>Occupancy Type</Label><Select value={formData.occupancy} onValueChange={(v) => setFormData(p => ({ ...p, occupancy: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Single">Single</SelectItem><SelectItem value="Shared">Shared</SelectItem><SelectItem value="Entire Flat">Entire Flat</SelectItem></SelectContent></Select></div>
                  <div><Label>Available From</Label><Input type="date" value={formData.availability} onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))} required /></div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>5. Amenities</CardTitle></CardHeader>
              <CardContent><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{amenitiesList.map((a) => (<div key={a} className="flex items-center space-x-2"><Checkbox id={a} checked={formData.amenities.includes(a)} onCheckedChange={(c) => handleAmenityChange(a, c as boolean)} /><Label htmlFor={a} className="text-sm">{a}</Label></div>))}</div></CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>6. Description</CardTitle>
                  <CardDescription>Describe your property, rules, and nearby facilities.</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAiModal(true)} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Generate with AI
                </Button>
              </CardHeader>
              <CardContent><Textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="A great description helps you find the right flatmate faster!" rows={6} required /></CardContent>
            </Card>

            <div className="flex flex-col items-center">
              {submitStatus === 'success' && <div className="mb-4 flex items-center gap-2 text-green-600"><PartyPopper className="h-5 w-5" /><span>Success! Your flat has been posted.</span></div>}
              {submitStatus === 'error' && <div className="mb-4 flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5" /><span>Oops! Something went wrong. Please try again.</span></div>}
              <Button type="submit" size="lg" className="btn-primary px-8 w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Post Flat
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostFlat;
