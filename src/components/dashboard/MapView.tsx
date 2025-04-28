import { useEffect, useRef } from 'react';

interface MapViewProps {
  patientLocation: {
    lat: number;
    lng: number;
  };
  hospitalLocation?: {
    lat: number;
    lng: number;
  };
  showRoute?: boolean;
}

// This component displays a placeholder map with coordinates
// In a real application, you would integrate with Google Maps or a similar service
const MapView: React.FC<MapViewProps> = ({
  patientLocation,
  hospitalLocation = { lat: 37.7690, lng: -122.4100 }, // Default hospital location for demo
  showRoute = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // In a real implementation, you would initialize Google Maps here
    // For now, we'll use a placeholder
    const renderMap = () => {
      const mapContainer = mapContainerRef.current;
      if (!mapContainer) return;
      
      mapContainer.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-slate-800 rounded-lg">
          <div class="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-12 w-12 mx-auto text-primary-500 mb-4">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">Patient Location:</p>
            <p class="text-sm font-medium text-gray-800 dark:text-white mb-3">
              Lat: ${patientLocation.lat.toFixed(6)}, Lng: ${patientLocation.lng.toFixed(6)}
            </p>
            ${showRoute ? `
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">Hospital Location:</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white mb-3">
                Lat: ${hospitalLocation.lat.toFixed(6)}, Lng: ${hospitalLocation.lng.toFixed(6)}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Distance: ${calculateDistance(patientLocation, hospitalLocation).toFixed(2)} km
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Est. Travel Time: ${calculateTravelTime(patientLocation, hospitalLocation)} min
              </p>
            ` : ''}
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Live map integration enabled in production environment
            </p>
          </div>
        </div>
      `;
    };
    
    renderMap();
  }, [patientLocation, hospitalLocation, showRoute]);
  
  // Calculate distance between two points in km (Haversine formula)
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    const R = 6371; // Earth radius in km
    const dLat = deg2rad(point2.lat - point1.lat);
    const dLng = deg2rad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };
  
  // Estimate travel time (very rough approximation)
  const calculateTravelTime = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    const distance = calculateDistance(point1, point2);
    const averageSpeed = 40; // km/h
    return Math.round((distance / averageSpeed) * 60); // convert to minutes
  };
  
  return (
    <div ref={mapContainerRef} className="w-full h-full min-h-[300px] rounded-lg overflow-hidden"></div>
  );
};

export default MapView;