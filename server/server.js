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

// Attractions per city (East Java) - used to build "City, location1, location2"
const CITY_ATTRACTIONS = {
  Surabaya: [
    'House of Sampoerna',
    'Monumen Kapal Selam (Submarine Monument)',
    'Tunjungan Plaza',
    'Ampel Mosque',
    'Surabaya Zoo'
  ],
  Malang: [
    'Alun-Alun Malang',
    'Jawa Timur Park 2',
    'Coban Rondo Waterfall',
    'Batu Night Spectacular',
    'Museum Angkut'
  ],
  Probolinggo: [
    'Bromo Sunrise Point (Probolinggo access)',
    'Paiton Beach',
    'Probolinggo Old Market',
    'Air Terjun Kakek Bodo'
  ],
  Pasuruan: [
    'Bromo area (Pasuruan side)',
    'Wonosari Beach',
    'Grati Market'
  ],
  Madiun: [
    'Alun-Alun Madiun',
    'Madiun Old Market',
    'Taman Wilis',
    'Caruban Cultural Spot'
  ],
  Banyuwangi: [
    'Ijen Crater',
    'Pulau Merah Beach',
    'Blambangan Park'
  ],
  Jember: [
    'Papuma Beach',
    'Kawah Ijen (access from Jember)',
    'Jember Fashion Carnaval area'
  ],
  Sidoarjo: [
    'Lumpur Sidoarjo (mudflow area - view points)',
    'Sambu Street Market',
    'Bumi Perkemahan'
  ],
  Batu: [
    'Selecta Park',
    'Batu Secret Zoo',
    'Paralayang Batu'
  ]
};

const KNOWN_CITIES = Object.keys(CITY_ATTRACTIONS);

// Map each city to a representative hotel in that city
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

// Daily travel tips per city
const CITY_TIPS = {
  Surabaya: [
    'Start early to avoid traffic in the city center, ',
    'Visit House of Sampoerna in the morning when it\'s less crowded, ',
    'Try local coffee at traditional kopi shops, ',
    'Bring sunscreen for outdoor attractions'
  ],
  Malang: [
    'Wear warm clothes as Malang is cooler in the evening, ',
    'Visit Coban Rondo Waterfall early morning for best photos, ',
    'Try the local apple tea at cafes, ',
    'Book attractions in advance during weekends'
  ],
  Probolinggo: [
    'Wake up very early for Bromo sunrise (3-4 AM), ',
    'Wear layers as it gets cold at higher elevation, ',
    'Bring a mask for the volcanic dust, ',
    'Hire a local guide for the best experience'
  ],
  Pasuruan: [
    'Allow extra time for mountain roads, ',
    'Stay hydrated at high altitude locations, ',
    'Pack light rain jacket as weather changes quickly, ',
    'Respect local cultural sites and dress appropriately'
  ],
  Madiun: [
    'Try Pecel Madiun at local warungs, ',
    'Visit Alun-Alun in the morning for a relaxed walk, ',
    'Bring cash for small markets, ',
    'Ask locals for recommended snack spots'
  ],
  Banyuwangi: [
    'Visit Ijen Crater before sunrise for blue fire phenomenon, ',
    'Bring plenty of water and electrolyte drinks, ',
    'Hire experienced guides for crater hikes, ',
    'Take malaria prevention precautions'
  ],
  Jember: [
    'Best time to visit is during dry season, ',
    'Sample local coffee at plantation tours, ',
    'Wear comfortable hiking shoes, ',
    'Bring insect repellent for outdoor activities'
  ],
  Sidoarjo: [
    'Visit early morning to avoid afternoon heat, ',
    'Bring camera for unique photo opportunities, ',
    'Check weather before visiting outdoor sites, ',
    'Respect restricted areas and follow local guidelines'
  ],
  Batu: [
    'Dress warmly as Batu is in highland area, ',
    'Visit attractions early to avoid crowds, ',
    'Try local strawberry products, ',
    'Bring warm blanket if staying overnight'
  ]
};

