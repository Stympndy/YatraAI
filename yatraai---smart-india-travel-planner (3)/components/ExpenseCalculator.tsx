import React, { useMemo } from 'react';
import { TripPlan, TransportOption, Stay } from '../types';
import { IndianRupee, PieChart, Info } from 'lucide-react';

interface ExpenseCalculatorProps {
  plan: TripPlan;
  travelers: number;
  days: number;
  selectedTransport: TransportOption | null;
  selectedStay: Stay | null;
}

const ExpenseCalculator: React.FC<ExpenseCalculatorProps> = ({ 
  plan, 
  travelers, 
  days, 
  selectedTransport, 
  selectedStay 
}) => {
  
  // Defaults if nothing selected (take lowest/average for initial view)
  const transportCost = selectedTransport ? selectedTransport.cost : Math.min(...plan.transportOptions.map(t => t.cost));
  const stayCost = selectedStay ? selectedStay.pricePerNight : Math.min(...plan.stayOptions.map(s => s.pricePerNight));

  const totalTransport = transportCost * travelers * 2; // Round trip
  const totalStay = stayCost * days * Math.ceil(travelers / 2); // Assuming 2 people per room
  const totalFood = plan.estimatedFoodCostPerDay * days * travelers;
  const totalLocalTravel = plan.localTravelCostEstimate;
  const buffer = 1000; // Reduced emergency buffer for budget accuracy

  const grandTotal = totalTransport + totalStay + totalFood + totalLocalTravel + buffer;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 sticky top-6">
      <div className="flex items-center gap-2 mb-4 text-orange-600">
        <PieChart size={24} />
        <h2 className="text-xl font-bold">Estimated Budget</h2>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex justify-between items-center">
          <span>Travel (Round Trip) <span className="text-xs bg-slate-100 px-1 rounded">x{travelers}</span></span>
          <span className="font-medium">₹{totalTransport.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Stay ({days} Nights) <span className="text-xs bg-slate-100 px-1 rounded">{Math.ceil(travelers/2)} Rooms</span></span>
          <span className="font-medium">₹{totalStay.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span>Food & Drinks</span>
            <span className="text-[10px] text-slate-400 leading-tight">(Street food baseline)</span>
          </div>
          <span className="font-medium">₹{totalFood.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Local Sightseeing</span>
          <span className="font-medium">₹{totalLocalTravel.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Misc/Buffer</span>
          <span>₹{buffer.toLocaleString()}</span>
        </div>
      </div>

      <div className="border-t border-slate-200 my-4 pt-4">
        <div className="flex justify-between items-end">
          <span className="text-slate-500 font-medium">Total Estimate</span>
          <div className="text-right">
             <span className="text-3xl font-bold text-slate-800 block leading-none">
              ₹{grandTotal.toLocaleString()}
             </span>
             <span className="text-xs text-slate-400">approx. for whole trip</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-700 flex gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p><strong>Note:</strong> Aesthetic cafe visits are considered "extras" and are not included in this budget estimate to keep costs realistic for a budget trip.</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCalculator;