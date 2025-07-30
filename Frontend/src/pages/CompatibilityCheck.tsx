
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Heart, Check, X, User, Home, Calendar, Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

const CompatibilityCheck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);
  const [compatibility, setCompatibility] = useState(null);

  useEffect(() => {
    // Load user data
    const signupData = localStorage.getItem('userSignupData');
    if (signupData) {
      setUserData(JSON.parse(signupData));
    }

    // Mock target profile data
    const mockProfile = {
      id: id || '1',
      name: 'Priya Mehta',
      age: 23,
      userType: 'student',
      habits: ['Early Riser', 'Clean', 'Organized', 'Vegetarian', 'Non-Smoker', 'Studious'],
      budget: '₹12,000 - ₹18,000',
      location: 'Okhla, New Delhi',
      moveInDate: 'January 2025',
      stayDuration: '1-2 years'
    };
    setTargetProfile(mockProfile);

    // Calculate compatibility
    calculateCompatibility(userData, mockProfile);
  }, [id]);

  const calculateCompatibility = (user, target) => {
    if (!user || !target) return;

    const userHabits = user.selectedHabits || [];
    const targetHabits = target.habits || [];
    
    // Calculate habit compatibility
    const commonHabits = userHabits.filter(habit => targetHabits.includes(habit));
    const habitScore = Math.round((commonHabits.length / Math.max(userHabits.length, targetHabits.length)) * 100);

    // Calculate budget compatibility
    const budgetScore = 85; // Mock calculation

    // Calculate location compatibility
    const locationScore = 75; // Mock calculation

    // Calculate lifestyle compatibility
    const lifestyleScore = 90; // Mock calculation

    const overallScore = Math.round((habitScore + budgetScore + locationScore + lifestyleScore) / 4);

    setCompatibility({
      overall: overallScore,
      habits: habitScore,
      budget: budgetScore,
      location: locationScore,
      lifestyle: lifestyleScore,
      commonHabits,
      strengths: [
        'Both prefer clean living spaces',
        'Similar study/work schedules',
        'Compatible dietary preferences',
        'Similar age group'
      ],
      challenges: [
        'Different preferred move-in dates',
        'Slightly different budget ranges'
      ]
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  if (!compatibility || !targetProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Calculating compatibility...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-primary/10 text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Compatibility Check</h1>
          </div>
        </div>

        {/* Overall Compatibility */}
        <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">
              Compatibility with {targetProfile.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold ${getScoreColor(compatibility.overall)} mb-2`}>
                {compatibility.overall}%
              </div>
              <div className="text-xl font-semibold text-gray-700">
                {getScoreLabel(compatibility.overall)} Match
              </div>
            </div>
            
            <Progress value={compatibility.overall} className="h-3 mb-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(compatibility.habits)}`}>
                  {compatibility.habits}%
                </div>
                <div className="text-sm text-gray-600">Habits</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(compatibility.budget)}`}>
                  {compatibility.budget}%
                </div>
                <div className="text-sm text-gray-600">Budget</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(compatibility.location)}`}>
                  {compatibility.location}%
                </div>
                <div className="text-sm text-gray-600">Location</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(compatibility.lifestyle)}`}>
                  {compatibility.lifestyle}%
                </div>
                <div className="text-sm text-gray-600">Lifestyle</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Common Habits */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Check className="h-5 w-5 text-green-600" />
                Common Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compatibility.commonHabits.length > 0 ? (
                  compatibility.commonHabits.map((habit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {habit}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No common habits found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compatibility Strengths */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Heart className="h-5 w-5 text-green-600" />
                Compatibility Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compatibility.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-sm text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Potential Challenges */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <X className="h-5 w-5 text-amber-600" />
                Potential Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compatibility.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-gray-700">{challenge}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Comparison */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Users className="h-5 w-5 text-primary" />
                Profile Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">You</p>
                    <div className="space-y-1 text-gray-600">
                      <p>Age: {userData?.age || 'N/A'}</p>
                      <p>Budget: {userData?.budget || 'N/A'}</p>
                      <p>Location: {userData?.preferredLocation || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{targetProfile.name}</p>
                    <div className="space-y-1 text-gray-600">
                      <p>Age: {targetProfile.age}</p>
                      <p>Budget: {targetProfile.budget}</p>
                      <p>Location: {targetProfile.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <Button 
            onClick={() => navigate(`/flatmate/${id}`)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <User className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>
          <Button 
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <Heart className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityCheck;
