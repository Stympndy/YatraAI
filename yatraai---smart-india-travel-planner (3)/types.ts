export enum TransportMode {
  BUS = 'Bus',
  TRAIN = 'Train',
  FLIGHT = 'Flight',
  CAB = 'Cab'
}

export interface TransportOption {
  mode: TransportMode;
  providerName: string;
  duration: string;
  cost: number;
  description: string;
}

export interface Place {
  name: string;
  category: 'Historical' | 'Nature' | 'Religious' | 'Adventure' | 'Leisure' | 'Hidden Gem' | 'Shopping';
  distance: string;
  description: string;
  estimatedEntryCost: number;
}

export interface DiningSpot {
  name: string;
  cuisine: string;
  costPerPerson: number;
  vibe: string; // e.g., "Boho", "Rooftop", "Traditional"
  description: string;
  mustTryDish: string;
}

export interface Stay {
  name: string;
  type: 'Hotel' | 'Hostel' | 'Resort' | 'Lodge';
  pricePerNight: number;
  rating: number;
  location: string;
  features: string[];
}

export interface TripPlan {
  source: string;
  destination: string;
  distanceKm: number;
  bestTimeToVisit: string;
  transportOptions: TransportOption[];
  placesToVisit: Place[];
  diningOptions: DiningSpot[]; // New field for cafes/restaurants
  stayOptions: Stay[];
  itinerary: ItineraryDay[]; // NEW day-wise itinerary
  estimatedFoodCostPerDay: number;
  localTravelCostEstimate: number;
  summary: string;
}

// --- NEW Itinerary Types ---
export interface ItineraryActivity {
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  title: string;
  description: string;
  type: 'Place' | 'Food' | 'Travel' | 'Leisure';
  relatedPlaceName?: string; // Links to placesToVisit or diningOptions
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  activities: ItineraryActivity[];
  estimatedDailyExpense: {
    food: number;
    travel: number;
    activities: number;
  };
}

export interface UserInput {
  source: string;
  destination: string;
  travelers: number;
  days: number;
}