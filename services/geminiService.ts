import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TripPlan, TransportMode } from "../types";

/**
 * Robustly retrieves and sanitizes the API Key.
 */
const getSanitizedApiKey = (): string => {
  let key = '';
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY;
    }
  } catch (e) {}

  if (!key && typeof process !== 'undefined' && process.env) {
    if (process.env.REACT_APP_API_KEY) key = process.env.REACT_APP_API_KEY;
    else if (process.env.API_KEY) key = process.env.API_KEY;
  }

  if (!key) return '';
  key = key.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.substring(1, key.length - 1);
  }
  return key;
};

const API_KEY = getSanitizedApiKey();
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// --- MOCK DATA GENERATOR FOR DEMO MODE ---
export const getMockTripPlan = (source: string, destination: string, days: number): TripPlan => {
  return {
    source: source,
    destination: destination,
    distanceKm: 450,
    bestTimeToVisit: "October to March",
    summary: `(DEMO MODE) A curated journey through ${destination}, featuring a perfect mix of heritage, culture, and modern vibes. Note: This is a sample itinerary because no valid API key was found.`,
    transportOptions: [
      { mode: TransportMode.TRAIN, providerName: "Shatabdi Express", duration: "5h 30m", cost: 1200, description: "Fast & Comfortable AC Chair Car" },
      { mode: TransportMode.BUS, providerName: "Volvo AC Sleeper", duration: "7h", cost: 900, description: "Overnight luxury bus option" },
      { mode: TransportMode.FLIGHT, providerName: "IndiGo", duration: "1h 10m", cost: 4500, description: "Quickest way to reach" }
    ],
    placesToVisit: [
      { name: `City Palace, ${destination}`, category: "Historical", distance: "Center", description: "A magnificent complex of courtyards, gardens, and buildings.", estimatedEntryCost: 500 },
      { name: "Local Art Bazaar", category: "Shopping", distance: "2 km", description: "Famous for handicrafts and traditional fabrics.", estimatedEntryCost: 0 },
      { name: "Sunset Fort Point", category: "Nature", distance: "8 km", description: "Best panoramic views of the city during golden hour.", estimatedEntryCost: 100 },
      { name: "Royal Museum", category: "Historical", distance: "4 km", description: "Ancient artifacts and royal costumes on display.", estimatedEntryCost: 250 },
      { name: "Hidden Stepwell", category: "Hidden Gem", distance: "15 km", description: "An architectural marvel often missed by tourists.", estimatedEntryCost: 0 }
    ],
    diningOptions: [
      { name: "The Rooftop Story", cuisine: "Fusion/Cafe", costPerPerson: 600, vibe: "Romantic/Aesthetic", description: "Perfect for couples with stunning city views.", mustTryDish: "Truffle Pasta" },
      { name: "Sharma Ji Ki Chaat", cuisine: "Street Food", costPerPerson: 100, vibe: "Street Food", description: "Legendary local flavors, very hygienic.", mustTryDish: "Aloo Tikki" },
      { name: "Boho Beans", cuisine: "Coffee", costPerPerson: 350, vibe: "Instagrammable", description: "A cozy aesthetic corner for photography.", mustTryDish: "Hazelnut Latte" }
    ],
    stayOptions: [
      { name: "The Backpacker's Nest", type: "Hostel", pricePerNight: 800, rating: 4.5, location: "City Center", features: ["Free WiFi", "Social Events"] },
      { name: "Heritage Haveli", type: "Hotel", pricePerNight: 3500, rating: 4.3, location: "Old City", features: ["Pool", "Breakfast"] },
      { name: "Grand Resort", type: "Resort", pricePerNight: 8000, rating: 4.8, location: "Outskirts", features: ["Luxury Spa", "Private Villa"] }
    ],
    estimatedFoodCostPerDay: 800,
    localTravelCostEstimate: 600,
    itinerary: [
      {
        dayNumber: 1,
        theme: "Arrival, Heritage & Sunsets",
        activities: [
          { timeSlot: "Morning", title: "Arrival & Check-in", description: "Arrive, check into your hostel/hotel and freshen up.", type: "Travel" },
          { timeSlot: "Afternoon", title: "City Palace Exploration", description: "Visit the magnificent City Palace.", type: "Place", relatedPlaceName: `City Palace, ${destination}` },
          { timeSlot: "Evening", title: "Sunset at Fort Point", description: "Witness the golden hour hues.", type: "Place", relatedPlaceName: "Sunset Fort Point" },
          { timeSlot: "Night", title: "Dinner at Boho Beans", description: "Enjoy aesthetic vibes and Hazelnut Latte.", type: "Food", relatedPlaceName: "Boho Beans" }
        ],
        estimatedDailyExpense: { food: 500, travel: 150, activities: 500 }
      },
      {
        dayNumber: 2,
        theme: "Markets & Hidden Secrets",
        activities: [
          { timeSlot: "Morning", title: "Hidden Stepwell", description: "Early morning photography at the stepwell.", type: "Place", relatedPlaceName: "Hidden Stepwell" },
          { timeSlot: "Afternoon", title: "Royal Museum", description: "Dive into history at the museum.", type: "Place", relatedPlaceName: "Royal Museum" },
          { timeSlot: "Evening", title: "Local Art Bazaar", description: "Shop for souvenirs and local crafts.", type: "Place", relatedPlaceName: "Local Art Bazaar" },
          { timeSlot: "Night", title: "Street Food Crawl", description: "Try Aloo Tikki at Sharma Ji Ki Chaat.", type: "Food", relatedPlaceName: "Sharma Ji Ki Chaat" }
        ],
        estimatedDailyExpense: { food: 300, travel: 200, activities: 250 }
      }
    ]
  };
};

const tripPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    source: { type: Type.STRING },
    destination: { type: Type.STRING },
    distanceKm: { type: Type.NUMBER, description: "Approximate distance in KM" },
    bestTimeToVisit: { type: Type.STRING },
    summary: { type: Type.STRING, description: "A short, inspiring summary of the trip" },
    transportOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: ["Bus", "Train", "Flight", "Cab"] },
          providerName: { type: Type.STRING },
          duration: { type: Type.STRING },
          cost: { type: Type.NUMBER, description: "Cost in INR per person" },
          description: { type: Type.STRING },
        },
        required: ["mode", "cost", "duration", "providerName"],
      },
    },
    placesToVisit: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Historical', 'Nature', 'Religious', 'Adventure', 'Leisure', 'Hidden Gem', 'Shopping'] },
          distance: { type: Type.STRING, description: "Distance from main city center" },
          description: { type: Type.STRING },
          estimatedEntryCost: { type: Type.NUMBER, description: "Entry fee in INR (0 if free)" },
        },
        required: ["name", "category", "distance"],
      },
    },
    diningOptions: {
      type: Type.ARRAY,
      description: "List of spots including Aesthetic Cafes (for photos/couples) AND Budget Street Food",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          cuisine: { type: Type.STRING },
          costPerPerson: { type: Type.NUMBER, description: "Cost per person" },
          vibe: { type: Type.STRING, description: "e.g., 'Romantic/Aesthetic', 'Rooftop', 'Street Food', 'Instagrammable'" },
          description: { type: Type.STRING, description: "Highlight if good for couples or photos" },
          mustTryDish: { type: Type.STRING },
        },
        required: ["name", "vibe", "mustTryDish"],
      },
    },
    stayOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Hotel', 'Hostel', 'Resort', 'Lodge'] },
          pricePerNight: { type: Type.NUMBER, description: "Cost in INR per night" },
          rating: { type: Type.NUMBER },
          location: { type: Type.STRING },
          features: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "pricePerNight", "type"],
      },
    },
    estimatedFoodCostPerDay: { type: Type.NUMBER, description: "Strictly BUDGET estimate for 3 meals (street food/dhaba prices only). Do NOT include expensive cafe costs here." },
    localTravelCostEstimate: { type: Type.NUMBER, description: "Estimated total local travel cost (cabs/autos/buses) for the whole trip in INR" },
    itinerary: {
      type: Type.ARRAY,
      description: "Day-wise detailed itinerary",
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.NUMBER },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeSlot: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening", "Night"] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Place", "Food", "Travel", "Leisure"] },
                relatedPlaceName: { type: Type.STRING, description: "Exact name of a place or dining spot from the lists above, if applicable." }
              },
              required: ["timeSlot", "title", "description", "type"]
            }
          },
          estimatedDailyExpense: {
            type: Type.OBJECT,
            properties: {
              food: { type: Type.NUMBER },
              travel: { type: Type.NUMBER },
              activities: { type: Type.NUMBER }
            },
            required: ["food", "travel", "activities"]
          }
        },
        required: ["dayNumber", "theme", "activities", "estimatedDailyExpense"]
      }
    }
  },
  required: ["source", "destination", "transportOptions", "placesToVisit", "diningOptions", "stayOptions", "estimatedFoodCostPerDay", "itinerary"],
};

