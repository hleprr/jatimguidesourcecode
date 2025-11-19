const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Locations per city with the themes
const CITY_ATTRACTIONS_BY_THEME = {
  Surabaya: {
    Historical: ['House of Sampoerna', 'Monumen Kapal Selam (Submarine Monument)', 'Ampel Mosque'],
    Culinary: ['Rawon Street Food Tour', 'Rujak Cingur Tour', 'Local Coffee Warungs'],
    Nature: ['Surabaya Zoo', 'Taman Bungkul Park'],
    Cultural: ['Ampel Old Town', 'Traditional Markets'],
    Shop: ['Tunjungan Plaza', 'Pasar Atom'],
    Adventure: ['Submarine Museum Tour', 'City Cycling Tour'],
    Educational: ['Museum of Surabaya', 'Technical Museum'],
    Popular: ['Tunjungan Plaza', 'Alun-Alun Surabaya'],
    'Hidden Gems': ['Local Coffee Warungs', 'Street Art Areas']
  },
  Malang: {
    Nature: ['Coban Rondo Waterfall', 'Apple Farms Tour', 'Taman Hidup'],
    Historical: ['Malang Museum', 'Colonial Buildings'],
    Cultural: ['Alun-Alun Malang', 'Local Markets'],
    Adventure: ['Batu Night Spectacular', 'Mountain Trekking', 'Jeep Tours'],
    Educational: ['Jawa Timur Park 2', 'Museum Angkut'],
    Culinary: ['Traditional Markets', 'Local Cafes', 'Street Food Tour'],
    Shop: ['Alun-Alun Malang Shops', 'Crafts Markets'],
    Popular: ['Alun-Alun Malang', 'Jawa Timur Park 2'],
    'Hidden Gems': ['Local Coffee Roastery', 'Secret Waterfalls']
  },
  Probolinggo: {
    Nature: ['Mount Bromo Sunrise Point', 'Paiton Beach', 'Volcanic Rock Formations'],
    Adventure: ['Bromo Sea of Sand Horse Riding', 'Jeep Tours', 'Crater Hiking'],
    Culinary: ['Local Seafood Markets', 'Street Food Tour'],
    Cultural: ['Local Fishing Villages', 'Traditional Markets'],
    Educational: ['Bromo Museum', 'Geological Center'],
    Historical: ['Probolinggo Old Market', 'Ancient Sites'],
    Popular: ['Mount Bromo Area', 'Paiton Beach'],
    Shop: ['Local Markets', 'Craft Shops'],
    'Hidden Gems': ['Volcanic Rock Formations', 'Secret Viewpoints']
  },
  Pasuruan: {
    Nature: ['Wonosari Beach', 'Bromo Viewpoint (Pasuruan side)', 'Hidden Waterfalls', 'Mountain Scenic Routes'],
    Adventure: ['Mountain Trails', 'Hiking Opportunities', 'Scenic Drives'],
    Culinary: ['Grati Market', 'Local Restaurants', 'Seafood Spots'],
    Cultural: ['Cultural Villages', 'Traditional Markets'],
    Popular: ['Wonosari Beach', 'Scenic Drive Routes'],
    Historical: ['Ancient Sites', 'Old Markets'],
    Educational: ['Geological Sites', 'Local Guides'],
    Shop: ['Grati Market', 'Local Shops'],
    'Hidden Gems': ['Secret Viewpoints', 'Waterfall Spots']
  },
  Madiun: {
    Culinary: ['Pecel Madiun Tour', 'Local Snack Shops', 'Street Food Market', 'Pecel Restaurant Tour'],
    Cultural: ['Caruban Cultural Spot', 'Cultural Heritage Sites', 'Traditional Arts Area'],
    Popular: ['Alun-Alun Madiun', 'City Center'],
    Nature: ['Taman Wilis', 'Park Areas', 'Green Spaces'],
    Historical: ['Madiun Old Market', 'Heritage Sites', 'Ancient Buildings'],
    Adventure: ['Hiking Trails', 'Nature Walks'],
    Educational: ['Local Museums', 'Cultural Centers'],
    Shop: ['Alun-Alun Markets', 'Local Shops'],
    'Hidden Gems': ['Local Coffee Roastery', 'Local Art Spots']
  },
  Banyuwangi: {
    Nature: ['Ijen Crater', 'Pulau Merah Beach', 'Blambangan Park', 'Secret Waterfalls'],
    Adventure: ['Ijen Crater Night Hike', 'Crater Hiking', 'Surfing at Beach'],
    Culinary: ['Coffee Plantations', 'Local Markets', 'Seafood Restaurants'],
    Cultural: ['Fishing Villages', 'Traditional Communities', 'Local Markets'],
    Shop: ['Local Art Markets', 'Handmade Crafts', 'Souvenir Shops'],
    Educational: ['Coffee Plantation Tours', 'Geological Learning'],
    Popular: ['Ijen Crater', 'Pulau Merah Beach'],
    Historical: ['Old Markets', 'Traditional Sites'],
    'Hidden Gems': ['Secret Waterfalls', 'Viewpoints', 'Remote Beaches']
  },
  Jember: {
    Nature: ['Papuma Beach', 'Waterfalls Trek', 'Coastal Trails', 'Secret Waterfalls'],
    Culinary: ['Coffee Plantation Tours', 'Local Markets', 'Coffee Roastery', 'Street Food'],
    Cultural: ['Jember Fashion Carnaval Area', 'Coastal Villages', 'Local Communities'],
    Adventure: ['Waterfalls Trek', 'Hiking Tours', 'Beach Activities'],
    Popular: ['Papuma Beach', 'Fashion Carnaval Area'],
    Educational: ['Coffee Roastery Tours', 'Cultural Centers'],
    Shop: ['Local Markets', 'Craft Shops'],
    Historical: ['Old Markets', 'Heritage Sites'],
    'Hidden Gems': ['Beach Sunset Spots', 'Remote Waterfalls']
  },
  Sidoarjo: {
    Educational: ['Lumpur Sidoarjo Viewpoint', 'Geological Site', 'Learning Centers'],
    Culinary: ['Sambu Street Market', 'Local Restaurants', 'Street Food Market'],
    Nature: ['Bumi Perkemahan', 'Nature Walks', 'Park Areas'],
    Cultural: ['Market Exploration', 'Cultural Centers', 'Local Communities'],
    Historical: ['Industrial Heritage Tour', 'Old Sites', 'Museum'],
    Popular: ['Lumpur Sidoarjo', 'City Center'],
    Shop: ['Sambu Market', 'Local Shops'],
    Adventure: ['Nature Walks', 'Hiking Trails'],
    'Hidden Gems': ['Photography Tours', 'Unique Spots']
  },
  Batu: {
    Adventure: ['Paralayang Batu', 'Mountain Trekking', 'Batu Night Spectacular', 'Paragliding'],
    Educational: ['Batu Secret Zoo', 'Wildlife Encounters', 'Learning Centers'],
    Popular: ['Selecta Park', 'Batu Secret Zoo', 'City Center'],
    Culinary: ['Strawberry Picking', 'Local Cafes', 'Apple Pie Shops', 'Street Food'],
    Shop: ['Cultural Markets', 'Craft Shops', 'Souvenir Stores'],
    Nature: ['Mountain Views', 'Highland Trails', 'Forest Parks'],
    Cultural: ['Local Markets', 'Cultural Centers'],
    Historical: ['Heritage Sites', 'Old Areas'],
    'Hidden Gems': ['Viewpoint Sunset', 'Secret Spots', 'Local Art Areas']
  }
};

