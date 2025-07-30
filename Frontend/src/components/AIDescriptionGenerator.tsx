
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, User, Edit3 } from 'lucide-react';

interface AIDescriptionGeneratorProps {
  formData: any;
  onDescriptionChange: (description: string) => void;
  currentDescription: string;
}

const AIDescriptionGenerator = ({ formData, onDescriptionChange, currentDescription }: AIDescriptionGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const generateDescription = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation based on form data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const personalityTraits = formData.selectedHabits?.slice(0, 3) || ['Friendly', 'Organized', 'Studious'];
    const userType = formData.userType === 'student' ? 'student' : 'working professional';
    const intent = formData.intent?.includes('flatmate') ? 'looking for a compatible flatmate' : 'searching for the perfect flat';
    
    const generatedDescription = `Hi! I'm ${formData.name}, a ${formData.age}-year-old ${userType} ${formData.college ? `from ${formData.college}` : ''}. I'm currently ${intent} and believe in creating a harmonious living environment. 

My lifestyle can be described as ${personalityTraits.join(', ').toLowerCase()}, and I value mutual respect and open communication. I enjoy ${personalityTraits[0].toLowerCase()} activities and maintain a ${personalityTraits[1].toLowerCase()} living space. 

I'm looking for someone who shares similar values and is interested in building a positive flatmate relationship. Let's connect and see if we're a good match!`;
    
    onDescriptionChange(generatedDescription);
    setIsGenerating(false);
  };

  const handleManualEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Your Profile Description
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-primary mb-2">Based on your information:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{formData.userType}</Badge>
            <Badge variant="outline">{formData.age} years old</Badge>
            {formData.college && <Badge variant="outline">{formData.college}</Badge>}
            {formData.selectedHabits?.slice(0, 3).map((habit: string) => (
              <Badge key={habit} variant="outline">{habit}</Badge>
            ))}
          </div>
        </div>

        {currentDescription ? (
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={currentDescription}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  className="min-h-[150px] resize-none"
                  placeholder="Write your description here..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} size="sm" className="btn-primary">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white border border-primary/20 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{currentDescription}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleManualEdit} variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Manually
                  </Button>
                  <Button onClick={generateDescription} disabled={isGenerating} variant="outline" size="sm">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Let AI Create Your Perfect Description
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI will craft a personalized description based on all the information you've provided
              </p>
              <Button 
                onClick={generateDescription} 
                disabled={isGenerating}
                className="btn-primary"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIDescriptionGenerator;
