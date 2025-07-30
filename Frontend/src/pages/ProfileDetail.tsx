import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Phone, Mail, GraduationCap, Briefcase, Home, Heart, Star, Clock, Shield, Check, Eye, IndianRupee, Calendar, Users, AlertCircle, Lock, Building, BedDouble, Bath } from 'lucide-react';
// Edited on 30 July by Nisha
const API_URL = 'http://localhost:5001/api';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showContact, setShowContact] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false); 

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) {
        setError("No profile ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/profiles/${id}`);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setError("Could not load profile. It may not exist or the server may be down.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    
    // Check the current user's verification status from localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
        const currentUser = JSON.parse(storedProfile);
        setIsPhoneVerified(currentUser.verifications?.phone === true);
    }

  }, [id]);

  const handleContactView = () => {
    if (isPhoneVerified) {
      setShowContact(true);
    } else {
      // Redirect to verification, passing the current page as the return URL
      navigate(`/phone-verification?return=/flatmate/${id}`);
    }
  };
  
  const getIntentDisplay = () => {
    if (!profile) return { text: '', icon: null, color: 'bg-gray-100' };
    switch (profile.intent) {
      case 'looking-for-flat': return { text: 'Looking for a Flat', icon: <Home className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'looking-for-flatmate': return { text: 'Looking for a Flatmate', icon: <Users className="h-5 w-5" />, color: 'bg-green-100 text-green-800 border-green-200' };
      case 'have-flat-need-flatmate': return { text: 'Have Flat, Need Flatmate', icon: <Home className="h-5 w-5" />, color: 'bg-purple-100 text-purple-800 border-purple-200' };
      default: return { text: 'Available', icon: <Star className="h-5 w-5" />, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  
  if (!profile) {
      return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>;
  }

  const intentDisplay = getIntentDisplay();
  const isFlatListing = profile.type === 'flat';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 hover:bg-primary/10 text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Results
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleContactView} className="bg-primary hover:bg-primary/90 text-white">
              {isPhoneVerified ? <><Eye className="h-4 w-4 mr-2" />View Contact</> : <><Shield className="h-4 w-4 mr-2" />Verify to View</>}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-24 h-24 border-2 border-primary/20">
                    {/* --- THIS IS THE FIX --- */}
                    <AvatarImage src={profile.avatar || profile.image || '/placeholder.svg'} alt={profile.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">{profile.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                    {isFlatListing ? (
                        <div className="flex items-center gap-4 text-sm text-gray-600 my-2">
                            <div className="flex items-center gap-1"><Building className="h-4 w-4" /><span>{profile.flatType}</span></div>
                            <div className="flex items-center gap-1"><BedDouble className="h-4 w-4" /><span>{profile.furnishing}</span></div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 my-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{profile.age} years</Badge>
                            {profile.verifications?.phone && <Badge className="bg-green-100 text-green-800 border-green-200"><Check className="h-3 w-3 mr-1" />Verified</Badge>}
                        </div>
                    )}
                    {!isFlatListing && <div className="mb-3"><Badge className={`${intentDisplay.color} px-3 py-1`}>{intentDisplay.icon}<span className="ml-2 font-medium">{intentDisplay.text}</span></Badge></div>}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2"><MapPin className="h-4 w-4" /><span>{profile.location}</span></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-primary" /><div><p className="text-sm font-medium text-gray-800">Rent/Budget</p><p className="text-sm text-gray-600">{profile.budget}</p></div></div>
                  {!isFlatListing && <div className="flex items-center gap-2"><Home className="h-4 w-4 text-primary" /><div><p className="text-sm font-medium text-gray-800">Room Type</p><p className="text-sm text-gray-600">{profile.roomType}</p></div></div>}
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><div><p className="text-sm font-medium text-gray-800">Available From</p><p className="text-sm text-gray-600">{profile.moveInDate}</p></div></div>
                  {!isFlatListing && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><div><p className="text-sm font-medium text-gray-800">Stay Duration</p><p className="text-sm text-gray-600">{profile.stayDuration}</p></div></div>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardHeader><CardTitle className="text-gray-800">Description</CardTitle></CardHeader>
                <CardContent><p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile.description}</p></CardContent>
            </Card>

            {!isFlatListing && (
                <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
                    <CardHeader><CardTitle className="text-gray-800">Lifestyle & Habits</CardTitle></CardHeader>
                    <CardContent><div className="flex flex-wrap gap-2">{profile.habits?.map((habit: string) => (<Badge key={habit} variant="outline" className="bg-primary/5 text-primary border-primary/20">{habit}</Badge>))}</div></CardContent>
                </Card>
            )}

            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardHeader><CardTitle className="text-gray-800">{isFlatListing ? 'Amenities' : 'Housing Preferences'}</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div><h4 className="font-medium text-gray-800 mb-3">{isFlatListing ? 'What this place offers' : 'Desired Amenities'}</h4><div className="flex flex-wrap gap-2">{profile.amenities?.map((amenity: string) => (<Badge key={amenity} variant="outline" className="bg-green-50 text-green-700 border-green-200">{amenity}</Badge>))}</div></div>
                        {!isFlatListing && <div><h4 className="font-medium text-gray-800 mb-3">Restrictions</h4><div className="flex flex-wrap gap-2">{profile.restrictions?.map((restriction: string) => (<Badge key={restriction} variant="outline" className="bg-red-50 text-red-700 border-red-200">{restriction}</Badge>))}</div></div>}
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader><CardTitle className="flex items-center gap-2 text-gray-800"><Shield className="h-5 w-5 text-primary" />Contact Information</CardTitle></CardHeader>
              <CardContent>
                {!isPhoneVerified ? (
                  <div className="text-center py-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"><AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" /><p className="text-amber-700 font-medium">Verification Required</p><p className="text-sm text-amber-600 mt-1">You must verify your phone number to view contact details</p></div>
                    <Button onClick={handleContactView} className="bg-primary hover:bg-primary/90 text-white"><Shield className="h-4 w-4 mr-2" />Verify Phone Number</Button>
                  </div>
                ) : showContact ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-gray-500" /><div><p className="text-sm font-medium text-gray-800">Phone</p><p className="text-sm text-gray-600">{profile.phone || 'Not available'}</p></div></div>
                    <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-gray-500" /><div><p className="text-sm font-medium text-gray-800">Email</p><p className="text-sm text-gray-600">{profile.email}</p></div></div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Lock className="h-8 w-8 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Contact details are protected</p>
                    <Button onClick={handleContactView} className="bg-primary hover:bg-primary/90 text-white"><Eye className="h-4 w-4 mr-2" />View Contact Details</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {!isFlatListing && (
                <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
                    <CardHeader><CardTitle className="text-gray-800">Verification Status</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                        {Object.entries(profile.verifications || {}).map(([key, value]) => (
                            <div className="flex items-center justify-between" key={key}>
                                <div className="flex items-center gap-2"><span className="capitalize text-sm text-gray-600">{key}</span></div>
                                {value ? <Badge className="bg-green-100 text-green-800 border-green-200"><Check className="h-3 w-3 mr-1" />Verified</Badge> : <Badge variant="outline" className="text-gray-500">Pending</Badge>}
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardHeader><CardTitle className="text-gray-800">Quick Actions</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5"><Shield className="h-4 w-4 mr-2" />Report Profile</Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
