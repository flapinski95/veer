// src/services/routeService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOST } from '@env';

// Ustaw swój adres IP backendu (dla emulatora Androida 10.0.2.2, dla iOS localhost/IP)
// Najlepiej pobierać to z .env
const API_URL = `http://${HOST}:3101/api/route`;

interface RoutePoint {
  lat: number;
  lng: number;
  order: number;
}

interface RoutePayload {
  name: string;
  description: string;
  isPublic: boolean;
  points: RoutePoint[];
}

export const saveRoute = async (payload: RoutePayload) => {
  try {
    const authData = await AsyncStorage.getItem('auth');
    const parsedAuth = authData ? JSON.parse(authData) : null;
    const token = parsedAuth?.accessToken; 

    if (!token) throw new Error('Brak tokenu autoryzacji');

    console.log('Wysyłanie trasy:', JSON.stringify(payload));

    const response = await fetch(`${API_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Błąd API: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Save Route Error:', error);
    throw error;
  }
};