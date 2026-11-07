import React, { useState } from 'react';
import { CloudSun, Thermometer, CheckSquare, Square, Umbrella, Shirt, Luggage, ShieldCheck } from 'lucide-react';

interface WeatherAndPackingProps {
  destination: string;
  days: number;
}

interface PackingItem {
  id: string;
  category: 'Clothing' | 'Essentials' | 'Electronics' | 'Documents';
  text: string;
  checked: boolean;
}

export const WeatherAndPacking: React.FC<WeatherAndPackingProps> = ({ destination, days }) => {
  const destLower = destination.toLowerCase();

  const getWeatherProfile = (dest: string) => {
    if (dest.includes('goa') || dest.includes('kerala') || dest.includes('mumbai') || dest.includes('andaman') || dest.includes('chennai')) {
      return {
        temp: '32°C / 24°C',
        condition: 'Sunny & Coastal Breezy',
        advice: 'Light cotton clothes, beachwear, sunglasses, and high-SPF sunscreen are recommended.',
        icon: '☀️',
        baseItems: [
          { id: '1', category: 'Clothing' as const, text: 'Light cotton shirts & shorts/dresses', checked: false },
          { id: '2', category: 'Clothing' as const, text: 'Swimwear & flip-flops', checked: false },
          { id: '3', category: 'Essentials' as const, text: 'Sunscreen (SPF 50+) & Sunglasses', checked: false },
          { id: '4', category: 'Essentials' as const, text: 'Rechargeable water bottle & hat', checked: false },
        ]
      };
    } else if (dest.includes('shimla') || dest.includes('manali') || dest.includes('leh') || dest.includes('srinagar') || dest.includes('kashmir') || dest.includes('darjeeling')) {
      return {
        temp: '12°C / 2°C',
        condition: 'Chilly & Crisp Mountain Air',
        advice: 'Heavy woolens, thermal layers, warm jacket, gloves, and sturdy boots are essential.',
        icon: '❄️',
        baseItems: [
          { id: '1', category: 'Clothing' as const, text: 'Thermal innerwear (2 pairs)', checked: false },
          { id: '2', category: 'Clothing' as const, text: 'Heavy woolen sweaters & fleece jacket', checked: false },
          { id: '3', category: 'Clothing' as const, text: 'Windproof / Waterproof outer jacket', checked: false },
          { id: '4', category: 'Essentials' as const, text: 'Woolen cap, gloves & woolen socks', checked: false },
        ]
      };
    } else if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('udaipur') || dest.includes('agra') || dest.includes('delhi')) {
      return {
        temp: '30°C / 18°C',
        condition: 'Warm & Sunny Heritage Weather',
        advice: 'Breathable cotton garments, comfortable walking shoes for monuments, and a scarf for sun protection.',
        icon: '🏛️',
        baseItems: [
          { id: '1', category: 'Clothing' as const, text: 'Breathable linen / cotton outfits', checked: false },
          { id: '2', category: 'Clothing' as const, text: 'Comfortable walking sneakers / shoes', checked: false },
          { id: '3', category: 'Essentials' as const, text: 'Cap, scarf & sunglasses', checked: false },
          { id: '4', category: 'Essentials' as const, text: 'ORS / Electrolyte sachets for hydration', checked: false },
        ]
      };
    } else {
      return {
        temp: '26°C / 17°C',
        condition: 'Pleasant & Mild Weather',
        advice: 'Versatile casual wear, comfortable walking shoes, and a light jacket for evenings.',
        icon: '🌤️',
        baseItems: [
          { id: '1', category: 'Clothing' as const, text: `Comfortable casual clothes for ${days} days`, checked: false },
          { id: '2', category: 'Clothing' as const, text: 'Light jacket or hoodie for evenings', checked: false },
          { id: '3', category: 'Clothing' as const, text: 'Comfortable walking shoes', checked: false },
        ]
      };
    }
  };

  const profile = getWeatherProfile(destLower);

  const [items, setItems] = useState<PackingItem[]>([
    ...profile.baseItems,
    { id: 'e1', category: 'Electronics', text: 'Smartphone & fast charger', checked: true },
    { id: 'e2', category: 'Electronics', text: 'Power bank (10,000mAh)', checked: false },
    { id: 'd1', category: 'Documents', text: 'Government ID (Aadhaar / Voter ID / Passport)', checked: true },
    { id: 'd2', category: 'Documents', text: 'Train / Flight tickets & Hotel bookings', checked: true },
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const categories = ['Clothing', 'Essentials', 'Electronics', 'Documents'] as const;

  return (
    <div className="space-y-6 my-6">
      {/* Weather Forecast Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-blue-800/50 p-4 rounded-2xl border border-blue-700">
            {profile.icon}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-300 font-bold mb-1">Smart Weather Forecast • {destination}</div>
            <div className="text-3xl font-extrabold flex items-center gap-2">
              {profile.temp} <span className="text-sm font-normal text-blue-200">({profile.condition})</span>
            </div>
            <p className="text-sm text-blue-200 mt-2 max-w-xl">{profile.advice}</p>
          </div>
        </div>
        <div className="bg-blue-800/40 border border-blue-700/50 rounded-xl p-4 text-center shrink-0">
          <Thermometer className="mx-auto text-orange-400 mb-1" size={24} />
          <span className="text-xs text-blue-300 block font-semibold">Season Optimized</span>
          <span className="text-sm font-bold text-white">{days} Days Trip</span>
        </div>
      </div>

      {/* Auto Packing Checklist */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800">
            <Luggage className="text-orange-500" size={24} />
            <div>
              <h3 className="text-xl font-bold">Auto-Generated Packing Checklist</h3>
              <p className="text-xs text-slate-500">Tailored specifically for your trip to {destination}</p>
            </div>
          </div>
          <div className="text-xs bg-orange-50 text-orange-700 font-bold px-3 py-1.5 rounded-full border border-orange-100">
            {items.filter(i => i.checked).length} / {items.length} Packed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2 uppercase tracking-wide">
                  {cat === 'Clothing' && <Shirt size={16} className="text-orange-500" />}
                  {cat === 'Essentials' && <Umbrella size={16} className="text-blue-500" />}
                  {cat === 'Electronics' && <CloudSun size={16} className="text-purple-500" />}
                  {cat === 'Documents' && <ShieldCheck size={16} className="text-green-500" />}
                  {cat}
                </h4>
                <ul className="space-y-2">
                  {catItems.map(item => (
                    <li 
                      key={item.id} 
                      onClick={() => toggleItem(item.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        item.checked ? 'bg-green-50/80 border border-green-200 text-slate-500 line-through' : 'bg-white border border-slate-200 hover:border-orange-300 text-slate-800'
                      }`}
                    >
                      {item.checked ? <CheckSquare size={18} className="text-green-600 shrink-0" /> : <Square size={18} className="text-slate-400 shrink-0" />}
                      <span className="text-sm font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