// City-specific activity suggestions (unique per city)
const CITY_ACTIVITIES = {
  Surabaya: [
    'Guided walking tour of Old Town (Kota Tua) and House of Sampoerna',
    'Explore Monumen Kapal Selam and its museum display',
    'Street food crawl for Rawon and Rujak Cingur',
    'Coffee tasting at traditional warungs'
  ],
  Malang: [
    'Hike to Coban Rondo waterfall and visit the viewpoint',
    'Full-day at Jawa Timur Park 2 (family + museums)',
    'Stroll Alun-Alun Malang and try local cafes',
    'Evening visit to Batu Night Spectacular'
  ],
  Probolinggo: [
    'Sunrise jeep tour to Mount Bromo viewpoint',
    'Horse ride across the Sea of Sand at Bromo',
    'Visit Paiton Beach and local fishing villages',
    'Explore Probolinggo Old Market and local snacks'
  ],
  Pasuruan: [
    'Scenic drive around Bromo foothills on Pasuruan side',
    'Relax at Wonosari Beach and try seafood',
    'Explore Grati Market for traditional goods',
    'Short hikes to nearby viewpoints'
  ],
  Madiun: [
    'Stroll Alun-Alun Madiun and try street snacks',
    'Visit local markets to sample Pecel and gethuk',
    'Explore nearby cultural spots and small museums',
    'Try regional snacks and local coffee shops'
  ],
  Banyuwangi: [
    'Ijen Crater night hike for blue fire experience',
    'Surf or relax at Pulau Merah beach',
    'Wildlife watching in Blambangan National Park',
    'Visit coffee plantations for tasting sessions'
  ],
  Jember: [
    'Explore Papuma Beach and coastal trails',
    'Visit coffee plantations and sample single-origin brews',
    'See preparations and spots used in Jember Fashion Carnaval',
    'Short treks to nearby waterfalls'
  ],
  Sidoarjo: [
    'Observe mudflow sites from safe viewpoints',
    'Walk Sambu Street Market for local snacks',
    'Nature walks at nearby camping grounds',
    'Photograph industrial heritage and local markets'
  ],
  Batu: [
    'Visit Batu Secret Zoo and wildlife encounters',
    'Paragliding or viewpoint visit at Paralayang Batu',
    'Stroll Selecta Park and try strawberry picking',
    'Evening culinary walk at Batu city center'
  ]
};

