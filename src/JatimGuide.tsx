import React, { useState } from 'react';
import JatimGuideLogo from './JatimGuideLogo.png';
import {
  Home,
  Map,
  FileText,
  Calendar,
  Settings,
  LogOut,
  MapPin,
  Star,
  UtensilsCrossed,
  Hotel,
  Ticket,
  Loader2,
  X
} from 'lucide-react';

interface Destination {
  id: number;
  name: string;
  type: string;
  description: string;
  theme: string;
}

interface HotelType {
  id: number;
  name: string;
  rating: number;
  location: string;
  price: string;
}

interface FoodType {
  id: number;
  name: string;
  rating: number;
  price: string;
  location: string;
}

interface RouteDay {
  day: number;
  title: string;
  locations: string[];
  activities: string[];
  hotel: string;
  food: string[];
  notes?: string;
}

interface GeneratedRoute {
  title: string;
  summary: string;
  days: RouteDay[];
  totalBudget: string;
  tips: string[];
}

const DESTINATION_THEMES = ['Culinary', 'Cultural', 'Nature', 'Historical', 'Adventure', 'Educational', 'Shop', 'Popular', 'Hidden Gems'];

const CITY_DESTINATIONS: { [key: string]: Destination[] } = {
  Surabaya: [
    { id: 1, name: 'House of Sampoerna', type: 'Museum', description: 'Historic colonial building', theme: 'Historical' },
    { id: 2, name: 'Monumen Kapal Selam', type: 'Monument', description: 'Submarine museum', theme: 'Historical' },
    { id: 3, name: 'Rawon & Rujak Cingur Tour', type: 'Food Tour', description: 'Local street food experience', theme: 'Culinary' },
    { id: 4, name: 'Surabaya Zoo', type: 'Wildlife', description: 'Zoo with local animals', theme: 'Nature' },
    { id: 5, name: 'Ampel Mosque', type: 'Religious', description: 'Historic mosque and old town', theme: 'Cultural' },
    { id: 6, name: 'Tunjungan Plaza', type: 'Shopping', description: 'Modern shopping mall', theme: 'Shop' },
    { id: 7, name: 'Submarine Museum Tour', type: 'Adventure', description: 'Explore submarine interior', theme: 'Adventure' },
    { id: 8, name: 'Local Coffee Warungs', type: 'Culinary', description: 'Traditional coffee shops', theme: 'Hidden Gems' }
  ],
  Malang: [
    { id: 1, name: 'Coban Rondo Waterfall', type: 'Nature', description: 'Beautiful waterfall hike', theme: 'Nature' },
    { id: 2, name: 'Jawa Timur Park 2', type: 'Theme Park', description: 'Family amusement park', theme: 'Educational' },
    { id: 3, name: 'Alun-Alun Malang', type: 'Square', description: 'City center plaza', theme: 'Popular' },
    { id: 4, name: 'Batu Night Spectacular', type: 'Entertainment', description: 'Night entertainment park', theme: 'Adventure' },
    { id: 5, name: 'Museum Angkut', type: 'Museum', description: 'Transportation museum', theme: 'Educational' },
    { id: 6, name: 'Apple Farms Tour', type: 'Agricultural', description: 'Local apple plantations', theme: 'Nature' },
    { id: 7, name: 'Traditional Markets', type: 'Market', description: 'Local market exploration', theme: 'Culinary' },
    { id: 8, name: 'Mountain Trekking', type: 'Adventure', description: 'Hiking trails', theme: 'Adventure' }
  ],
  Probolinggo: [
    { id: 1, name: 'Mount Bromo Sunrise', type: 'Nature', description: 'Iconic volcano sunrise', theme: 'Nature' },
    { id: 2, name: 'Bromo Sea of Sand', type: 'Adventure', description: 'Horse riding adventure', theme: 'Adventure' },
    { id: 3, name: 'Paiton Beach', type: 'Beach', description: 'Coastal relaxation', theme: 'Nature' },
    { id: 4, name: 'Bromo Museum', type: 'Educational', description: 'Geological museum', theme: 'Educational' },
    { id: 5, name: 'Local Fishing Villages', type: 'Cultural', description: 'Traditional fishing community', theme: 'Cultural' },
    { id: 6, name: 'Volcanic Rock Formations', type: 'Photography', description: 'Stunning landscapes', theme: 'Hidden Gems' },
    { id: 7, name: 'Local Seafood Markets', type: 'Culinary', description: 'Fresh seafood experience', theme: 'Culinary' },
    { id: 8, name: 'Jeep Tours', type: 'Adventure', description: 'Off-road jeep experience', theme: 'Adventure' }
  ],
  Pasuruan: [
    { id: 1, name: 'Wonosari Beach', type: 'Beach', description: 'Scenic beach', theme: 'Nature' },
    { id: 2, name: 'Bromo Viewpoint (Pasuruan side)', type: 'Viewpoint', description: 'Alternative Bromo views', theme: 'Nature' },
    { id: 3, name: 'Grati Market', type: 'Market', description: 'Traditional goods market', theme: 'Culinary' },
    { id: 4, name: 'Mountain Trails', type: 'Adventure', description: 'Hiking opportunities', theme: 'Adventure' },
    { id: 5, name: 'Local Restaurants', type: 'Culinary', description: 'Regional cuisine', theme: 'Culinary' },
    { id: 6, name: 'Scenic Drive', type: 'Tour', description: 'Mountain scenic route', theme: 'Popular' },
    { id: 7, name: 'Hidden Waterfalls', type: 'Nature', description: 'Secret waterfall spots', theme: 'Hidden Gems' },
    { id: 8, name: 'Cultural Villages', type: 'Cultural', description: 'Local community tours', theme: 'Cultural' }
  ],
  Madiun: [
    { id: 1, name: 'Alun-Alun Madiun', type: 'Square', description: 'City center plaza', theme: 'Popular' },
    { id: 2, name: 'Pecel Madiun Tour', type: 'Culinary', description: 'Traditional pecel experience', theme: 'Culinary' },
    { id: 3, name: 'Madiun Old Market', type: 'Market', description: 'Historic market exploration', theme: 'Historical' },
    { id: 4, name: 'Taman Wilis', type: 'Park', description: 'Green space park', theme: 'Nature' },
    { id: 5, name: 'Local Snack Shops', type: 'Culinary', description: 'Street food tasting', theme: 'Culinary' },
    { id: 6, name: 'Cultural Heritage Sites', type: 'Cultural', description: 'Historical landmarks', theme: 'Cultural' },
    { id: 7, name: 'Local Coffee Roastery', type: 'Culinary', description: 'Coffee production tour', theme: 'Hidden Gems' },
    { id: 8, name: 'Caruban Cultural Spot', type: 'Cultural', description: 'Traditional arts area', theme: 'Cultural' }
  ],
  Banyuwangi: [
    { id: 1, name: 'Ijen Crater Blue Fire', type: 'Nature', description: 'Unique blue fire phenomenon', theme: 'Nature' },
    { id: 2, name: 'Pulau Merah Beach', type: 'Beach', description: 'Red sand beach', theme: 'Nature' },
    { id: 3, name: 'Blambangan Park', type: 'Park', description: 'National park wildlife', theme: 'Nature' },
    { id: 4, name: 'Coffee Plantations', type: 'Agricultural', description: 'Coffee tasting tours', theme: 'Culinary' },
    { id: 5, name: 'Local Art Markets', type: 'Shopping', description: 'Handmade crafts', theme: 'Shop' },
    { id: 6, name: 'Fishing Villages', type: 'Cultural', description: 'Traditional communities', theme: 'Cultural' },
    { id: 7, name: 'Crater Hiking', type: 'Adventure', description: 'Challenging hike', theme: 'Adventure' },
    { id: 8, name: 'Secret Waterfalls', type: 'Nature', description: 'Hidden natural spots', theme: 'Hidden Gems' }
  ],
  Jember: [
    { id: 1, name: 'Papuma Beach', type: 'Beach', description: 'Scenic coastal area', theme: 'Nature' },
    { id: 2, name: 'Coffee Plantation Tours', type: 'Agricultural', description: 'Single-origin coffee', theme: 'Culinary' },
    { id: 3, name: 'Jember Fashion Carnaval Area', type: 'Cultural', description: 'Fashion event location', theme: 'Cultural' },
    { id: 4, name: 'Waterfalls Trek', type: 'Adventure', description: 'Waterfall hiking', theme: 'Adventure' },
    { id: 5, name: 'Local Markets', type: 'Market', description: 'Traditional markets', theme: 'Popular' },
    { id: 6, name: 'Coffee Roastery', type: 'Culinary', description: 'Coffee production', theme: 'Educational' },
    { id: 7, name: 'Beach Sunset Spots', type: 'Photography', description: 'Photography locations', theme: 'Hidden Gems' },
    { id: 8, name: 'Coastal Villages', type: 'Cultural', description: 'Fishing communities', theme: 'Cultural' }
  ],
  Sidoarjo: [
    { id: 1, name: 'Lumpur Sidoarjo Viewpoint', type: 'Geological', description: 'Mudflow viewing area', theme: 'Educational' },
    { id: 2, name: 'Sambu Street Market', type: 'Market', description: 'Local food market', theme: 'Culinary' },
    { id: 3, name: 'Bumi Perkemahan', type: 'Park', description: 'Camping ground park', theme: 'Nature' },
    { id: 4, name: 'Industrial Heritage Tour', type: 'Historical', description: 'Industrial sites', theme: 'Historical' },
    { id: 5, name: 'Local Restaurants', type: 'Culinary', description: 'Regional dishes', theme: 'Culinary' },
    { id: 6, name: 'Nature Walks', type: 'Nature', description: 'Hiking trails', theme: 'Nature' },
    { id: 7, name: 'Photography Tours', type: 'Photography', description: 'Unique photo spots', theme: 'Hidden Gems' },
    { id: 8, name: 'Market Exploration', type: 'Cultural', description: 'Cultural immersion', theme: 'Cultural' }
  ],
  Batu: [
    { id: 1, name: 'Batu Secret Zoo', type: 'Wildlife', description: 'Zoo experience', theme: 'Educational' },
    { id: 2, name: 'Selecta Park', type: 'Theme Park', description: 'Amusement park', theme: 'Popular' },
    { id: 3, name: 'Paralayang Batu', type: 'Adventure', description: 'Paragliding experience', theme: 'Adventure' },
    { id: 4, name: 'Strawberry Picking', type: 'Agricultural', description: 'Farm picking experience', theme: 'Culinary' },
    { id: 5, name: 'Mountain Trekking', type: 'Adventure', description: 'Highland hiking', theme: 'Adventure' },
    { id: 6, name: 'Local Cafes', type: 'Culinary', description: 'Strawberry products', theme: 'Culinary' },
    { id: 7, name: 'Viewpoint Sunset', type: 'Photography', description: 'Evening views', theme: 'Hidden Gems' },
    { id: 8, name: 'Cultural Markets', type: 'Shopping', description: 'Local crafts', theme: 'Shop' }
  ]
};

