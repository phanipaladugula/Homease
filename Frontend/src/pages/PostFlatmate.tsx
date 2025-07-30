//added:-niharika
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Calendar } from 'lucide-react';

const PostFlatmate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    preferredAreas: '',
    moveInDate: '',
    duration: '',
    roomType: '',
    lifestyle: [] as string[],
    lookingFor: '',
    occupation: '',
    age: '',
    gender: ''
  });

  const lifestyleTags = [
    'Clean', 'Social', 'Quiet', 'Early Riser', 'Night Owl', 'Vegetarian', 
    'Pet Friendly', 'Non-Smoker', 'Studious', 'Fitness', 'Cooking'
  ];

  const toggleLifestyle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(tag)
        ? prev.lifestyle.filter(t => t !== tag)
        : [...prev.lifestyle, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Posting flatmate request:', formData);
    // Here you would submit to backend
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Users className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Find a Flatmate</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Request Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Looking for a clean flatmate in Koramangala"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Preferred Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter preferred area, city"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferredAreas">Alternative Areas</Label>
                  <Input
                    id="preferredAreas"
                    value={formData.preferredAreas}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredAreas: e.target.value }))}
                    placeholder="e.g., HSR Layout, BTM Layout"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budgetMin">Min Budget (₹)</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                      placeholder="10000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetMax">Max Budget (₹)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                      placeholder="25000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moveInDate">Move-in Date</Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      value={formData.moveInDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, moveInDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="long-term">Long Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="25"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                    placeholder="e.g., Software Engineer, Student"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="roomType">Room Preference</Label>
                  <Select value={formData.roomType} onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private Room</SelectItem>
                      <SelectItem value="shared">Shared Room</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lookingFor">Looking For</Label>
                  <Select value={formData.lookingFor} onValueChange={(value) => setFormData(prev => ({ ...prev, lookingFor: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="What are you looking for?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flatmate">Flatmate to share flat</SelectItem>
                      <SelectItem value="flat">Flat with existing flatmates</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about yourself, your habits, what you're looking for in a flatmate..."
                rows={4}
                required
              />
            </CardContent>
          </Card>

          {/* Lifestyle */}
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {lifestyleTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formData.lifestyle.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer justify-center py-2 hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                    onClick={() => toggleLifestyle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="btn-primary px-8">
              Post Flatmate Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFlatmate;
