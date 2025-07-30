
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    purpose: string;
    budgetRange: [number, number];
    gender: string;
    ageRange: [number, number];
    selectedTags: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }: FilterSidebarProps) => {
  const filterTags = [
    'Clean', 'Social', 'Quiet', 'Early Riser', 'Night Owl', 'Vegetarian', 
    'Pet Friendly', 'Non-Smoker', 'Studious', 'Fitness', 'Cooking'
  ];

  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const resetFilters = () => {
    onFiltersChange({
      purpose: 'all',
      budgetRange: [5000, 50000],
      gender: 'any',
      ageRange: [18, 35],
      selectedTags: []
    });
  };

  const handleBudgetChange = (value: number[]) => {
    onFiltersChange({ ...filters, budgetRange: [value[0], value[1]] as [number, number] });
  };

  const handleAgeChange = (value: number[]) => {
    onFiltersChange({ ...filters, ageRange: [value[0], value[1]] as [number, number] });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-50 transform transition-transform duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:z-auto`}>
        <Card className="h-full rounded-none border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Purpose Filter */}
            <div>
              <label className="text-sm font-medium mb-3 block">Looking for</label>
              <Select 
                value={filters.purpose} 
                onValueChange={(value) => onFiltersChange({...filters, purpose: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="flatmate">Flatmates</SelectItem>
                  <SelectItem value="flat">Flats</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Budget Range: ₹{filters.budgetRange[0].toLocaleString()} - ₹{filters.budgetRange[1].toLocaleString()}
              </label>
              <div className="px-2">
                <Slider
                  value={filters.budgetRange}
                  onValueChange={handleBudgetChange}
                  max={100000}
                  min={5000}
                  step={1000}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-2">
                <span>₹5,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-sm font-medium mb-3 block">Gender</label>
              <Select 
                value={filters.gender} 
                onValueChange={(value) => onFiltersChange({...filters, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
              </label>
              <div className="px-2">
                <Slider
                  value={filters.ageRange}
                  onValueChange={handleAgeChange}
                  max={50}
                  min={18}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-2">
                <span>18</span>
                <span>50</span>
              </div>
            </div>

            {/* Lifestyle Tags */}
            <div>
              <label className="text-sm font-medium mb-3 block">Lifestyle</label>
              <div className="grid grid-cols-2 gap-2">
                {filterTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer justify-center py-2 hover:bg-primary/10 transition-all duration-200"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FilterSidebar;