const CITY_TITLES: { [key: string]: string } = {
  Surabaya: 'Surabaya: Heroes City Exploration',
  Malang: 'Malang: Mountain City Adventure',
  Probolinggo: 'Probolinggo: Gateway to Bromo',
  Pasuruan: 'Pasuruan: Ancient City Discovery',
  Banyuwangi: 'Banyuwangi: Eastern Gateway',
  Jember: 'Jember: Coffee & Culture',
  Madiun: 'Madiun: Pecel & Heritage',
  Sidoarjo: 'Sidoarjo: Industrial Heritage',
  Batu: 'Batu: Highland Sanctuary'
};

const CITY_FOODS: { [key: string]: string[] } = {
  Surabaya: ['Rawon', 'Rujak Cingur', 'Soto ayam'],
  Malang: ['Bakso Malang', 'Pecel', 'Orem-orem'],
  Probolinggo: ['Rujak Soto', 'Sego Campur', 'Sate Madura'],
  Pasuruan: ['Seafood Wonosari', 'Lontong Balap', 'Brem'],
  Banyuwangi: ['Gohu ikan', 'Nasi Tempong', 'Rujak Soto Banyuwangi'],
  Jember: ['Sego Cawuk', 'Rujak Soto', 'Sate Ayam'],
  Madiun: ['Pecel Madiun', 'Soto Madiun', 'Gethuk'],
  Sidoarjo: ['Lontong Kupang', 'Pempek Sidoarjo', 'Pindang Serani'],
  Batu: ['Apple Pie Batu', 'Sate Kelinci', 'Tahu Lontong']
};

