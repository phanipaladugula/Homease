
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RatingScale from '@/components/RatingScale';

const PersonalityTest = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});
//added:- niharika
  const questions = [
    "I prefer staying in rather than going out to social events",
    "I enjoy having detailed plans for my day and week",
    "I feel comfortable living in a slightly messy environment",
    "I like to have background music or TV on while studying",
    "I'm comfortable sharing personal items with flatmates",
    "I prefer to handle conflicts directly rather than avoiding them",
    "I enjoy cooking and would like to share meals with flatmates",
    "I'm okay with guests coming over frequently",
    "I like to keep common areas very clean and organized",
    "I prefer having quiet time in the evening",
    "I'm comfortable with splitting expenses equally regardless of usage",
    "I enjoy having deep conversations with flatmates",
    "I prefer to have my own space and privacy most of the time",
    "I'm flexible about house rules and routines",
    "I like to plan group activities with my flatmates",
    "I'm comfortable with different sleep schedules in the house"
  ];

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const completedQuestions = Object.keys(answers).length;
  const progress = (completedQuestions / questions.length) * 100;

  const handleSubmit = () => {
    console.log('Personality test completed:', answers);
    navigate('/home');
  };

  const isCompleted = completedQuestions === questions.length;

  return (
    <div className="min-h-screen hero-gradient py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Personality Assessment</span>
            </div>
            <CardTitle className="text-xl">
              Complete Your Compatibility Profile
            </CardTitle>
            <CardDescription>
              Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)
            </CardDescription>
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{completedQuestions} of {questions.length} completed</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Questions */}
        <div className="space-y-4 mb-8">
          {questions.map((question, index) => (
            <div
              key={index}
              className={`animate-fade-in ${answers[index] ? 'opacity-100' : 'opacity-90'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RatingScale
                questionId={`q${index}`}
                question={`${index + 1}. ${question}`}
                value={answers[index] || null}
                onChange={(value) => handleAnswerChange(index, value)}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Card className="sticky bottom-4 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isCompleted && (
                  <CheckCircle className="h-5 w-5 text-accent-gold" />
                )}
                <span className="text-sm font-medium">
                  {isCompleted ? 'All questions completed!' : `${questions.length - completedQuestions} questions remaining`}
                </span>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!isCompleted}
                className="btn-primary group transition-all duration-200 hover:scale-105"
              >
                Complete Assessment
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalityTest;
