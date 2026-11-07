import React from 'react';
import { TransportOption, TransportMode } from '../types';
import { Plane, Train, Bus, Car, Clock, ArrowRight } from 'lucide-react';

interface TransportCardProps {
  option: TransportOption;
  isSelected: boolean;
  onSelect: () => void;
}

const TransportCard: React.FC<TransportCardProps> = ({ option, isSelected, onSelect }) => {
  
  const getIcon = (mode: TransportMode) => {
    switch (mode) {
      case TransportMode.FLIGHT: return <Plane className="text-blue-500" />;
      case TransportMode.TRAIN: return <Train className="text-red-500" />;
      case TransportMode.BUS: return <Bus className="text-orange-500" />;
      case TransportMode.CAB: return <Car className="text-green-500" />;
      default: return <Bus />;
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`relative cursor-pointer transition-all duration-300 border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        isSelected ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
          {getIcon(option.mode)}
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{option.providerName}</h4>
          <p className="text-sm text-slate-500 line-clamp-1">{option.description}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 font-medium">
             <Clock size={12} /> {option.duration} travel time
          </div>
        </div>
      </div>

      <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
        <div className="text-lg font-bold text-slate-800">₹{option.cost.toLocaleString()}</div>
        <div className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-orange-200 text-orange-800' : 'bg-slate-100 text-slate-500'}`}>
          per person
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full shadow-sm">
          <ArrowRight size={14} />
        </div>
      )}
    </div>
  );
};

export default TransportCard;
