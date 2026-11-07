import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useAutocomplete } from '../hooks/useAutocomplete';

interface CityAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabledCity?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabledCity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { suggestions } = useAutocomplete(value, disabledCity);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        e.preventDefault();
        onChange(suggestions[activeIndex]);
        setIsOpen(false);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <span key={index} className="text-orange-500 font-bold">{part}</span> : part
    );
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="text-xs text-slate-300 uppercase font-bold ml-1 mb-1 block">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          required
        />
      </div>

      {isOpen && value.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((city, index) => (
                <li
                  key={city}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                    index === activeIndex ? 'bg-slate-700/80 border-l-4 border-orange-500' : 'hover:bg-slate-700/50 border-l-4 border-transparent'
                  }`}
                  onClick={() => {
                    onChange(city);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <MapPin size={16} className={index === activeIndex ? 'text-orange-500' : 'text-slate-500'} />
                  <span className="text-slate-200">
                    {highlightMatch(city, value.trim())}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-4 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <MapPin size={24} className="text-slate-600 opacity-50" />
              <p>No cities found matching "{value}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
