import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Shield, 
  Check, 
  GraduationCap, 
  Briefcase, 
  Home, 
  Users, 
  Calendar,
  Settings,
  Star,
  Upload,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

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

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [userData, setUserData] = useState<any>(null); // This will hold the displayed data
  const [formData, setFormData] = useState<any>(null); // This will be used for the edit form
  const [loading, setLoading] = useState(true);
//effect is working fine and with the backend part also
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Use "userProfile" which is set on signup/login
      const storedData = localStorage.getItem('userProfile');
      if (!storedData) {
        toast({ title: "Please log in to view your profile.", variant: "destructive" });
        navigate('/login');
        return;
      }
      
      const localUser = JSON.parse(storedData);

      try {
        // Fetch the LATEST profile data from the server using the email
        const response = await axios.get(`${API_URL}/profiles/email/${localUser.email}`);
        const freshProfile = response.data;
        
        setUserData(freshProfile);
        setFormData(freshProfile); // Initialize form data with fresh data
        localStorage.setItem('userProfile', JSON.stringify(freshProfile)); // Update localStorage

      } catch (error) {
        console.error("Failed to fetch full profile:", error);
        toast({ title: "Could not load profile", description: "Showing locally saved data. Some information may be outdated.", variant: "destructive" });
        // Fallback to local data if server fails
        setUserData(localUser);
        setFormData(localUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, toast]);

  const getIntentDisplay = () => {
    if (!userData || !userData.intent) return null;
    switch (userData.intent) {
      case 'looking-for-flat': return { text: 'Looking for a Flat', icon: <Home className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' };
      case 'looking-for-flatmate': return { text: 'Looking for a Flatmate', icon: <Users className="h-4 w-4" />, color: 'bg-green-100 text-green-800' };
      case 'have-flat-need-flatmate': return { text: 'Have Flat, Need Flatmate', icon: <Home className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' };
      default: return null;
    }
  };

  const handleSave = async () => {
    if (!formData?._id) {
        toast({ title: "Cannot save profile", description: "User ID is missing.", variant: "destructive" });
        return;
    }
    
    try {
        const response = await axios.put(`${API_URL}/profiles/${formData._id}`, formData);
        const updatedProfile = response.data.profile;
        
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        setUserData(updatedProfile); // Update the displayed data
        setFormData(updatedProfile); // Reset form state to the new data
        setIsEditing(false);
        toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
    } catch (error) {
        console.error("Profile update failed:", error);
        toast({ title: "Update Failed", description: "Could not save changes to the server.", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setFormData(userData); // Revert any changes in the form
    setIsEditing(false);
  }

  const handleVerifyPhone = () => {
    const phone = userData?.phone?.replace('+91', '') || '';
    navigate(`/phone-verification?return=/profile&phone=${phone}`);
  };
  
  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        setFormData((prev: any) => ({...prev, avatar: imageUrl, image: imageUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const intentDisplay = getIntentDisplay();

  if (loading || !userData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const isPhoneVerified = userData.verifications?.phone || false;
  const isEmailVerified = userData.verifications?.email || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-white/95">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 border-2">
                      <AvatarImage src={userData.avatar || userData.image || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback className="text-2xl">{userData.name ? userData.name.split(' ').map((n:string) => n[0]).join('') : 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 mb-1">{userData.name}</h1>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {userData.age && <Badge variant="outline">{userData.age} years</Badge>}
                        {isPhoneVerified && <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Phone Verified</Badge>}
                        {isEmailVerified && <Badge className="bg-blue-100 text-blue-800"><Check className="h-3 w-3 mr-1" />Email Verified</Badge>}
                      </div>
                      {intentDisplay && <Badge className={`${intentDisplay.color} px-3 py-1`}>{intentDisplay.icon}<span className="ml-2 font-medium">{intentDisplay.text}</span></Badge>}
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}>
                    {isEditing ? 'Cancel' : <><Edit className="h-4 w-4 mr-2" /> Edit Profile</>}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {isEditing && (
              <Card className="bg-white/95">
                <CardHeader><CardTitle>Update Profile Photo</CardTitle></CardHeader>
                <CardContent>
                  <ImageUpload onImageSelect={handleImageSelect} currentImage={formData.avatar} />
                </CardContent>
              </Card>
            )}

            {/* Personal Information */}
            <Card className="bg-white/95">
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                      <div><Label htmlFor="age">Age</Label><Input id="age" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} /></div>
                    </div>
                    <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} disabled /></div>
                    <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                    <div><Label htmlFor="location">Location</Label><Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-500" /><div><p className="text-sm font-medium">Name</p><p className="text-sm text-gray-600">{userData.name}</p></div></div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" /><div><p className="text-sm font-medium">Age</p><p className="text-sm text-gray-600">{userData.age}</p></div></div>
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /><div><p className="text-sm font-medium">Email</p><p className="text-sm text-gray-600">{userData.email}</p></div></div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /><div><p className="text-sm font-medium">Phone</p><p className="text-sm text-gray-600">{userData.phone || 'Not provided'}</p></div></div>
                    <div className="flex items-center gap-2 col-span-2"><MapPin className="h-4 w-4 text-gray-500" /><div><p className="text-sm font-medium">Location</p><p className="text-sm text-gray-600">{userData.location}</p></div></div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Education/Work/Business Card */}
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {userData.userType === 'student' ? <><GraduationCap className="h-5 w-5" /> Education</> :
                   userData.userType === 'professional' ? <><Briefcase className="h-5 w-5" /> Work</> :
                   <><Home className="h-5 w-5" /> Business Info</>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.userType === 'student' && <div className="space-y-2 text-sm text-gray-700"><p><strong>College:</strong> {userData.college}</p><p><strong>Course:</strong> {userData.course}</p><p><strong>Year:</strong> {userData.year}</p></div>}
                {userData.userType === 'professional' && <div className="space-y-2 text-sm text-gray-700"><p><strong>Company:</strong> {userData.company}</p><p><strong>Job Title:</strong> {userData.jobTitle}</p><p><strong>Location:</strong> {userData.workLocation}</p></div>}
                {(userData.userType === 'owner' || userData.userType === 'broker') && <div className="space-y-2 text-sm text-gray-700"><p><strong>Business Name:</strong> {userData.businessName}</p><p><strong>Type:</strong> {userData.businessType}</p><p><strong>Experience:</strong> {userData.experience}</p></div>}
              </CardContent>
            </Card>

            {/* Housing/Property Card */}
            {(userData.userType === 'student' || userData.userType === 'professional') ? (
              <Card className="bg-white/95">
                <CardHeader><CardTitle>Housing Preferences</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><p className="font-medium">Budget</p><p>{userData.budget}</p></div>
                  <div><p className="font-medium">Location</p><p>{userData.preferredLocation}</p></div>
                  <div><p className="font-medium">Room Type</p><p>{userData.roomType}</p></div>
                  <div><p className="font-medium">Move-in Date</p><p>{userData.moveInDate}</p></div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/95">
                <CardHeader><CardTitle>Property Information</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                    <p><strong>Property Types:</strong> {userData.propertyTypes?.join(', ')}</p>
                    <p><strong>Listing Locations:</strong> {userData.listingLocations}</p>
                </CardContent>
              </Card>
            )}

            {/* Description Card */}
            <Card className="bg-white/95">
              <CardHeader><CardTitle>About Me / Description</CardTitle></CardHeader>
              <CardContent>
                {isEditing ? <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5}/> : <p className="text-gray-600 leading-relaxed">{userData.description}</p>}
              </CardContent>
            </Card>

            {/* Lifestyle cards for students/professionals */}
            {(userData.userType === 'student' || userData.userType === 'professional') && (
              <>
                <Card className="bg-white/95">
                  <CardHeader><CardTitle>Lifestyle & Habits</CardTitle></CardHeader>
                  <CardContent><div className="flex flex-wrap gap-2">{userData.habits?.map((habit: string) => (<Badge key={habit} variant="outline">{habit}</Badge>))}</div></CardContent>
                </Card>
                <Card className="bg-white/95">
                  <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><h4 className="font-medium mb-2">Desired Amenities</h4><div className="flex flex-wrap gap-2">{userData.amenities?.map((amenity: string) => (<Badge key={amenity} variant="secondary">{amenity}</Badge>))}</div></div>
                    <div><h4 className="font-medium mb-2">Restrictions</h4><div className="flex flex-wrap gap-2">{userData.restrictions?.map((restriction: string) => (<Badge key={restriction} variant="destructive">{restriction}</Badge>))}</div></div>
                  </CardContent>
                </Card>
              </>
            )}

          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/95">
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Verification Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>Phone</span></div>
                  {isPhoneVerified ? <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Verified</Badge> : <Button size="sm" variant="outline" onClick={handleVerifyPhone}>Verify Now</Button>}
                </div>
                {/* Add email verification similarly */}
              </CardContent>
            </Card>
            
            {isEditing && <Button onClick={handleSave} className="w-full bg-primary text-white">Save Changes</Button>}

            {/* <Card className="bg-white/95">
              <CardHeader><CardTitle>Profile Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => navigate('/home')}><Users className="h-4 w-4 mr-2" />Find Matches</Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/settings')}><Settings className="h-4 w-4 mr-2" />Settings</Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