const KNOWN_CITIES = Object.keys(CITY_ATTRACTIONS_BY_THEME);

const CITY_HOTELS = {
  Surabaya: 'Hotel Majapahit Surabaya',
  Malang: 'Hotel Santika Malang',
  Probolinggo: 'Hotel Bromo Permai Probolinggo',
  Pasuruan: 'Grand Whiz Hotel Pasuruan',
  Madiun: 'Hotel Madiun Permai',
  Banyuwangi: 'Ketapang Indah Hotel Banyuwangi',
  Jember: 'Hotel Lotus Jember',
  Sidoarjo: 'Grand Sae Sidoarjo',
  Batu: 'Jiwa Jawa Resort Batu'
};

const CITY_TIPS = {
  Surabaya: [
    'Start early to avoid traffic in the city center',
    'Visit attractions in the morning when less crowded',
    'Try local coffee at traditional kopi shops',
    'Bring sunscreen for outdoor attractions'
  ],
  Malang: [
    'Wear warm clothes as Malang is cooler in the evening',
    'Visit Coban Rondo Waterfall early morning for best photos',
    'Try the local apple tea at cafes',
    'Book attractions in advance during weekends'
  ],
  Probolinggo: [
    'Wake up very early for Bromo sunrise (3-4 AM)',
    'Wear layers as it gets cold at higher elevation',
    'Bring a mask for the volcanic dust',
    'Hire a local guide for the best experience'
  ],
  Pasuruan: [
    'Allow extra time for mountain roads',
    'Stay hydrated at high altitude locations',
    'Pack light rain jacket as weather changes quickly',
    'Respect local cultural sites and dress appropriately'
  ],
  Madiun: [
    'Try Pecel Madiun at local warungs',
    'Visit Alun-Alun in the morning for a relaxed walk',
    'Bring cash for small markets',
    'Ask locals for recommended snack spots'
  ],
  Banyuwangi: [
    'Visit Ijen Crater before sunrise for blue fire phenomenon',
    'Bring plenty of water and electrolyte drinks',
    'Hire experienced guides for crater hikes',
    'Take malaria prevention precautions'
  ],
  Jember: [
    'Best time to visit is during dry season',
    'Sample local coffee at plantation tours',
    'Wear comfortable hiking shoes',
    'Bring insect repellent for outdoor activities'
  ],
  Sidoarjo: [
    'Visit early morning to avoid afternoon heat',
    'Bring camera for unique photo opportunities',
    'Check weather before visiting outdoor sites',
    'Respect restricted areas and follow local guidelines'
  ],
  Batu: [
    'Dress warmly as Batu is in highland area',
    'Visit attractions early to avoid crowds',
    'Try local strawberry products',
    'Bring warm blanket if staying overnight'
  ]
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get attractions for a city filtered by themes/preferences
function getAttractionsForCityByTheme(city, themes = []) {
  const cityAttrs = CITY_ATTRACTIONS_BY_THEME[city] || {};
  
  if (themes.length === 0) {
    // Return all attractions if no theme specified
    return Object.values(cityAttrs).flat();
  }

  const attractions = [];
  for (const theme of themes) {
    if (cityAttrs[theme]) {
      attractions.push(...cityAttrs[theme]);
    }
  }
  return attractions;
}

// Pick N unique attractions for a city based on themes
function pickAttractionsForCity(city, themes = [], n = 2) {
  const attractions = getAttractionsForCityByTheme(city, themes);
  if (attractions.length === 0) {
    return [`${city} Attraction 1`, `${city} Attraction 2`].slice(0, n);
  }
  const shuffled = shuffleArray(attractions);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// Mock fallback data generator
const generateMockRoute = (startPoint, duration, transportMode) => {
  const durationNum = Math.max(1, parseInt(duration || '1', 10));
  return {
    title: `${duration}-Day East Java Adventure from ${startPoint}`,
    summary: `Explore the best of East Java starting from ${startPoint} using ${transportMode}.`,
    days: Array.from({ length: durationNum }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Exploration`,
      locations: [`${startPoint}`],
      activities: ['Explore local attractions', 'Take photos', 'Try local food'],
      hotel: CITY_HOTELS[startPoint] || 'Hotel TBD',
      food: ['Local Cuisine'],
      notes: ['Enjoy the experience', 'Respect local customs']
    })),
    totalBudget: `Rp ${durationNum * 1200000} - Rp ${durationNum * 1800000}`,
    tips: ['Bring water', 'Respect local customs', 'Book in advance', 'Hire a guide']
  };
};

function normalizeLocations(parsedData, startPoint, preferences = []) {
  const usedAttractions = new Set();

  function detectCity(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const c of KNOWN_CITIES) {
      if (lower.includes(c.toLowerCase())) return c;
    }
    return null;
  }

  const startCityDetected = detectCity(startPoint);

  // Build city order: startCity first, then others shuffled
  const cityOrder = [];
  if (startCityDetected) cityOrder.push(startCityDetected);

  const otherCities = KNOWN_CITIES.filter(c => c !== startCityDetected);
  const shuffledOtherCities = shuffleArray(otherCities);
  cityOrder.push(...shuffledOtherCities);

  const daysList = Array.isArray(parsedData.days) ? parsedData.days : [];

  const days = daysList.map((dayObj, idx) => {
    const city = cityOrder[idx % cityOrder.length] || cityOrder[0];
    
    // Get attractions matching user preferences
    const attractions = getAttractionsForCityByTheme(city, preferences);
    const candidates = attractions.filter(a => !usedAttractions.has(`${city}::${a}`));
    const fill = [];
    for (const a of attractions) {
      if (!candidates.includes(a) && fill.length + candidates.length < 2) fill.push(a);
    }
    const picks = candidates.concat(fill).slice(0, 2);
    picks.forEach(p => usedAttractions.add(`${city}::${p}`));

    const [loc1, loc2] = picks.length > 0 ? picks : [`${city} Attraction 1`, `${city} Attraction 2`];
    const normalizedLocation = `${city}, ${loc1 || 'Local Attraction'}, ${loc2 || 'Local Attraction'}`;

    const newDay = { ...dayObj };
    newDay.locations = [normalizedLocation];
    newDay.hotel = CITY_HOTELS[city] || newDay.hotel || 'Hotel TBD';

    // Set activities based on the actual locations in this city
    const cityActivitiesForTheme = getAttractionsForCityByTheme(city, preferences);
    if (!Array.isArray(newDay.activities) || newDay.activities.length === 0) {
      newDay.activities = cityActivitiesForTheme.slice(0, 3);
    } else {
      const merged = [...cityActivitiesForTheme.slice(0, 2)];
      for (const a of newDay.activities) {
        if (a && !merged.includes(a) && merged.length < 4) merged.push(a);
      }
      newDay.activities = merged.slice(0, 4);
    }

    newDay.notes = CITY_TIPS[city] || [
      'Enjoy the local attractions',
      'Try local cuisine',
      'Take photos and create memories'
    ];

    return newDay;
  });

  parsedData.days = days;
  return parsedData;
}

app.post('/api/generate-route', async (req, res) => {
  try {
    const { startPoint, duration, transportMode, destinationPreferences = [] } = req.body;
    console.log('Request received:', { startPoint, duration, transportMode, destinationPreferences });

    if (!startPoint || !duration || !transportMode) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // If no API key, return normalized mock data with preferences
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not set, returning mock data');
      const mockData = generateMockRoute(startPoint, duration, transportMode);
      const normalized = normalizeLocations(mockData, startPoint, destinationPreferences);
      return res.json({ success: true, data: normalized });
    }

    const systemPrompt = `You are an East Java travel itinerary expert. Return ONLY valid JSON (no extra text before or after).
Schema: {
  "title": "string (format: X-Day East Java Adventure from [StartPoint])",
  "summary": "string",
  "days": [
    {
      "day": number,
      "title": "string",
      "locations": ["string array of 1+ entries in format: City, location 1, location 2"],
      "activities": ["string array of 3-4 specific activities"],
      "hotel": "string",
      "food": ["string array of 2-3 real East Java dishes"],
      "notes": ["string array of 3-4 practical tips"]
    }
  ],
  "totalBudget": "string",
  "tips": ["string array"]
}

IMPORTANT:
- Each locations entry MUST be formatted as: City, location 1, location 2
- City must be one of: ${KNOWN_CITIES.join(', ')}
- Return ONLY JSON, no markdown or extra text`;

    const userPrompt = `Create a ${duration}-day East Java itinerary starting from ${startPoint} using ${transportMode}.
Destination Preferences: ${destinationPreferences.length > 0 ? destinationPreferences.join(', ') : 'No specific preferences'}
- Each day's locations should be formatted: "City, location 1, location 2"
- Day 1 City should be ${startPoint} if that is a known city
- Focus on ${destinationPreferences.length > 0 ? destinationPreferences.join(', ') : 'diverse'} attractions`;

    console.log('Calling Groq API');

    const message = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-70b-versatile',
      max_tokens: 2500,
      temperature: 0.25
    });

    const responseText = message.choices[0].message.content.trim();
    console.log('Raw response length:', responseText.length);

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
      console.log('Parsed JSON from model');
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                        responseText.match(/```([\s\S]*?)```/) ||
                        responseText.match(/({[\s\S]*})/);
      if (jsonMatch) {
        try {
          parsedData = JSON.parse(jsonMatch[1]);
          console.log('Parsed JSON after extracting wrapper');
        } catch (e) {
          console.error('Failed to parse extracted JSON:', e.message);
          parsedData = generateMockRoute(startPoint, duration, transportMode);
        }
      } else {
        parsedData = generateMockRoute(startPoint, duration, transportMode);
        console.log('Falling back to mock data');
      }
    }

    const normalized = normalizeLocations(parsedData, startPoint, destinationPreferences);

    if (!normalized.days || !Array.isArray(normalized.days) || normalized.days.length === 0) {
      const mockData = generateMockRoute(startPoint, duration, transportMode);
      const normalizedMock = normalizeLocations(mockData, startPoint, destinationPreferences);
      return res.json({ success: true, data: normalizedMock });
    }

    return res.json({ success: true, data: normalized });
  } catch (error) {
    console.error('Server error:', error);
    try {
      const { startPoint, duration, transportMode, destinationPreferences = [] } = req.body;
      const mockData = generateMockRoute(startPoint, duration, transportMode);
      const normalizedMock = normalizeLocations(mockData, startPoint, destinationPreferences);
      console.log('Returning mock data due to server error');
      return res.json({ success: true, data: normalizedMock });
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✓ Set' : '✗ NOT SET');
});