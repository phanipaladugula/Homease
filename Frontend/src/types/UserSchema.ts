
// User Schema for future backend implementation
export interface UserSchema {
  // Basic Information
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  profileImage?: string;
  
  // Account Status
  isActive: boolean;
  isVerified: {
    phone: boolean;
    email: boolean;
    identity: boolean;
    college: boolean;
  };
  
  // User Type & Intent
  userType: 'student' | 'professional' | 'owner';
  intent: 'looking-for-flat' | 'looking-for-flatmate' | 'have-flat-need-flatmate';
  
  // Education (for students)
  education?: {
    college: string;
    course: string;
    year: string;
    graduationYear?: number;
  };
  
  // Work (for professionals)
  work?: {
    company: string;
    jobTitle: string;
    workLocation: string;
    experience: number;
    salary?: string;
  };
  
  // Housing Preferences
  housing: {
    budget: string;
    preferredLocation: string;
    roomType: 'single' | 'shared' | 'studio' | '1bhk' | '2bhk' | '3bhk';
    moveInDate: string;
    stayDuration: string;
    amenities: string[];
    restrictions: string[];
  };
  
  // Lifestyle & Habits
  lifestyle: {
    selectedHabits: string[];
    sleepSchedule: 'early' | 'night' | 'flexible';
    smokingPreference: 'non-smoker' | 'smoker' | 'occasional';
    drinkingPreference: 'non-drinker' | 'social' | 'regular';
    petPreference: 'pet-friendly' | 'no-pets' | 'have-pets';
    dietaryPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'jain';
  };
  
  // Profile Details
  description: string;
  profileVisibility: boolean;
  showContactInfo: boolean;
  
  // Notification Settings
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    matches: boolean;
    messages: boolean;
    marketing: boolean;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  
  // Interactions
  savedProfiles: string[];
  blockedUsers: string[];
  reportedUsers: string[];
  
  // Matching Data
  matches: string[];
  compatibility: {
    [userId: string]: {
      score: number;
      lastCalculated: Date;
      factors: {
        habits: number;
        budget: number;
        location: number;
        lifestyle: number;
      };
    };
  };
  
  // Privacy Settings
  privacy: {
    showAge: boolean;
    showLocation: boolean;
    showEducation: boolean;
    showWork: boolean;
    allowMessages: boolean;
    allowProfileViews: boolean;
  };
}

// Flat Schema for listings
export interface FlatSchema {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  
  // Basic Details
  type: '1bhk' | '2bhk' | '3bhk' | 'studio' | 'pg';
  rent: number;
  deposit: number;
  location: {
    area: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Property Details
  furnished: 'fully' | 'semi' | 'unfurnished';
  availableFrom: Date;
  availableUntil?: Date;
  amenities: string[];
  restrictions: string[];
  
  // Images and Media
  images: string[];
  virtualTour?: string;
  
  // Verification & Status
  isVerified: boolean;
  isActive: boolean;
  isAvailable: boolean;
  
  // Nearby Facilities
  nearbyFacilities: Array<{
    name: string;
    type: 'metro' | 'bus' | 'hospital' | 'school' | 'mall' | 'restaurant' | 'gym';
    distance: number;
    walkingTime: number;
  }>;
  
  // Contact & Preferences
  contactInfo: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  
  tenantPreferences: {
    gender: 'male' | 'female' | 'any';
    occupation: 'student' | 'professional' | 'any';
    ageRange: {
      min: number;
      max: number;
    };
    lifestyle: string[];
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Interactions
  views: number;
  saved: number;
  inquiries: string[];
}

// Compatibility Calculation Interface
export interface CompatibilityScore {
  userId1: string;
  userId2: string;
  overall: number;
  factors: {
    habits: number;
    budget: number;
    location: number;
    lifestyle: number;
    schedule: number;
    preferences: number;
  };
  commonFactors: string[];
  challenges: string[];
  strengths: string[];
  calculatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search & Filter Types
export interface SearchFilters {
  location?: string;
  budget?: {
    min: number;
    max: number;
  };
  roomType?: string[];
  amenities?: string[];
  userType?: string[];
  age?: {
    min: number;
    max: number;
  };
  habits?: string[];
  moveInDate?: {
    from: Date;
    to: Date;
  };
  verified?: boolean;
}

export interface SearchResult {
  users: UserSchema[];
  flats: FlatSchema[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
