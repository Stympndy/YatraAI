import { useState, useEffect, useMemo } from 'react';
import { searchLocations } from '../utils/searchLocations';

// Global cache for locations to prevent multiple fetches
let cachedLocations: string[] | null = null;

export const useAutocomplete = (inputValue: string, disabledCity?: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cachedLocations) {
      setLocations(cachedLocations);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch('/data/indiaLocations.json')
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          cachedLocations = data;
          setLocations(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load locations", err);
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const value = inputValue.trim();
    if (value.length < 1 || locations.length === 0) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const results = searchLocations(locations, value, disabledCity);
      setSuggestions(results);
    }, 150);

    return () => clearTimeout(timer);
  }, [inputValue, disabledCity, locations]);

  return { suggestions, isLoading };
};
