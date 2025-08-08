
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Users, MapPin, Shield, Award, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState(0);
  
  const scrollingTexts = [
    { word: "vibe", gradient: "from-primary via-beige-accent to-primary" },
    { word: "flat", gradient: "from-beige-accent via-primary to-beige-accent" },
    { word: "flatmate", gradient: "from-primary via-beige-accent to-primary" },
    { word: "home", gradient: "from-beige-accent via-primary to-beige-accent" }
  ];
//added :- niharika
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % scrollingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPhrase = scrollingTexts[currentText];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 pointer-events-none" />
      
      {/* Header */}
      <header className="px-6 py-6 animate-fade-in relative z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-lg border border-primary/20">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
              Homease
            </span>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')} 
              className="hover:bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm transition-all duration-300"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              className="bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-glow"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Animated Heading */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-800 block mb-4">
                Find your perfect{' '}
              </span>
              <span 
                key={currentText}
                className={`
                  inline-block font-extrabold text-5xl md:text-6xl lg:text-7xl
                  bg-gradient-to-r ${currentPhrase.gradient} bg-clip-text text-transparent
                  animate-word-morph
                `}
                style={{
                  backgroundImage: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--beige-accent)), hsl(var(--primary)))`
                }}
              >
                {currentPhrase.word}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in bg-white/70 rounded-xl p-6 border border-primary/20 shadow-lg backdrop-blur-sm" 
               style={{ animationDelay: '0.4s' }}>
              The trusted platform for students and young professionals to discover 
              compatible roommates and perfect living spaces with smart matching and verified profiles.
            </p>
          </div>

          {/* Enhanced CTA Section */}
          <div className="animate-fade-in space-y-6" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 px-12 py-6 rounded-2xl animate-pulse-glow"
              onClick={() => navigate('/signup')}
            >
              <Star className="mr-3 h-6 w-6" />
              Start Your Journey
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 bg-white/50 rounded-full px-8 py-4 border border-primary/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span>100+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-primary" />
                <span>97% Success Rate</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group animate-fade-in" 
                 style={{ animationDelay: '0.8s' }}>
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-14 w-14 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with verified roommates through our advanced compatibility algorithm that matches lifestyle, preferences, and personality traits.
              </p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group animate-fade-in" 
                 style={{ animationDelay: '1.0s' }}>
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-14 w-14 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Verified Profiles</h3>
              <p className="text-gray-600 leading-relaxed">
                All users go through phone verification and identity checks to ensure authentic connections and safe interactions.
              </p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group animate-fade-in" 
                 style={{ animationDelay: '1.2s' }}>
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-14 w-14 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Prime Locations</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover flats near colleges, tech hubs, and metro stations with detailed neighborhood information and amenities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-6 animate-fade-in relative z-10" style={{ animationDelay: '1.4s' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Trusted by Students & Professionals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-all duration-300 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl">
              <div className="text-5xl font-bold text-primary group-hover:text-primary/80 transition-colors mb-2">100+</div>
              <div className="text-gray-600 font-medium">Verified Users</div>
            </div>
            <div className="group hover:scale-110 transition-all duration-300 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl">
              <div className="text-5xl font-bold text-primary group-hover:text-primary/80 transition-colors mb-2">40+</div>
              <div className="text-gray-600 font-medium">Properties Listed</div>
            </div>
            <div className="group hover:scale-110 transition-all duration-300 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl">
              <div className="text-5xl font-bold text-primary group-hover:text-primary/80 transition-colors mb-2">30+</div>
              <div className="text-gray-600 font-medium">Successful Matches</div>
            </div>
            <div className="group hover:scale-110 transition-all duration-300 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl">
              <div className="text-5xl font-bold text-primary group-hover:text-primary/80 transition-colors mb-2">97%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-primary/20 bg-white/90 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-gray-800">Homease</span>
              </div>
              <p className="text-gray-600 text-sm">
                Connecting students and professionals to their perfect living spaces since 2025.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Platform</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Find Flatmates</p>
                <p>List Property</p>
                <p>Personality Test</p>
                <p>Verification</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Support</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Help Center</p>
                <p>Safety Guidelines</p>
                <p>Contact Us</p>
                <p>Community</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Company</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>About Us</p>
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
                <p>Careers</p>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-600 text-sm pt-8 border-t border-primary/20">
            <p>&copy; 2025 Homease. All rights reserved. Find your perfect living situation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
