
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, IndianRupee, Calendar, Users, Home, Heart, Shield, Check, Eye, Phone, Mail, AlertCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

const FlatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('phoneVerified') === 'true';
    setIsPhoneVerified(verified);
  }, []);

  // Sample flat data - in real app, this would come from API
  const flat = {
    id: id || '1',
    title: 'Spacious 2BHK Near Metro Station',
    rent: '₹25,000',
    deposit: '₹50,000',
    location: 'Lajpat Nagar, New Delhi',
    type: '2BHK',
    furnished: 'Semi-Furnished',
    availableFrom: 'January 2025',
    ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 9876543210',
    ownerEmail: 'rajesh.kumar@gmail.com',
    description: `Beautiful 2BHK apartment available for rent in prime location of Lajpat Nagar. The flat is semi-furnished and well-maintained with excellent connectivity to metro station and major commercial areas.

Features:
- 2 spacious bedrooms with attached bathrooms
- Modern kitchen with all necessary fittings
- Balcony with garden view
- 24/7 water and power backup
- Secure parking space
- Nearby schools, hospitals, and shopping centers

Ideal for small families or working professionals. No brokerage charges.`,
    amenities: ['24/7 Security', 'Parking', 'Lift', 'Power Backup', 'Water Supply', 'Garden'],
    images: ['/placeholder.svg'],
    nearbyFacilities: ['Metro Station (500m)', 'Hospital (1km)', 'Mall (2km)', 'School (800m)'],
    restrictions: ['No Smoking', 'No Pets', 'Family Preferred'],
    isVerified: true
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleContactView = () => {
    if (isPhoneVerified) {
      setShowContact(true);
    } else {
      navigate('/phone-verification?return=/flat/' + id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-primary/10 text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              className={isSaved ? 'bg-primary/10 text-primary border-primary/20' : 'border-primary/20 text-primary hover:bg-primary/5'}
            >
              {isSaved ? (
                <>
                  <Heart className="h-4 w-4 mr-2 fill-primary" />
                  Saved
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleContactView}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isPhoneVerified ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View Contact
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify to View Contact
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flat Header */}
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{flat.title}</h1>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Home className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                      {flat.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{flat.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{flat.rent}</div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Type</p>
                      <p className="text-sm text-gray-600">{flat.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Deposit</p>
                      <p className="text-sm text-gray-600">{flat.deposit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Available From</p>
                      <p className="text-sm text-gray-600">{flat.availableFrom}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Furnished</p>
                    <p className="text-sm text-gray-600">{flat.furnished}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {flat.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {flat.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Facilities */}
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Nearby Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {flat.nearbyFacilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm text-gray-600">{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Owner Contact */}
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Shield className="h-5 w-5 text-primary" />
                  Owner Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {flat.ownerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{flat.ownerName}</p>
                    <p className="text-sm text-gray-600">Property Owner</p>
                  </div>
                </div>

                {!isPhoneVerified ? (
                  <div className="text-center py-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-amber-700 font-medium">Verification Required</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Verify your phone to view owner contact
                      </p>
                    </div>
                    <Button 
                      onClick={handleContactView}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Phone
                    </Button>
                  </div>
                ) : showContact ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Phone</p>
                        <p className="text-sm text-gray-600">{flat.ownerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Email</p>
                        <p className="text-sm text-gray-600">{flat.ownerEmail}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Lock className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Contact details are protected</p>
                    <Button 
                      onClick={handleContactView}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Contact
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Restrictions */}
            <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Restrictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {flat.restrictions.map((restriction, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-600">{restriction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatDetail;
