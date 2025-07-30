import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search, Filter, MapPin, Home as HomeIcon,
  Heart, PlusCircle, User, X // Added X icon import
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Configuration ---
const API_URL = 'http://localhost:5001/api';

// --- Fully Functional FilterSidebar Component ---
const FilterSidebar = ({ filters, onFiltersChange, onClose }: { filters: any, onFiltersChange: (newFilters: any) => void, onClose: () => void }) => {

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleTagToggle = (key: string, tag: string) => {
    const currentTags = filters[key] || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    handleFilterChange(key, newTags);
  };

  const allTags = ["Clean", "Early Riser", "Vegetarian", "Pet Friendly", "Night Owl", "Cooking", "Social", "Fitness", "Studious", "Quiet", "Non-Smoker"];
  const allAmenities = ["WiFi", "AC", "Furnished", "Parking", "Gym", "TV"];

  return (
    <div className="h-full overflow-y-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-8">
        {/* Purpose Filter */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Looking For</h3>
          <div className="flex space-x-2">
            {['all', 'flatmate', 'flat'].map(purpose => (
              <Button key={purpose} variant={filters.purpose === purpose ? 'default' : 'outline'} size="sm" onClick={() => handleFilterChange('purpose', purpose)} className="capitalize flex-1">{purpose}</Button>
            ))}
          </div>
        </div>

        {/* User Type Filter */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">User Type</h3>
          <div className="flex space-x-2">
            {['any', 'student', 'professional'].map(type => (
              <Button key={type} variant={filters.userType === type ? 'default' : 'outline'} size="sm" onClick={() => handleFilterChange('userType', type)} className="capitalize flex-1">{type}</Button>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Gender</h3>
          <div className="flex space-x-2">
            {['any', 'male', 'female'].map(gender => (
              <Button key={gender} variant={filters.gender === gender ? 'default' : 'outline'} size="sm" onClick={() => handleFilterChange('gender', gender)} className="capitalize flex-1">{gender}</Button>
            ))}
          </div>
        </div>

        {/* Room Type Filter */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Room Type</h3>
          <div className="flex space-x-2">
            {['any', 'Private Room', 'Shared Room'].map(type => (
              <Button key={type} variant={filters.roomType === type ? 'default' : 'outline'} size="sm" onClick={() => handleFilterChange('roomType', type)} className="capitalize flex-1">{type}</Button>
            ))}
          </div>
        </div>

        {/* Budget & Age Filters */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Budget Range (₹)</h3>
          <div className="flex items-center space-x-2"><Input type="number" placeholder="Min" value={filters.budgetRange[0]} onChange={(e) => handleFilterChange('budgetRange', [Number(e.target.value), filters.budgetRange[1]])} /><span className="text-muted-foreground">-</span><Input type="number" placeholder="Max" value={filters.budgetRange[1]} onChange={(e) => handleFilterChange('budgetRange', [filters.budgetRange[0], Number(e.target.value)])} /></div>
        </div>
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Age Range</h3>
          <div className="flex items-center space-x-2"><Input type="number" placeholder="Min" value={filters.ageRange[0]} onChange={(e) => handleFilterChange('ageRange', [Number(e.target.value), filters.ageRange[1]])} /><span className="text-muted-foreground">-</span><Input type="number" placeholder="Max" value={filters.ageRange[1]} onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], Number(e.target.value)])} /></div>
        </div>

        {/* Amenities Filter */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map(amenity => (
              <Badge key={amenity} variant={filters.selectedAmenities.includes(amenity) ? 'default' : 'secondary'} onClick={() => handleTagToggle('selectedAmenities', amenity)} className="cursor-pointer px-3 py-1">{amenity}</Badge>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Habits & Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge key={tag} variant={filters.selectedTags.includes(tag) ? 'default' : 'secondary'} onClick={() => handleTagToggle('selectedTags', tag)} className="cursor-pointer px-3 py-1">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const Home = () => {
  const navigate = useNavigate();

  // --- State Management ---
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    purpose: 'all',
    userType: 'any',
    roomType: 'any',
    budgetRange: [0, 100000] as [number, number],
    gender: 'any',
    ageRange: [18, 60] as [number, number],
    selectedTags: [] as string[],
    selectedAmenities: [] as string[],
  });

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/profiles`);
        setProfiles(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load data. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);


  // --- Filtering Logic ---
  const filteredProfiles = profiles.filter((profile: any) => {
    if (filters.purpose !== 'all' && profile.type !== filters.purpose) return false;
    if (filters.userType !== 'any' && profile.userType && profile.userType !== filters.userType) return false;
    if (filters.roomType !== 'any' && profile.roomType && profile.roomType !== filters.roomType) return false;
    if (filters.gender !== 'any' && profile.gender && profile.gender !== filters.gender) return false;
    if (profile.age && (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1])) return false;

    if (profile.budget) {
        const budgetString = profile.budget.replace(/[^0-9-]/g, '');
        const budgetNumbers = budgetString.split('-').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
        const profileMinBudget = budgetNumbers[0];
        const profileMaxBudget = budgetNumbers.length > 1 ? budgetNumbers[1] : profileMinBudget;
        const [filterMin, filterMax] = filters.budgetRange;
        if (filterMax < profileMinBudget || filterMin > profileMaxBudget) {
            return false;
        }
    }

    if (filters.selectedTags.length > 0 && !filters.selectedTags.every(tag => (profile.tags || []).includes(tag))) return false;
    if (filters.selectedAmenities.length > 0 && !filters.selectedAmenities.every(amenity => (profile.amenities || []).includes(amenity))) return false;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (profile.name || '').toLowerCase().includes(searchLower) ||
        (profile.location || '').toLowerCase().includes(searchLower) ||
        (profile.college || '').toLowerCase().includes(searchLower) ||
        (profile.description || '').toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    return true;
  });

  const handleCardClick = (profile: any) => {
    navigate(`/flatmate/${profile._id}`);
  };

  // --- Render UI ---
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                    <HomeIcon className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-primary">Homease</span>
                </div>
                <div className="flex-1 max-w-2xl mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by location, college, or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-2xl"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4 mr-2" />Filters</Button>
                    <Button size="sm" className="btn-primary" onClick={() => navigate('/post-flat')}><PlusCircle className="h-4 w-4 mr-2" />Post</Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}><User className="h-4 w-4" /></Button>
                </div>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start gap-8">
          {/* Backdrop for mobile filter view */}
          {showFilters && <div onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/60 z-40 transition-opacity md:hidden"/>}

          {/* Sidebar for Mobile */}
          <aside className={`fixed top-0 left-0 h-full w-80 bg-card z-50 p-6 shadow-lg transition-transform duration-500 ease-in-out md:hidden ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
            <FilterSidebar filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
          </aside>

          {/* Sidebar for Desktop */}
          <aside className={`hidden md:block transition-all duration-500 ease-in-out ${showFilters ? 'w-72' : 'w-0 overflow-hidden'}`}>
            <div className="sticky top-24 h-[calc(100vh-120px)] w-72">
              <div className={`transition-opacity duration-300 ${showFilters ? 'opacity-100' : 'opacity-0'} h-full`}>
                <FilterSidebar filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {loading && <div className="text-center py-12">Loading profiles...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card key="active-flatmates" className="text-center p-4"><div className="text-2xl font-bold text-primary">{filteredProfiles.filter(p => p.type === 'flatmate').length}</div><div className="text-sm text-muted-foreground">Active Flatmates</div></Card>
                  <Card key="available-flats" className="text-center p-4"><div className="text-2xl font-bold text-primary">{filteredProfiles.filter(p => p.type === 'flat').length}</div><div className="text-sm text-muted-foreground">Available Flats</div></Card>
                  <Card key="total-results" className="text-center p-4"><div className="text-2xl font-bold text-primary">{filteredProfiles.length}</div><div className="text-sm text-muted-foreground">Total Results</div></Card>
                  <Card key="match-rate" className="text-center p-4"><div className="text-2xl font-bold text-primary">92%</div><div className="text-sm text-muted-foreground">Match Rate</div></Card>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile: any) => (
                    <Card key={profile._id} className="cursor-pointer group" onClick={() => handleCardClick(profile)}>
                      <div className="relative">
                        <div className="aspect-square w-full overflow-hidden">
                          {/* --- THIS IS THE FIX --- */}
                          <img 
                            src={profile.avatar || profile.image || 'https://placehold.co/400x400/1f2937/9ca3af?text=Image'} 
                            alt={profile.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {profile.compatibility && (<Badge className="absolute top-2 right-2">{profile.compatibility}% match</Badge>)}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm truncate">{profile.name}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mb-1"><MapPin className="h-3 w-3 mr-1" /><span className="truncate">{profile.location}</span></div>
                        <div className="font-medium text-primary text-sm mb-2">{profile.budget}</div>
                        <div className="flex flex-wrap gap-1 mb-3">{profile.tags?.slice(0, 2).map((tag: string) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}</div>
                        {/* <Button variant="outline" size="sm" className="w-full" onClick={(e) => e.stopPropagation()}><Heart className="h-4 w-4 mr-1" />Save</Button> */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredProfiles.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;