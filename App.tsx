import React, { useState } from 'react';
import { TripPlan, TransportOption, Stay } from './types';
import { generateTripPlan, getMockTripPlan } from './services/geminiService';
import ExpenseCalculator from './components/ExpenseCalculator';
import TransportCard from './components/TransportCard';
import LoginPage from './components/LoginPage';
import Itinerary from './components/Itinerary';
import { CityAutocomplete } from './components/CityAutocomplete';
import { WeatherAndPacking } from './components/WeatherAndPacking';
import { 
  MapPin, Calendar, Users, ArrowRight, Loader2, Info, Star, 
  Map, Hotel, Navigation, Coffee, Camera, CheckCircle2, ChevronRight, ChevronLeft,
  Utensils, ExternalLink, ShoppingBag, Heart, AlertTriangle, PlayCircle
} from 'lucide-react';

const App: React.FC = () => {
  // --- Global State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // --- Search Input State ---
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number>(3);
  const [travelers, setTravelers] = useState<number>(2);

  // --- Planner Data State ---
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // --- Wizard/Stepper State ---
  // Steps: 0: Input, 1: Explore(Places/Food), 2: Transport, 3: Stay, 4: Budget
  const [currentStep, setCurrentStep] = useState(0);

  // --- Selection State ---
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);

  // --- Helpers ---
  const getRealPhotoUrl = (query: string) => {
    return `https://tse4.mm.bing.net/th?q=${encodeURIComponent(query + ' india travel')}&w=800&h=600&c=7&rs=1&p=0`;
  };

  const openInMaps = (name: string) => {
    const query = encodeURIComponent(`${name}, ${plan?.destination || 'India'}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleSaveItineraryPdf = () => {
    if (!plan) return;
    const transportCost = selectedTransport ? selectedTransport.cost : (plan.transportOptions[0]?.cost || 0);
    const stayCost = selectedStay ? selectedStay.pricePerNight : (plan.stayOptions[0]?.pricePerNight || 0);
    const totalTransport = transportCost * travelers * 2;
    const totalStay = stayCost * days * Math.ceil(travelers / 2);
    const totalFood = plan.estimatedFoodCostPerDay * days * travelers;
    const totalLocalTravel = plan.localTravelCostEstimate;
    const buffer = 1000;
    const grandTotal = totalTransport + totalStay + totalFood + totalLocalTravel + buffer;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert("Please allow popups."); return; }
    printWindow.document.write(generatePdfContent(plan, transportCost, stayCost, totalTransport, totalStay, totalFood, totalLocalTravel, buffer, grandTotal));
    printWindow.document.close();
  };

  const generatePdfContent = (plan: TripPlan, transportCost: number, stayCost: number, totalTransport: number, totalStay: number, totalFood: number, totalLocalTravel: number, buffer: number, grandTotal: number): string => {
    const destLower = plan.destination.toLowerCase();
    let weatherAdvice = "Versatile casual wear and comfortable walking shoes.";
    let weatherTemp = "26°C / 17°C";
    
    if (destLower.includes('goa') || destLower.includes('kerala') || destLower.includes('mumbai')) {
      weatherAdvice = "Light cotton clothes, beachwear, and sunscreen.";
      weatherTemp = "32°C / 24°C";
    } else if (destLower.includes('shimla') || destLower.includes('manali') || destLower.includes('leh')) {
      weatherAdvice = "Heavy woolens, thermal layers, and warm jackets.";
      weatherTemp = "12°C / 2°C";
    } else if (destLower.includes('jaipur') || destLower.includes('delhi')) {
      weatherAdvice = "Breathable cotton garments and sun protection.";
      weatherTemp = "30°C / 18°C";
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>YatraAI_Itinerary_${plan.source}_to_${plan.destination}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .brand-title { font-size: 28px; font-weight: 800; color: #ea580c; margin: 0; }
            .tagline { font-size: 14px; color: #64748b; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
            h2 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; font-size: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
            th { background: #f1f5f9; }
            .day-box { margin-bottom: 25px; border-left: 4px solid #f97316; padding-left: 20px; break-inside: avoid; }
            .total-row { font-weight: bold; background: #fff7ed; color: #9a3412; }
            .weather-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand-title">YatraAI</h1>
              <div class="tagline">Smart India Travel Planner</div>
            </div>
            <div style="text-align: right">
              <div style="font-size: 18px; font-weight: 700;">${plan.source} ➔ ${plan.destination}</div>
              <div style="color: #64748b;">${travelers} Travelers • ${days} Days Trip</div>
            </div>
          </div>

          <div class="card">
            <div style="margin-bottom: 10px;"><span class="weather-badge">Weather Forecast: ${weatherTemp}</span></div>
            <p><strong>Trip Summary:</strong> ${plan.summary}</p>
            <p><strong>Packing Advice:</strong> ${weatherAdvice}</p>
          </div>

          <h2>Detailed Budget Estimate</h2>
          <table>
            <thead>
              <tr><th>Category</th><th>Description</th><th>Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>Travel</td><td>Round Trip for ${travelers} Travelers</td><td>₹${totalTransport.toLocaleString()}</td></tr>
              <tr><td>Stay</td><td>Accommodation for ${days} Nights</td><td>₹${totalStay.toLocaleString()}</td></tr>
              <tr><td>Food</td><td>Estimated Food & Drinks</td><td>₹${totalFood.toLocaleString()}</td></tr>
              <tr><td>Local Travel</td><td>Sightseeing & Local Commute</td><td>₹${totalLocalTravel.toLocaleString()}</td></tr>
              <tr><td>Buffer</td><td>Emergency Margin</td><td>₹${buffer.toLocaleString()}</td></tr>
              <tr class="total-row"><td colspan="2">Grand Total Estimate</td><td>₹${grandTotal.toLocaleString()}</td></tr>
            </tbody>
          </table>

          <h2>Day-by-Day Itinerary</h2>
          ${plan.itinerary.map(day => `
            <div class="day-box">
              <h3 style="margin: 0 0 10px 0; color: #ea580c;">Day ${day.dayNumber}: ${day.theme}</h3>
              ${day.activities.map(act => `
                <div style="margin-bottom: 10px;">
                  <strong>${act.timeSlot}:</strong> ${act.title}
                  <div style="font-size: 13px; color: #475569; margin-top: 2px;">${act.description}</div>
                </div>
              `).join('')}
            </div>
          `).join('')}

          <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
            Generated by YatraAI - Your Personal Indian Travel Companion. Have a safe journey!
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
  };

  // --- Handlers ---
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) return;

    setLoading(true);
    setError(null);
    setPlan(null);
    setIsDemoMode(false);

    try {
      const result = await generateTripPlan(source, destination, days);
      setPlan(result);
      if (result.transportOptions.length > 0) setSelectedTransport(result.transportOptions[0]);
      if (result.stayOptions.length > 0) setSelectedStay(result.stayOptions[0]);
      setCurrentStep(1);
    } catch (err: any) {
      console.error("UI Caught Error:", err);
      
      // Fallback to Demo Mode on API Key failure
      if (err.message === "API_KEY_ERROR" || err.message === "NO_API_KEY" || err.message.includes("API key")) {
        const mockPlan = getMockTripPlan(source, destination, days);
        setPlan(mockPlan);
        setIsDemoMode(true);
        if (mockPlan.transportOptions.length > 0) setSelectedTransport(mockPlan.transportOptions[0]);
        if (mockPlan.stayOptions.length > 0) setSelectedStay(mockPlan.stayOptions[0]);
        setCurrentStep(1);
      } else {
        setError("Failed to generate plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // --- Render Functions ---

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. Search View (Step 0)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        {/* Navbar */}
        <nav className="absolute top-0 w-full p-6 z-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg"><Navigation size={20} /></div>
            <span className="text-xl font-bold">YatraAI</span>
          </div>
        </nav>

        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-slate-900/90 z-10" />
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1532664189809-02133fe698d3?auto=format&fit=crop&q=80")', backgroundSize: 'cover' }}
        />

        <div className="relative z-20 max-w-4xl mx-auto px-4 h-screen flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              Discover the Soul of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">India</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              From aesthetic cafes in bustling cities to hidden gems in the mountains. Plan your entire experience in one click.
            </p>
          </div>

          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CityAutocomplete 
                label="From" 
                placeholder="City (e.g., Delhi)" 
                value={source} 
                onChange={setSource}
                disabledCity={destination}
              />
              <CityAutocomplete 
                label="To" 
                placeholder="Destination (e.g., Goa)" 
                value={destination} 
                onChange={setDestination}
                disabledCity={source}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-slate-300 uppercase font-bold ml-1 mb-1 block">Duration</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <select 
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                  >
                    {[2,3,4,5,7,10,14].map(d => <option key={d} value={d}>{d} Days</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-300 uppercase font-bold ml-1 mb-1 block">Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <><Loader2 className="animate-spin" /> Curating Experience...</> : <>Plan My Trip <ArrowRight size={20} /></>}
            </button>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-100 flex items-start gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
              <AlertTriangle className="shrink-0 text-red-400 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-red-300 mb-1">Planning Failed</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- WIZARD RENDERERS ---

  const renderStepper = () => (
    <div className="max-w-4xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
        {[
          { id: 1, label: 'Itinerary', icon: Calendar },
          { id: 2, label: 'Travel', icon: Navigation },
          { id: 3, label: 'Stay', icon: Hotel },
          { id: 4, label: 'Budget', icon: Info },
        ].map((step) => (
          <div key={step.id} className={`flex flex-col items-center bg-slate-50 px-2 ${currentStep >= step.id ? 'text-orange-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${currentStep >= step.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-200 text-slate-500'}`}>
              <step.icon size={18} />
            </div>
            <span className="text-xs font-semibold">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExploreStep = () => {
    // Filter places into categories
    const sightseeing = plan?.placesToVisit.filter(p => p.category !== 'Shopping') || [];
    const shopping = plan?.placesToVisit.filter(p => p.category === 'Shopping') || [];

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Explore {plan?.destination}</h2>
          <p className="text-slate-500 mt-2">{plan?.summary}</p>
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Best Time: {plan?.bestTimeToVisit}</span>
             <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">{plan?.distanceKm} km Trip</span>
          </div>
        </div>
  
        <WeatherAndPacking destination={destination} days={days} />

        <div className="space-y-12">
          {/* Day-Wise Itinerary */}
          {plan?.itinerary && plan.itinerary.length > 0 && (
            <div className="mb-12">
              <Itinerary plan={plan} openInMaps={openInMaps} getRealPhotoUrl={getRealPhotoUrl} />
            </div>
          )}

          {/* Sightseeing */}
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-bold mb-6 text-slate-800 border-l-4 border-orange-500 pl-3">
              <Camera className="text-orange-500" /> Must Visit & Hidden Gems
            </h3>
            <p className="text-xs text-slate-400 mb-4 ml-1 italic">*Click on any image to view details on Google Maps</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sightseeing.map((place, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openInMaps(place.name)}
                  className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                >
                   <div className="h-48 overflow-hidden relative">
                      <img 
                        src={getRealPhotoUrl(place.name)} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={place.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/600x400/orange/white?text=${encodeURIComponent(place.name)}`;
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-slate-800">
                        {place.category}
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                           View Map <ExternalLink size={12} />
                         </span>
                      </div>
                   </div>
                   <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{place.name}</h4>
                      </div>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-3">{place.description}</p>
                      <div className="flex justify-between items-center text-xs font-medium pt-3 border-t border-slate-100">
                         <span className="text-slate-400">{place.distance} away</span>
                         <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Entry: ₹{place.estimatedEntryCost}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Shopping & Markets */}
          {shopping.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-bold mb-6 text-slate-800 border-l-4 border-indigo-500 pl-3">
                <ShoppingBag className="text-indigo-500" /> Shopping & Markets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopping.map((place, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => openInMaps(place.name)}
                    className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                  >
                     <div className="h-40 overflow-hidden relative">
                        <img 
                          src={getRealPhotoUrl(place.name + ' market shopping')} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={place.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/indigo/white?text=${encodeURIComponent(place.name)}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                             View Map <ExternalLink size={12} />
                           </span>
                        </div>
                     </div>
                     <div className="p-4">
                        <h4 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{place.name}</h4>
                        <p className="text-sm text-slate-500 mb-2 mt-1 line-clamp-2">{place.description}</p>
                        <div className="text-xs text-slate-400 font-medium">
                           {place.distance} away
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Aesthetic Cafes & Eats */}
          <div>
             <h3 className="flex items-center gap-2 text-2xl font-bold mb-6 text-slate-800 border-l-4 border-pink-500 pl-3">
              <Heart className="text-pink-500" /> Aesthetic Cafes & Food Spots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {plan?.diningOptions.map((spot, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => openInMaps(spot.name)}
                    className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col sm:flex-row h-full group"
                  >
                     <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                        <img 
                          src={getRealPhotoUrl(spot.name + ' aesthetic cafe food')} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          alt={spot.name} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/400x400/pink/white?text=${encodeURIComponent(spot.name)}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="text-white drop-shadow-lg" />
                        </div>
                     </div>
                     <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-lg text-slate-800 group-hover:text-pink-600 transition-colors leading-tight">{spot.name}</h4>
                              <span className="text-[10px] px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full whitespace-nowrap h-fit">{spot.vibe}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-3">{spot.cuisine} • <span className="font-semibold text-slate-700">₹{spot.costPerPerson}</span>/person</p>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{spot.description}</p>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100 flex items-start gap-2">
                            <Utensils size={14} className="text-yellow-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-yellow-800"><strong>Must Try:</strong> {spot.mustTryDish}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTravelStep = () => (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">How do you want to travel?</h2>
      <div className="space-y-4">
        {plan?.transportOptions.map((option, idx) => (
          <TransportCard 
            key={idx} 
            option={option} 
            isSelected={selectedTransport === option}
            onSelect={() => setSelectedTransport(option)}
          />
        ))}
      </div>
      <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> We calculate local travel costs automatically (approx ₹{plan?.localTravelCostEstimate} for the trip) regardless of how you arrive.
        </p>
      </div>
    </div>
  );

  const renderStayStep = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Select your accommodation</h2>
      <p className="text-center text-slate-500 mb-8">From budget-friendly hostels to luxury resorts</p>
      <p className="text-center text-xs text-slate-400 mb-6 italic">*Click on any hotel to verify location & reviews</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan?.stayOptions.map((stay, idx) => {
          // Determine price badge color
          let badgeColor = "bg-slate-100 text-slate-600";
          let badgeText = "Standard";
          if (idx === 0) { badgeColor = "bg-green-100 text-green-700"; badgeText = "Best Budget"; }
          if (idx === plan.stayOptions.length - 1) { badgeColor = "bg-purple-100 text-purple-700"; badgeText = "Luxury"; }
          if (idx === plan.stayOptions.length - 2) { badgeColor = "bg-blue-100 text-blue-700"; badgeText = "Premium"; }

          return (
            <div 
              key={idx} 
              className={`cursor-pointer group relative overflow-hidden rounded-2xl border transition-all duration-300 flex flex-col ${selectedStay?.name === stay.name ? 'border-orange-500 ring-2 ring-orange-200 shadow-xl scale-[1.02]' : 'border-slate-200 hover:border-orange-300 hover:shadow-lg'}`}
              onClick={(e) => {
                 // If clicking the container, select the stay
                 setSelectedStay(stay);
              }}
            >
              {/* Image Container - Clicking this opens maps */}
              <div 
                className="h-56 overflow-hidden relative bg-slate-200"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selection when trying to open map, or do both? 
                  // Let's do both: Select it AND open map? Or separate button?
                  // User asked "if i click on that i redirect". 
                  openInMaps(stay.name);
                  setSelectedStay(stay); // Also select it for budget calc
                }}
              >
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                 <img 
                   src={getRealPhotoUrl(stay.name + ' hotel exterior')} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   alt={stay.name}
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = `https://placehold.co/600x400/blue/white?text=${encodeURIComponent(stay.name)}`;
                   }}
                 />
                 
                 {/* Top Badge */}
                 <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badgeColor} shadow-sm`}>
                    {badgeText}
                 </div>

                 {/* Hover Overlay for Map */}
                 <div className="absolute inset-0 z-15 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-30">
                      See Real Location <ExternalLink size={12} />
                    </span>
                 </div>

                 {/* Bottom Info */}
                 <div className="absolute bottom-4 left-4 right-4 z-20 text-white pointer-events-none">
                    <h3 className="font-bold text-lg leading-tight mb-1 shadow-black drop-shadow-md">{stay.name}</h3>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                         <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs">{stay.type}</span>
                         <span className="flex items-center gap-0.5"><Star size={12} className="fill-yellow-400 text-yellow-400" /> {stay.rating}</span>
                      </div>
                      <div className="text-right">
                         <span className="block text-xl font-bold">₹{stay.pricePerNight}</span>
                      </div>
                    </div>
                 </div>

                 {selectedStay?.name === stay.name && (
                   <div className="absolute top-4 right-4 z-20 bg-orange-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                      <CheckCircle2 size={20} />
                   </div>
                 )}
              </div>
              
              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                       <MapPin size={12} /> {stay.location}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stay.features.map((f, i) => (
                         <span key={i} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-1 rounded-md">{f}</span>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBudgetStep = () => (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Trip Summary & Budget</h2>
        <p className="text-slate-500">Review your estimated expenses based on selections.</p>
      </div>
      
      {plan && (
        <ExpenseCalculator 
          plan={plan}
          days={days}
          travelers={travelers}
          selectedTransport={selectedTransport}
          selectedStay={selectedStay}
        />
      )}

      <div className="mt-8 flex justify-center">
         <button 
           onClick={() => {
             setSource('');
             setDestination('');
             setPlan(null);
             setCurrentStep(0);
             setIsDemoMode(false);
           }}
           className="text-slate-500 hover:text-orange-600 font-medium underline"
         >
           Plan Another Trip
         </button>
      </div>
    </div>
  );

  // --- Main Layout for Wizard ---
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* App Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
             <button onClick={() => setCurrentStep(0)} className="flex items-center gap-2">
               <div className="bg-orange-500 p-1.5 rounded-lg text-white">
                 <Navigation size={18} />
               </div>
               <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                 YatraAI
               </span>
             </button>
             <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                  {travelers} Travelers • {days} Days
                </span>
             </div>
          </div>
        </div>
      </nav>
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
         <div className="bg-yellow-500 text-yellow-950 px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2">
            <PlayCircle size={16} />
            <span>Demo Mode Active: Showing sample itinerary because no valid API Key was found.</span>
         </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {renderStepper()}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 min-h-[500px] p-6 sm:p-8 relative">
          
          {currentStep === 1 && renderExploreStep()}
          {currentStep === 2 && renderTravelStep()}
          {currentStep === 3 && renderStayStep()}
          {currentStep === 4 && renderBudgetStep()}

          {/* Navigation Buttons (Floating Bottom or Static) */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
             <button 
               onClick={prevStep}
               disabled={currentStep === 1}
               className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
             >
               <ChevronLeft size={18} /> Back
             </button>
             
             {currentStep < 4 ? (
               <button 
                onClick={nextStep}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-200 flex items-center gap-2 transition-transform hover:scale-105"
               >
                 Next <ChevronRight size={18} />
               </button>
             ) : (
                <button onClick={handleSaveItineraryPdf} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-green-200 flex items-center gap-2">
                   Save Itinerary <CheckCircle2 size={18} />
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;