export const generateTripPlan = async (source: string, destination: string, days: number): Promise<TripPlan> => {
  // If no API key is present at all, throw specific error to trigger demo mode
  if (!API_KEY || !ai) {
    throw new Error("NO_API_KEY");
  }

  const prompt = `
    Act as an expert Indian Travel Agent specializing in BUDGET BACKPACKING and COUPLE TRIPS. Plan a trip from ${source} to ${destination} for ${days} days.
    
    CRITICAL INSTRUCTION: You MUST use REAL, EXISTING names. 
    GOAL: Create a mix of Aesthetic experiences (for photos) and Budget living (for saving money).
    
    Requirements:
    1. Transport: 3-4 options. Focus on Budget trains (Sleeper/3AC) and Buses.
    2. Places: Provide a COMPREHENSIVE list (Total 15-20 places). 
       - 8-10 Top Tourist Attractions.
       - 3-4 Hidden Gems.
       - 4 Best Local Markets.
    3. Food: Suggest 5 spots. 
       - 3 spots MUST be "Aesthetic Cafes" suitable for couples and photography (Instagrammable). Mention "Perfect for couples" or "Photogenic" in description.
       - 2 spots MUST be "Legendary Street Food" for cheap eats.
    4. Stays: Suggest 5 options sorted by price (Low to High). Start with dirt-cheap hostels/dorms.
    5. Costs: 
       - Food Estimate: AGGRESSIVELY LOW. Assume the user eats street food for sustenance and only visits cafes for photos/coffee. Calculate daily cost based on street food prices (approx 500-800 INR/day). Do NOT add full cafe meal prices to the daily estimate.
       - Travel: Assume public transport.
    6. Itinerary: Create a detailed DAY-WISE itinerary for ALL ${days} days.
       - Balance locations smartly based on distance and timing (nearby places on the same day).
       - Include Morning, Afternoon, Evening, and Night slots.
       - Provide day-wise estimated expense (food, travel, activities).
    
    Ensure the response is valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: tripPlanSchema,
        temperature: 0.4,
      },
    });

    let text = response.text;
    if (!text) throw new Error("No data received from AI");
    text = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(text) as TripPlan;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for specific API Key errors to trigger demo mode in UI
    const errorStr = JSON.stringify(error);
    if (
      errorStr.includes("API_KEY_INVALID") || 
      errorStr.includes("API key not valid") || 
      errorStr.includes("PERMISSION_DENIED") ||
      error.message === "NO_API_KEY"
    ) {
      throw new Error("API_KEY_ERROR");
    }
    
    throw error;
  }
};