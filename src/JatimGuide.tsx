import React, { useState } from 'react';
import { MapPin, Star, UtensilsCrossed, Hotel, Ticket, Loader2, X } from 'lucide-react';

interface Destination {
  id: number;
  name: string;
  type: string;
  description: string;
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

// title utk setiap city
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

// Recommended foods per city (used to set "Food to try" per day)
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
  const [activeTab, setActiveTab] = useState<string>('Routes');
  const [startPoint, setStartPoint] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('Public Transport');
  const [duration, setDuration] = useState<string>('');
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addedHotels, setAddedHotels] = useState<HotelType[]>([]);
  const [addedFoods, setAddedFoods] = useState<FoodType[]>([]);
  
  const hotels: HotelType[] = [
    { id: 1, name: 'Hotel Santika Malang', rating: 4.5, location: 'Malang', price: 'Rp 650.000/night' },
    { id: 2, name: 'Grand Inna Malioboro', rating: 4.3, location: 'Surabaya', price: 'Rp 550.000/night' },
    { id: 3, name: 'Whiz Prime Surabaya', rating: 4.2, location: 'Surabaya', price: 'Rp 450.000/night' },
    { id: 4, name: 'Swiss-Belinn Malang', rating: 4.4, location: 'Malang', price: 'Rp 600.000/night' },
  ];
  
  const foods: FoodType[] = [
    { id: 1, name: 'Rawon Setan', rating: 4.8, price: 'Rp 35.000', location: 'Surabaya' },
    { id: 2, name: 'Bakso President', rating: 4.6, price: 'Rp 25.000', location: 'Malang' },
    { id: 3, name: 'Soto Ayam Lamongan', rating: 4.7, price: 'Rp 20.000', location: 'Surabaya' },
    { id: 4, name: 'Pecel Madiun', rating: 4.5, price: 'Rp 15.000', location: 'Madiun' },
  ];

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

  // ngeekstrat city dari lokasi (format: "City, location 1, location 2")
  const extractCity = (locationString: string): string => {
    const parts = locationString.split(',');
    return parts[0]?.trim() || '';
  };

  // bikin title per hari based on the city
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
        body: JSON.stringify({ startPoint, duration, transportMode })
      });

      if (!response.ok) {
        throw new Error('Failed to generate route');
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error('Invalid response from server');
      }

      const aiData = result.data;
      
      // data ai untuk generated route yurr pls bisa :D
      const mockRoute: GeneratedRoute = {
        title: aiData.title || `${duration}-Day East Java Adventure from ${startPoint}`,
        summary: aiData.summary || `Explore the best of East Java starting from ${startPoint} using ${transportMode}.`,
        days: (aiData.days || []).map((day: any) => {
          const locations = Array.isArray(day.locations) ? day.locations : ['Unknown Location'];
          const dayTitle = generateDayTitle(day.day || 0, locations[0] || '');

          // determine city from first location (format: "City, location 1, location 2")
          const detectedCity = extractCity(locations[0] || '');

          // prefer city-specific foods; fall back to AI-provided food or a generic option
          const aiFoods = Array.isArray(day.food) && day.food.length > 0 ? day.food : null;
          const cityFoods = (detectedCity && CITY_FOODS[detectedCity]) ? CITY_FOODS[detectedCity] : null;
          const finalFoods = cityFoods || aiFoods || ['Local Cuisine'];

          return {
            day: day.day || 0,
            title: dayTitle,
            locations: locations,
            activities: Array.isArray(day.activities)
              ? day.activities.filter((a: string) => a && a.length > 0).slice(0, 4)
              : [],
            hotel: day.hotel || 'Hotel TBD',
            food: finalFoods.slice(0, 3),
            notes: day.notes || `Day ${day.day} exploration`
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

      setGeneratedRoute(mockRoute);
    } catch (err) {
      console.error('Error generating route:', err);
      setError('An error occurred while generating the route. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/*headernya guys*/}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">JatimGuide</h1>
            <nav className="flex gap-6">
              {['Home', 'Routes', 'Map', 'Booking', 'Settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/*main content*/}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*route configuration sidebar*/}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Route Configuration</h2>
              
              <div className="space-y-4">
                {/*starting point location*/}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Starting Point
                  </label>
                  <input
                    type="text"
                    placeholder="Insert your location"
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/*transport mode*/}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transport Mode
                  </label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Public Transport</option>
                    <option>Private Car</option>
                    <option>Motorcycle</option>
                    <option>Bicycle</option>
                  </select>
                </div>

                {/*duration of days*/}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration of Days
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

                {/*msg error*/}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/*ini untuk tombol generate smart route*/}
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
                    'Generate Smart Route'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/*right area content*/}
          <div className="lg:col-span-2 space-y-8">
            {/*display for the generated route*/}
            {generatedRoute && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{generatedRoute.title}</h2>
                <p className="text-gray-700 mb-6">{generatedRoute.summary}</p>
                
                {/*days itinerary*/}
                <div className="space-y-4">
                  {generatedRoute.days.map((day) => (
                    <div key={day.day} className="bg-white rounded-lg p-5 shadow">
                      <h3 className="text-lg font-bold text-blue-600 mb-2">
                        {day.title}
                      </h3>
                      
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
                            <span className="text-gray-600">{day.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/*hotels section hooh*/}
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

                {/*section makan makan*/}
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
                
                {/*budget dan tips*/}
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
            )}

            {/*untuk menampilkan rekomendasi pas udh digen*/}
            {generatedRoute && (
              <>
                {/*recom hotels*/}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Hotels</h2>
                  <div className="space-y-4">
                    {hotels.map((hotel) => (
                      <div key={hotel.id} className="bg-white rounded-lg shadow p-6 flex items-start gap-4">
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

                {/*recom makanan*/}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Food Recommendations</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {foods.map((food) => (
                      <div key={food.id} className="bg-white rounded-lg shadow p-4">
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

                {/*booking tickets dan hotels*/}
                <div className="bg-gray-200 rounded-lg shadow p-8 text-center">
                  <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-gray-900">Book Tickets & Hotels</h2>
                </div>
              </>
            )}

            {/*munculin msg kalo route blm generated*/}
            {!generatedRoute && !isGenerating && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Your Route First</h3>
                <p className="text-gray-600">Fill in the route configuration on the left and click "Generate Smart Route" to get started with your East Java adventure!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/*footer*/}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between">
            <div className="text-sm text-gray-600">JatimGuide</div>
            <div className="grid grid-cols-3 gap-12">
              <div>
                <p className="text-sm text-gray-600">placeholder</p>
                <p className="text-sm text-gray-600">placeholder</p>
                <p className="text-sm text-gray-600">placeholder</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">placeholder</p>
                <p className="text-sm text-gray-600">placeholder</p>
                <p className="text-sm text-gray-600">placeholder</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">placeholder</p>
                <p className="text-sm text-gray-600">placeholder</p>
                <p className="text-sm text-gray-600">placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}