export const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/[\s\W_]+/g, '');
};

export const fuzzyMatch = (str: string, query: string) => {
  let i = 0;
  let j = 0;
  while (i < str.length && j < query.length) {
    if (str[i] === query[j]) {
      j++;
    }
    i++;
  }
  return j === query.length;
};

export const searchLocations = (locations: string[], query: string, disabledLocation?: string) => {
  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return [];

  const exactPrefixMatches: string[] = [];
  const startsWithMatches: string[] = [];
  const fuzzyMatches: string[] = [];

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    if (disabledLocation && loc.toLowerCase() === disabledLocation.toLowerCase()) {
      continue;
    }

    const normalizedLoc = normalizeString(loc);
    
    // 1. Exact prefix match ignoring case/spaces
    if (normalizedLoc.startsWith(normalizedQuery)) {
      if (loc.toLowerCase().startsWith(query.toLowerCase())) {
        exactPrefixMatches.push(loc);
      } else {
        startsWithMatches.push(loc);
      }
      if (exactPrefixMatches.length + startsWithMatches.length >= 10) break;
    } 
    // 2. Fuzzy match
    else if (exactPrefixMatches.length + startsWithMatches.length < 10) {
      if (fuzzyMatch(normalizedLoc, normalizedQuery)) {
        fuzzyMatches.push(loc);
      }
    }
  }

  const results = [...exactPrefixMatches, ...startsWithMatches, ...fuzzyMatches].slice(0, 10);
  
  // Return unique results (in case duplicates exist in dataset)
  return Array.from(new Set(results));
};