export default function JatimGuide() {
  const [activeTab, setActiveTab] = useState<string>('Plan Route');
  const [startPoint, setStartPoint] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('Public Transport');
  const [duration, setDuration] = useState<string>('');
  const [travelBetweenCities, setTravelBetweenCities] = useState<boolean>(true);
  const [destinationPreferences, setDestinationPreferences] = useState<string[]>([]);
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addedHotels, setAddedHotels] = useState<HotelType[]>([]);
  const [addedFoods, setAddedFoods] = useState<FoodType[]>([]);

  // endpoint state: 'return' | 'free' | 'specific' | null
  const [endpoint, setEndpoint] = useState<'return' | 'free' | 'specific' | null>(null);
  const [specificCity, setSpecificCity] = useState<string>('');

  const hotels: HotelType[] = [
    { id: 1, name: 'Hotel Santika Malang', rating: 4.5, location: 'Malang', price: 'Rp 650.000/night' },
    { id: 2, name: 'Grand Inna Tunjungan', rating: 4.3, location: 'Surabaya', price: 'Rp 550.000/night' },
    { id: 3, name: 'Whiz Prime Surabaya', rating: 4.2, location: 'Surabaya', price: 'Rp 450.000/night' },
    { id: 4, name: 'Swiss-Belinn Malang', rating: 4.4, location: 'Malang', price: 'Rp 600.000/night' },
  ];

  const foods: FoodType[] = [
    { id: 1, name: 'Rawon Setan', rating: 4.8, price: 'Rp 35.000', location: 'Surabaya' },
    { id: 2, name: 'Bakso President', rating: 4.6, price: 'Rp 25.000', location: 'Malang' },
    { id: 3, name: 'Soto Ayam Lamongan', rating: 4.7, price: 'Rp 20.000', location: 'Surabaya' },
    { id: 4, name: 'Pecel Madiun', rating: 4.5, price: 'Rp 15.000', location: 'Madiun' },
  ];

  const toggleDestinationPreference = (theme: string): void => {
    setDestinationPreferences((prev) =>
      prev.includes(theme)
        ? prev.filter((t) => t !== theme)
        : [...prev, theme]
    );
  };

  const addHotelToRoute = (hotel: HotelType): void => {
    if (!addedHotels.find(h => h.id === hotel.id)) {
      setAddedHotels([...addedHotels, hotel]);
    }
  };

  const removeHotelFromRoute = (hotelId: number): void => {
    setAddedHotels(addedHotels.filter(h => h.id !== hotelId));
  };

  const addFoodToRoute = (food: FoodType): void => {
    if (!addedFoods.find(f => f.id === food.id)) {
      setAddedFoods([...addedFoods, food]);
    }
  };

  const removeFoodFromRoute = (foodId: number): void => {
    setAddedFoods(addedFoods.filter(f => f.id !== foodId));
  };

  const extractCity = (locationString: string): string => {
    const parts = locationString.split(',');
    return parts[0]?.trim() || '';
  };

  // Try to detect a city from a list of location strings or a single string.
  const detectCityFromLocations = (locations: string[] | string): string | null => {
    const locs = Array.isArray(locations) ? locations : [locations];
    const cityKeys = Object.keys(CITY_DESTINATIONS);
    // 1) direct city name mention
    for (const city of cityKeys) {
      for (const loc of locs) {
        if (!loc) continue;
        if (loc.toLowerCase().includes(city.toLowerCase())) return city;
      }
    }
    // 2) match destination names in location strings
    for (const city of cityKeys) {
      const dests = CITY_DESTINATIONS[city];
      for (const dest of dests) {
        for (const loc of locs) {
          if (!loc) continue;
          if (loc.toLowerCase().includes(dest.name.toLowerCase())) return city;
        }
      }
    }
    return null;
  };

  const generateDayTitle = (day: number, locationString: string): string => {
    const city = extractCity(locationString);
    const cityTitle = CITY_TITLES[city] || `Day ${day}: ${city}`;
    return `Day ${day}: ${cityTitle}`;
  };

  const generateRoute = async (): Promise<void> => {
    if (!startPoint || !duration) {
      setError('Please fill in starting point and duration');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedRoute(null);
    setAddedHotels([]);
    setAddedFoods([]);

        try {
      const response = await fetch('http://localhost:3001/api/generate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startPoint,
          duration,
          transportMode,
          travelBetweenCities,
          destinationPreferences,  // pass preferences to server
          endpoint,
          specificCity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate route');
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error('Invalid response from server');
      }

      const aiData = result.data;

      const getAvailableDestinations = (): Destination[] => {
        if (travelBetweenCities) {
          return Object.values(CITY_DESTINATIONS).flat();
        } else {
          return CITY_DESTINATIONS[startPoint] || [];
        }
      };

      const availableDestinations = getAvailableDestinations();

      const getFilteredDestinations = (destinations: Destination[]) => {
        if (destinationPreferences.length === 0) {
          return destinations;
        }
        return destinations.filter((dest) =>
          destinationPreferences.includes(dest.theme)
        );
      };

      const filteredDestinations = getFilteredDestinations(availableDestinations);

      const aiDays = Array.isArray(aiData.days) && aiData.days.length > 0
        ? aiData.days
        : Array.from({ length: Math.max(1, parseInt(duration || '1')) }, (_, i) => ({ day: i + 1 }));

                 const mockRoute: GeneratedRoute = {
        title: aiData.title || `${duration}-Day East Java Adventure from ${startPoint}`,
        summary: aiData.summary || `Explore the best of East Java starting from ${startPoint} using ${transportMode}.`,
        days: aiDays.map((day: any, idx: number) => {
          const dayIndex = idx + 1;
          const rawLocations = Array.isArray(day.locations) ? day.locations : (day.locations ? [day.locations] : [startPoint]);

          // if not traveling between cities, all days are in startPoint
          let locations = travelBetweenCities ? rawLocations : [startPoint];

          // detect city for this day's locations (supports travelBetweenCities)
          let detectedCity = detectCityFromLocations(locations) || (travelBetweenCities ? null : startPoint);

          // STEP 1: Find a city that matches the user's destination preferences
          let finalCity = detectedCity;
          
          if (travelBetweenCities && destinationPreferences.length > 0) {
            // If detected city doesn't exist or we're looking for preference matches
            const cityKeys = Object.keys(CITY_DESTINATIONS);
            let foundCity = false;

            // If we have a detected city, check if it has activities matching preferences
            if (detectedCity && CITY_DESTINATIONS[detectedCity]) {
              const hasMatchingActivities = CITY_DESTINATIONS[detectedCity]
                .some(d => destinationPreferences.includes(d.theme));
              
              if (hasMatchingActivities) {
                foundCity = true;
                finalCity = detectedCity;
              }
            }

            // If detected city doesn't have matching activities, find one that does
            if (!foundCity) {
              for (const city of cityKeys) {
                // Skip specificCity if this is not the last day
                if (endpoint === 'specific' && idx !== aiDays.length - 1 && city === specificCity) {
                  continue;
                }

                const hasMatchingActivities = CITY_DESTINATIONS[city]
                  .some(d => destinationPreferences.includes(d.theme));
                
                if (hasMatchingActivities) {
                  finalCity = city;
                  locations = [city];
                  foundCity = true;
                  break;
                }
              }
            }
          }

          // STEP 2: Get activities from the finalCity that match user preferences
          let activities: string[] = [];

          if (finalCity && CITY_DESTINATIONS[finalCity]) {
            if (destinationPreferences.length > 0) {
              // Get activities from finalCity that match preferences
              activities = CITY_DESTINATIONS[finalCity]
                .filter(d => destinationPreferences.includes(d.theme))
                .map(d => d.name)
                .slice(0, 4);
            } else {
              // No preferences, get any activities from finalCity
              activities = CITY_DESTINATIONS[finalCity]
                .map(d => d.name)
                .slice(0, 4);
            }
          }

          // Fallback: if still no activities
          if (activities.length === 0) {
            if (Array.isArray(day.activities) && day.activities.length > 0) {
              activities = day.activities.filter((a: string) => !!a).slice(0, 4);
            } else if (destinationPreferences.length > 0) {
              const filtered = filteredDestinations.slice(0, 4).map(d => d.name);
              activities = filtered;
            } else {
              activities = availableDestinations.slice(0, 4).map(d => d.name);
            }
          }

          const dayTitle = generateDayTitle(dayIndex, locations[0] || (finalCity || startPoint));

          // Foods prefer city-specific then AI then generic
          const aiFoods = Array.isArray(day.food) && day.food.length > 0 ? day.food : null;
          const cityFoods = (finalCity && CITY_FOODS[finalCity]) ? CITY_FOODS[finalCity] : null;
          const finalFoods = cityFoods || aiFoods || ['Local Cuisine'];

          return {
            day: dayIndex,
            title: dayTitle,
            locations,
            activities,
            hotel: day.hotel || 'Hotel TBD',
            food: finalFoods.slice(0, 3),
            notes: day.notes || `Day ${dayIndex} exploration`
          };
        }),
        
        totalBudget: aiData.totalBudget || `Rp ${parseInt(duration) * 1200000} - Rp ${parseInt(duration) * 1800000}`,
        tips: Array.isArray(aiData.tips) ? aiData.tips : [
          "Bring warm clothes for mountain areas",
          "Book accommodations in advance",
          "Try local street food",
          "Hire a local guide",
          "Download offline maps"
        ]
      };

      // Apply endpoint rules after route built
      if (mockRoute.days.length > 0) {
        const lastIdx = mockRoute.days.length - 1;

        if (endpoint === 'return') {
          mockRoute.days[lastIdx].locations = [startPoint];
          mockRoute.days[lastIdx].activities = [];
          mockRoute.days[lastIdx].title = `Day ${mockRoute.days[lastIdx].day}: Return to ${startPoint}`;
        } else if (endpoint === 'specific' && specificCity) {
          mockRoute.days[lastIdx].locations = [specificCity];
          mockRoute.days[lastIdx].title = `Day ${mockRoute.days[lastIdx].day}: ${specificCity}`;
          
          // Set activities for last day based on specificCity and preferences
          if (CITY_DESTINATIONS[specificCity]) {
            if (destinationPreferences.length > 0) {
              const cityMatches = CITY_DESTINATIONS[specificCity]
                .filter(d => destinationPreferences.includes(d.theme))
                .map(d => d.name);
              mockRoute.days[lastIdx].activities = cityMatches.slice(0, 4);
            } else {
              mockRoute.days[lastIdx].activities = CITY_DESTINATIONS[specificCity]
                .map(d => d.name)
                .slice(0, 4);
            }
          }

          // Fallback if no activities found
          if (mockRoute.days[lastIdx].activities.length === 0 && Array.isArray(aiDays[lastIdx]?.activities)) {
            mockRoute.days[lastIdx].activities = aiDays[lastIdx].activities.slice(0, 4);
          }
        }
        // 'free' or null -> no special handling
      }

      setGeneratedRoute(mockRoute);
    } catch (err) {
      console.error('Error generating route:', err);
      setError('An error occurred while generating the route. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{
      backgroundImage: `url(${JatimGuideLogo})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '95% 50%',
      backgroundColor: '#0F4062'
    }}>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img src={JatimGuideLogo} alt="JatimGuide" className="w-10 h-10" />
              <span className="text-2xl font-semibold text-[#0F4062]">JatimGuide</span>
            </div>

            <div className="flex items-center gap-3">
              <nav className="hidden md:flex" aria-label="primary">
                <div className="flex items-end gap-2 bg-gray-100 rounded-full p-1 shadow-sm">
                  {[
                    { key: 'Home', icon: <Home className="w-4 h-4 inline-block mr-2" /> },
                    { key: 'Map', icon: <Map className="w-4 h-4 inline-block mr-2" /> },
                    { key: 'Plan Route', icon: <FileText className="w-4 h-4 inline-block mr-2" /> },
                    { key: 'Booking', icon: <Calendar className="w-4 h-4 inline-block mr-2" /> },
                    { key: 'Settings', icon: <Settings className="w-4 h-4 inline-block mr-2" /> }
                  ].map((item) => {
                    const active = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`flex items-center px-3 py-2 text-sm rounded-full transition-colors font-medium
                          ${active ? 'bg-white text-[#0F4062] shadow' : 'text-gray-600 hover:text-[#0F4062]'}`}
                      >
                        {item.icon}
                        <span className="whitespace-nowrap">{item.key}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              <button
                onClick={() => { /* sign out */ }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F4062] text-white text-sm rounded-md shadow hover:opacity-95"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#D9D9D9] rounded-lg shadow p-6 border-[1.5px] border-black">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Route Configuration</h2>

              {!generatedRoute ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Starting Point
                    </label>
                    <select
                      value={startPoint}
                      onChange={(e) => setStartPoint(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a city</option>
                      {Object.keys(CITY_DESTINATIONS).map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Destination Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DESTINATION_THEMES.map((theme) => (
                        <button
                          key={theme}
                          onClick={() => toggleDestinationPreference(theme)}
                          type="button"
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            destinationPreferences.includes(theme)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Travel Between Cities
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={travelBetweenCities}
                          onChange={() => setTravelBetweenCities(true)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!travelBetweenCities}
                          onChange={() => setTravelBetweenCities(false)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transportation Type
                    </label>
                    <select
                      value={transportMode}
                      onChange={(e) => setTransportMode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>🚗 Private Car</option>
                      <option>🏍️ Motorcycle</option>
                      <option>🚌 Public Transport</option>
                      <option>🚴 Bicycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration of Trip
                    </label>
                    <input
                      type="number"
                      placeholder="Insert the duration of days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="14"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Point
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'return', label: 'Return to Starting Point' },
                        { id: 'free', label: 'Free' },
                        { id: 'specific', label: 'Specific city' }
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            setEndpoint((prev) => (prev === (opt.id as 'return' | 'free' | 'specific') ? null : (opt.id as 'return' | 'free' | 'specific')));
                            if (opt.id !== 'specific') setSpecificCity('');
                          }}
                        >
                          <input
                            type="radio"
                            name="endpoint"
                            readOnly
                            checked={endpoint === (opt.id as 'return' | 'free' | 'specific')}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                      ))}

                      {endpoint === 'specific' && (
                        <div className="mt-2">
                          <label className="block text-xs text-gray-600 mb-1">Choose city</label>
                          <select
                            value={specificCity}
                            onChange={(e) => setSpecificCity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a city</option>
                            {Object.keys(CITY_DESTINATIONS).map((city) => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={generateRoute}
                    disabled={isGenerating}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors mt-4 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Plan Smart Route'
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 space-y-4 border border-gray-300">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Starting Point</p>
                      <p className="text-lg font-bold text-gray-900">{startPoint}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Transportation</p>
                      <p className="text-sm text-gray-800">{transportMode}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Duration</p>
                      <p className="text-sm text-gray-800">{duration} days</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Travel Between Cities</p>
                      <p className="text-sm text-gray-800">{travelBetweenCities ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">End Point</p>
                      <p className="text-sm text-gray-800">{endpoint === 'return' ? 'Return to Starting Point' : endpoint === 'specific' ? (specificCity || 'Specific city') : 'Free'}</p>
                    </div>
                    {destinationPreferences.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Preferences</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {destinationPreferences.map((pref) => (
                            <span key={pref} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setGeneratedRoute(null);
                      setAddedHotels([]);
                      setAddedFoods([]);
                    }}
                    className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
                  >
                    Modify Route
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {generatedRoute ? (
              <>
                <div className="bg-[#D9D9D9] rounded-lg shadow-lg p-6 border-[1.5px] border-black">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{generatedRoute.title}</h2>
                  <p className="text-gray-700 mb-6">{generatedRoute.summary}</p>

                  <div className="space-y-4">
                    {generatedRoute.days.map((day) => (
                      <div key={day.day} className="bg-white rounded-lg p-5 shadow border-[1.1px] border-black">
                        <h3 className="text-lg font-bold text-blue-600 mb-2">{day.title}</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Locations: </span>
                            <span className="text-gray-600">{day.locations.join(', ')}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Activities: </span>
                            <ul className="list-disc list-inside text-gray-600 mt-1">
                              {day.activities.map((activity, idx) => (
                                <li key={idx}>{activity || `Activity ${idx + 1}`}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Hotel: </span>
                            <span className="text-gray-600">{day.hotel}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Food to try: </span>
                            <span className="text-gray-600">{day.food.join(', ')}</span>
                          </div>
                          {day.notes && (
                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                              <span className="font-semibold text-gray-700">💡 Tips: </span>
                              <span className="text-gray-600">{Array.isArray(day.notes) ? day.notes.join(', ') : day.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {addedHotels.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg p-4 border-2 border-green-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Hotel className="w-5 h-5" />
                        Your Selected Hotels
                      </h4>
                      <div className="space-y-2">
                        {addedHotels.map((hotel) => (
                          <div key={hotel.id} className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-200">
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{hotel.name}</p>
                              <p className="text-xs text-gray-600">{hotel.location} • {hotel.price}</p>
                            </div>
                            <button
                              onClick={() => removeHotelFromRoute(hotel.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {addedFoods.length > 0 && (
                    <div className="mt-4 bg-white rounded-lg p-4 border-2 border-orange-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5" />
                        Your Selected Foods
                      </h4>
                      <div className="space-y-2">
                        {addedFoods.map((food) => (
                          <div key={food.id} className="flex items-center justify-between bg-orange-50 p-3 rounded border border-orange-200">
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{food.name}</p>
                              <p className="text-xs text-gray-600">{food.location} • {food.price}</p>
                            </div>
                            <button
                              onClick={() => removeFoodFromRoute(food.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-gray-900 mb-1">Estimated Budget</h4>
                      <p className="text-green-700 text-lg font-semibold">{generatedRoute.totalBudget}</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-bold text-gray-900 mb-2">Travel Tips</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {generatedRoute.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Recommended Hotels</h2>
                  <div className="space-y-4">
                    {hotels.map((hotel) => (
                      <div key={hotel.id} className="bg-[#D9D9D9] rounded-lg shadow p-6 flex items-start gap-4 border-[1.5px] border-black">
                        <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                          <Hotel className="w-8 h-8 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">Location: {hotel.location}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{hotel.rating}</span>
                          </div>
                          <p className="text-sm font-semibold text-blue-600">{hotel.price}</p>
                        </div>
                        <button
                          onClick={() => addHotelToRoute(hotel)}
                          disabled={addedHotels.find(h => h.id === hotel.id) !== undefined}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {addedHotels.find(h => h.id === hotel.id) ? 'Added' : 'Add to Route'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Food Recommendations</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {foods.map((food) => (
                      <div key={food.id} className="bg-[#D9D9D9] rounded-lg shadow p-4 border-[1.5px] border-black">
                        <div className="w-full h-32 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                          <UtensilsCrossed className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{food.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{food.location}</p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{food.rating}</span>
                          </div>
                          <p className="text-sm font-semibold text-blue-600">{food.price}</p>
                        </div>
                        <button
                          onClick={() => addFoodToRoute(food)}
                          disabled={addedFoods.find(f => f.id === food.id) !== undefined}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {addedFoods.find(f => f.id === food.id) ? 'Added' : 'Add to Route'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#D9D9D9] rounded-lg shadow p-8 text-center border-[1.5px] border-black">
                  <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-gray-900">Book Tickets & Hotels</h2>
                </div>
              </>
            ) : (
              <div className="bg-[#D9D9D9] rounded-lg shadow p-12 text-center border-[1.5px] border-black">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Want to add your first destination manually?</h3>
                <p className="text-gray-600 mb-4">Fill in the route configuration on the left and click "Plan Smart Route" to get started with your East Java adventure!</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Click here
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t" style={{ backgroundColor: '#144363' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between">
            <div className="text-sm">
              <span className="font-bold text-[#E8F4FF] text-2xl">@JatimGuide</span>
              <span className="font-thin ml-1 text-[#B7C9D9] text-2xl">Properties</span>
            </div>
            <div className="grid grid-cols-3 gap-12" />
          </div>
        </div>
      </footer>
    </div>
  );
}