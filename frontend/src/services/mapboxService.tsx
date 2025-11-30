import { MAPBOX_PUBLIC_TOKEN } from '@env';

const PROFILE = 'walking';

interface RouteResponse {
  geometry: any;
  duration: number;
  distance: number;
}

interface Attraction {
  id: string;
  name: string;
  coordinate: [number, number];
}

// Dodajemy interfejs PoiDetails
export interface PoiDetails {
  mapbox_id: string;
  name: string;
  full_address: string;
  category: string;
  phone?: string;
  website?: string;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getSmartRoute = async (
  coordinates: [number, number][]
): Promise<RouteResponse | null> => {
  if (coordinates.length < 2) return null;

  try {
    const coordinatesString = coordinates
      .map((c) => `${c[0]},${c[1]}`)
      .join(';');

    const url = `https://api.mapbox.com/directions/v5/mapbox/${PROFILE}/${coordinatesString}?geometries=geojson&overview=full&access_token=${MAPBOX_PUBLIC_TOKEN}`;

    const response = await fetch(url);
    const json = await response.json();

    if (json.routes && json.routes.length > 0) {
      const route = json.routes[0];
      return {
        // Zwracamy tablicę współrzędnych
        geometry: route.geometry.coordinates, 
        duration: route.duration,
        distance: route.distance,
      };
    }
    return null;
  } catch (error) {
    console.error('Mapbox Directions Error:', error);
    return null;
  }
};

export const getNearbyAttractions = async (
  center: [number, number]
): Promise<Attraction[]> => {
  try {
    const types = 'tourism,museum,park'; 
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${types}.json?proximity=${center[0]},${center[1]}&limit=5&access_token=${MAPBOX_PUBLIC_TOKEN}`;

    const response = await fetch(url);
    const json = await response.json();

    if (json.features) {
      return json.features.map((f: any) => ({
        id: f.id,
        name: f.text,
        coordinate: f.center,
      }));
    }
    return [];
  } catch (error) {
    console.error('Attractions Error:', error);
    return [];
  }
};

// --- BRAKUJĄCA FUNKCJA ---
export const getPoiDetails = async (
  name: string, 
  coordinate: [number, number]
): Promise<PoiDetails | null> => {
  try {
    const sessionToken = generateUUID(); 
    const encodedQuery = encodeURIComponent(name);
    
    // Suggest
    const suggestUrl = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedQuery}&proximity=${coordinate[0]},${coordinate[1]}&session_token=${sessionToken}&access_token=${MAPBOX_PUBLIC_TOKEN}&language=pl&limit=1&types=poi`;

    const suggestRes = await fetch(suggestUrl);
    const suggestData = await suggestRes.json();

    if (!suggestData.suggestions || suggestData.suggestions.length === 0) {
      return null;
    }

    const mapboxId = suggestData.suggestions[0].mapbox_id;

    // Retrieve
    const retrieveUrl = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?session_token=${sessionToken}&access_token=${MAPBOX_PUBLIC_TOKEN}&language=pl`;

    const retrieveRes = await fetch(retrieveUrl);
    const retrieveData = await retrieveRes.json();

    if (retrieveData.features && retrieveData.features.length > 0) {
      const props = retrieveData.features[0].properties;
      
      return {
        mapbox_id: mapboxId,
        name: props.name,
        full_address: props.full_address || props.place_formatted,
        category: props.poi_category?.join(', ') || 'Miejsce',
        phone: props.metadata?.phone,
        website: props.metadata?.website,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching POI details:', error);
    return null;
  }
};