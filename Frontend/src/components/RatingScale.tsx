
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface RatingScaleProps {
  questionId: string;
  question: string;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const RatingScale = ({ questionId, question, value, onChange, disabled = false }: RatingScaleProps) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const labels = [
    'Strongly Disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly Agree'
  ];

  const getButtonClass = (rating: number) => {
    const isSelected = value === rating;
    const isHovered = hoveredValue === rating;
    
    let baseClass = "h-12 w-12 rounded-full border-2 transition-all duration-200 hover:scale-110 ";
    
    if (isSelected) {
      baseClass += "bg-primary text-primary-foreground border-primary shadow-lg scale-110";
    } else if (isHovered) {
      baseClass += "bg-primary/20 border-primary/60 scale-105";
    } else {
      baseClass += "bg-background border-border hover:border-primary/40";
    }
    
    return baseClass;
  };

  return (
    <div className="space-y-4 p-6 border border-border rounded-xl bg-card transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-medium leading-relaxed">{question}</h3>
      
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant="ghost"
              size="sm"
              className={getButtonClass(rating)}
              onClick={() => onChange(rating)}
              onMouseEnter={() => setHoveredValue(rating)}
              onMouseLeave={() => setHoveredValue(null)}
              disabled={disabled}
            >
              {rating}
            </Button>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground min-w-[120px] text-right">
          {hoveredValue ? labels[hoveredValue - 1] : value ? labels[value - 1] : 'Select rating'}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Strongly Disagree</span>
        <span>Strongly Agree</span>
      </div>
    </div>
  );
};

export default RatingScale;
