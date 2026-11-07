import React, { useState } from 'react';
import { TripPlan, ItineraryDay, ItineraryActivity } from '../types';
import { Map, Clock, Coffee, Utensils, Mountain, MapPin, Building, ChevronDown, ChevronUp, Download, Share2, Compass, ExternalLink, Calendar } from 'lucide-react';

interface ItineraryProps {
  plan: TripPlan;
  openInMaps: (name: string) => void;
  getRealPhotoUrl: (query: string) => string;
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Place': return <MapPin size={18} className="text-orange-500" />;
    case 'Food': return <Utensils size={18} className="text-red-500" />;
    case 'Travel': return <Compass size={18} className="text-blue-500" />;
    case 'Leisure': return <Coffee size={18} className="text-purple-500" />;
    default: return <Clock size={18} className="text-slate-400" />;
  }
};

const ActivityCard = ({ activity, openInMaps, getRealPhotoUrl }: { activity: ItineraryActivity, openInMaps: (name: string) => void, getRealPhotoUrl: (query: string) => string }) => (
  <div className="relative pl-6 pb-6 border-l-2 border-slate-200 last:border-0 last:pb-0">
    <div className="absolute -left-[11px] top-1 bg-white border-2 border-slate-200 rounded-full p-1 z-10">
      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
    </div>
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm hover:border-orange-200 hover:bg-orange-50/30 transition-colors group">
      <div className="flex justify-between items-start gap-3">
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase mb-2 bg-slate-200 text-slate-700">
            {activity.timeSlot}
          </span>
          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ActivityIcon type={activity.type} />
            {activity.title}
          </h4>
          <p className="text-slate-600 mt-1 text-sm">{activity.description}</p>
        </div>
        {activity.relatedPlaceName && (
          <div className="shrink-0 relative overflow-hidden rounded-lg w-20 h-20 md:w-24 md:h-24 cursor-pointer" onClick={() => openInMaps(activity.relatedPlaceName!)}>
            <img 
              src={getRealPhotoUrl(activity.relatedPlaceName)} 
              alt={activity.relatedPlaceName} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/100x100/orange/white?text=${encodeURIComponent(activity.relatedPlaceName!.substring(0, 5))}`;
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ExternalLink size={14} className="text-white" />
            </div>
          </div>
        )}
      </div>
      {activity.relatedPlaceName && !activity.relatedPlaceName.includes("Check-in") && (
        <button 
          onClick={() => openInMaps(activity.relatedPlaceName!)}
          className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-500 flex items-center gap-1"
        >
          <Map size={14} /> Open in Maps
        </button>
      )}
    </div>
  </div>
);

const DayCard = ({ day, isOpen, onToggle, openInMaps, getRealPhotoUrl }: { day: ItineraryDay, isOpen: boolean, onToggle: () => void, openInMaps: (name: string) => void, getRealPhotoUrl: (query: string) => string }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-4 hover:shadow-md hover:border-orange-200 transition-all">
      <div 
        className="p-5 cursor-pointer flex justify-between items-center bg-slate-50/80"
        onClick={onToggle}
      >
        <div>
          <h3 className="text-xl font-extrabold text-slate-800">Day {day.dayNumber}</h3>
          <p className="text-sm text-slate-500 font-medium">{day.theme}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-slate-100"><Utensils size={14} className="text-red-500" /> ₹{day.estimatedDailyExpense.food}</span>
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-slate-100"><Compass size={14} className="text-blue-500" /> ₹{day.estimatedDailyExpense.travel}</span>
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-slate-100"><Mountain size={14} className="text-orange-500" /> ₹{day.estimatedDailyExpense.activities}</span>
          </div>
          <div className="text-orange-600 bg-orange-100 p-2 rounded-full">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-5 border-t border-slate-100 bg-white">
          <div className="mb-6 md:hidden flex gap-3 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-lg justify-around">
            <span className="flex flex-col items-center gap-1"><Utensils size={14} className="text-red-500" /> ₹{day.estimatedDailyExpense.food}</span>
            <span className="flex flex-col items-center gap-1"><Compass size={14} className="text-blue-500" /> ₹{day.estimatedDailyExpense.travel}</span>
            <span className="flex flex-col items-center gap-1"><Mountain size={14} className="text-orange-500" /> ₹{day.estimatedDailyExpense.activities}</span>
          </div>
          
          <div className="pl-2 pt-2">
            {day.activities.map((activity, idx) => (
              <ActivityCard 
                key={idx} 
                activity={activity} 
                openInMaps={openInMaps} 
                getRealPhotoUrl={getRealPhotoUrl} 
              />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 p-4 rounded-xl">
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1"><Compass size={16} className="text-blue-500" /> Route Preview</h4>
              <p className="text-xs text-slate-500 mt-1">Navigate sequentially through today's planned locations.</p>
            </div>
            <button 
              onClick={() => {
                const places = day.activities.filter(a => a.relatedPlaceName).map(a => encodeURIComponent(a.relatedPlaceName!));
                if (places.length > 0) {
                  const url = places.length === 1 
                    ? `https://www.google.com/maps/search/?api=1&query=${places[0]}`
                    : `https://www.google.com/maps/dir/?api=1&origin=${places[0]}&destination=${places[places.length - 1]}${places.length > 2 ? `&waypoints=${places.slice(1, -1).join('|')}` : ''}`;
                  window.open(url, '_blank');
                }
              }}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <Map size={16} /> Open Route in Maps
            </button>
          </div>
          
          <div className="mt-4 flex items-start gap-2 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
            <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-slate-800">Nearby Suggestions</h4>
              <p className="text-xs text-slate-600 mt-1">If you have extra time today, check out local street markets or secondary attractions nearby without straying far from your route.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Itinerary = ({ plan, openInMaps, getRealPhotoUrl }: ItineraryProps) => {
  const [openDay, setOpenDay] = useState<number | null>(1); // Default open Day 1

  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My Trip to ${plan.destination}`,
        text: `Check out my ${plan.itinerary?.length} day itinerary for ${plan.destination}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  if (!plan.itinerary || plan.itinerary.length === 0) {
    return null;
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
            <Calendar className="text-orange-500" /> Day-Wise Itinerary
          </h2>
          <p className="text-slate-500 mt-1 text-sm">A smart timeline optimized for distance and experience.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
            <Download size={16} /> Export PDF
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {plan.itinerary.map((day) => (
          <DayCard 
            key={day.dayNumber}
            day={day}
            isOpen={openDay === day.dayNumber}
            onToggle={() => setOpenDay(openDay === day.dayNumber ? null : day.dayNumber)}
            openInMaps={openInMaps}
            getRealPhotoUrl={getRealPhotoUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Itinerary;
