import * as turf from '@turf/turf';
import { RoutePoint } from '../components/map/RoutePanel';

/**
 * Znajduje najlepszy indeks do wstawienia nowego punktu w trasie.
 * Sprawdza odległość kliknięcia od każdego segmentu trasy (linii między punktami).
 */
export const findBestInsertIndex = (
  clickCoordinate: [number, number],
  waypoints: RoutePoint[]
): number => {
  // Jeśli mamy mniej niż 2 punkty, zawsze dodajemy na koniec (nie ma linii)
  if (waypoints.length < 2) return waypoints.length;

  let minDistance = Infinity;
  let bestIndex = waypoints.length; // Domyślnie na koniec

  const pt = turf.point(clickCoordinate);

  // Iterujemy przez wszystkie odcinki trasy (Punkt A -> Punkt B)
  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i].coordinate;
    const end = waypoints[i + 1].coordinate;

    // Tworzymy linię prostą reprezentującą ten odcinek
    const line = turf.lineString([start, end]);
    
    // Obliczamy odległość punktu kliknięcia od tego odcinka (w metrach)
    const distance = turf.pointToLineDistance(pt, line, { units: 'meters' });

    // Jeśli znaleźliśmy odcinek, do którego jest bliżej niż do poprzednich...
    if (distance < minDistance) {
      minDistance = distance;
      // ...to wstawiamy NOWY punkt PO punkcie startowym tego odcinka (czyli index i + 1)
      bestIndex = i + 1;
    }
  }

  return bestIndex;
};