// Mock fallback data generator (keeps basic structure)
const generateMockRoute = (startPoint, duration, transportMode) => {
  const durationNum = Math.max(1, parseInt(duration || '1', 10));
  return {
    title: `${duration}-Day East Java Adventure from ${startPoint}`,
    summary: `Explore the best of East Java starting from ${startPoint} using ${transportMode}. Experience natural landscapes and local culture.`,
    days: Array.from({ length: durationNum }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Exploration`,
      // placeholder locations - will be normalized later
      locations: [`${startPoint}`, `Local Attraction ${i + 1}a`, `Local Attraction ${i + 1}b`],
      activities: [
        `Visit and explore key sites`,
        'Take photos and enjoy scenery',
        'Try local food'
      ],
      hotel: 'Hotel TBD',
      food: ['Rawon', 'Bakso'],
      notes: [`Keep hydrated and enjoy local cuisine`, `Respect local customs and culture`]
    })),
    totalBudget: `Rp ${durationNum * 1200000} - Rp ${durationNum * 1800000}`,
    tips: [
      'Bring warm clothes for mountain areas',
      'Book accommodations in advance',
      'Try local street food',
      'Hire a local guide',
      'Download offline maps'
    ]
  };
};

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper: pick N unique activities for a city (fallback if not enough)
function pickActivitiesForCity(city, n = 3) {
  const pool = CITY_ACTIVITIES[city] || [];
  if (pool.length === 0) {
    return [
      'Explore local attractions',
      'Try local cuisine',
      'Take photos and relax'
    ].slice(0, n);
  }
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// Normalize locations into "City, location 1, location 2" and assign city-specific hotels & activities
function normalizeLocations(parsedData, startPoint) {
  const usedAttractions = new Set();

  function detectCity(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const c of KNOWN_CITIES) {
      if (lower.includes(c.toLowerCase())) return c;
    }
    return null;
  }

  function pickAttractionsForCity(city) {
    const pool = CITY_ATTRACTIONS[city] || [];
    // prefer unused attractions
    const candidates = pool.filter(a => !usedAttractions.has(`${city}::${a}`));
    // fill if not enough unique candidates
    const fill = [];
    for (const a of pool) {
      if (!candidates.includes(a) && fill.length + candidates.length < 2) fill.push(a);
    }
    const picks = candidates.concat(fill).slice(0, 2);
    picks.forEach(p => usedAttractions.add(`${city}::${p}`));
    return picks;
  }

  const startCityDetected = detectCity(startPoint);

  // build randomized city order: startCityDetected first (if present), then remaining cities shuffled
  const cityOrder = [];
  if (startCityDetected) cityOrder.push(startCityDetected);

  const otherCities = KNOWN_CITIES.filter(c => c !== startCityDetected);
  const shuffledOtherCities = shuffleArray(otherCities);
  cityOrder.push(...shuffledOtherCities);

  // ensure days exist
  const daysList = Array.isArray(parsedData.days) ? parsedData.days : [];

  const days = daysList.map((dayObj, idx) => {
    const city = cityOrder[idx % cityOrder.length] || cityOrder[0];
    const [loc1, loc2] = pickAttractionsForCity(city);
    const normalizedLocation = `${city}, ${loc1 || 'Local Attraction'}, ${loc2 || 'Local Attraction'}`;

    const newDay = { ...dayObj };
    newDay.locations = [normalizedLocation];

    // set hotel for the city
    newDay.hotel = CITY_HOTELS[city] || newDay.hotel || 'Hotel TBD';

    // set city-specific activities if missing or to improve relevance
    const cityActivities = pickActivitiesForCity(city, 3);
    if (!Array.isArray(newDay.activities) || newDay.activities.length === 0) {
      newDay.activities = cityActivities;
    } else {
      // merge AI activities with city-specific ones, preferring city-specific and keeping unique items up to 4
      const merged = [...cityActivities];
      for (const a of newDay.activities) {
        if (a && !merged.includes(a) && merged.length < 4) merged.push(a);
      }
      newDay.activities = merged.slice(0, 4);
    }

    // set multiple city-specific tips for notes
    const cityTips = CITY_TIPS[city] || [
      'Enjoy the local attractions',
      'Try local cuisine',
      'Take photos and create memories'
    ];
    newDay.notes = cityTips;

    return newDay;
  });

  parsedData.days = days;
  return parsedData;
}

app.post('/api/generate-route', async (req, res) => {
  try {
    const { startPoint, duration, transportMode } = req.body;
    console.log('Request received:', { startPoint, duration, transportMode });

    if (!startPoint || !duration || !transportMode) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // If no API key, immediately return normalized mock data
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not set, returning mock data');
      const mockData = generateMockRoute(startPoint, duration, transportMode);
      const normalized = normalizeLocations(mockData, startPoint);
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
      "activities": ["string array of 3-4 specific activities to do on this day"],
      "hotel": "string",
      "food": ["string array of 2-3 real East Java dishes to try"],
      "notes": ["string array of 3-4 practical tips and advice for this day"]
    }
  ],
  "totalBudget": "string",
  "tips": ["string array"]
}

IMPORTANT:
- Each locations entry MUST be formatted exactly as: City, location 1, location 2
- City must be one of: ${KNOWN_CITIES.join(', ')}
- location 1 and location 2 must be attractions inside that City
- notes MUST be an array of 3-4 practical tips (not a single string)
- For Day 1, use the user's provided startPoint as the City when startPoint matches one of the allowed cities (case-insensitive)
- Return ONLY JSON, no markdown or extra text`;

    const userPrompt = `Create a ${duration}-day East Java itinerary starting from ${startPoint} using ${transportMode}.
Requirements:
- Return JSON following the schema above.
- Each day's locations array should contain one entry formatted exactly: "City, location 1, location 2".
- Day 1 City should be ${startPoint} if that is a known city.
- Activities must be specific actions (e.g., "Hike to viewpoint at sunrise", "Visit temple and guided tour").
- notes MUST be an array of 3-4 practical tips for that specific day and city.`;

    console.log('Calling Groq API with model: llama-3.1-70b-versatile');

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
    console.log('Response preview:', responseText.substring(0, 400));

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
      console.log('Parsed JSON from model');
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      // attempt to extract JSON if wrapped
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
          console.log('Falling back to mock data due to parse failures');
        }
      } else {
        parsedData = generateMockRoute(startPoint, duration, transportMode);
        console.log('Falling back to mock data (no JSON found)');
      }
    }

    const normalized = normalizeLocations(parsedData, startPoint);

    if (!normalized.days || !Array.isArray(normalized.days) || normalized.days.length === 0) {
      const mockData = generateMockRoute(startPoint, duration, transportMode);
      const normalizedMock = normalizeLocations(mockData, startPoint);
      return res.json({ success: true, data: normalizedMock });
    }

    return res.json({ success: true, data: normalized });
  } catch (error) {
    console.error('Server error:', error);
    // if ai gets an error, munculin mock data
    try {
      const { startPoint, duration, transportMode } = req.body;
      const mockData = generateMockRoute(startPoint, duration, transportMode);
      const normalizedMock = normalizeLocations(mockData, startPoint);
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