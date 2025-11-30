import { MAPBOX_PUBLIC_TOKEN } from '@env';

const PROFILE = 'walking'; // lub 'driving'

interface RouteResponse {
  geometry: any; // GeoJSON geometry
  duration: number; // sekundy
  distance: number; // metry
}

interface Attraction {
  id: string;
  name: string;
  coordinate: [number, number];
}

// Pobiera trasę przelatującą przez wszystkie punkty
export const getSmartRoute = async (
  coordinates: [number, number][]
): Promise<RouteResponse | null> => {
  if (coordinates.length < 2) return null;

  try {
    // Format: lng1,lat1;lng2,lat2;lng3,lat3
    const coordinatesString = coordinates
      .map((c) => `${c[0]},${c[1]}`)
      .join(';');

    const url = `https://api.mapbox.com/directions/v5/mapbox/${PROFILE}/${coordinatesString}?geometries=geojson&overview=full&access_token=${MAPBOX_PUBLIC_TOKEN}`;

    const response = await fetch(url);
    const json = await response.json();

    if (json.routes && json.routes.length > 0) {
      const route = json.routes[0];
      return {
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

// Pobiera atrakcje w pobliżu danego punktu
export const getNearbyAttractions = async (
  center: [number, number]
): Promise<Attraction[]> => {
  try {
    // Szukamy w kategorii "tourism", "museum", "park"
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