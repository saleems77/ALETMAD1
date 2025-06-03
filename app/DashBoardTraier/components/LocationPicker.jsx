'use client';
import { useMapEvents } from 'react-leaflet';
import { FiMapPin } from 'react-icons/fi';

export default function LocationPicker({ lat, lng, onLocationChange }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          onLocationChange(
            lat,
            lng,
            data.display_name || 'موقع غير معروف'
          );
        });
    }
  });

  return (
    <div className="mb-4">
      <div className="border rounded-lg p-2 bg-white">
        <div className="flex items-center gap-2 text-gray-600">
          <FiMapPin className="text-lg" />
          <span>انقر على الخريطة لتحديد الموقع</span>
        </div>
        <div className="mt-2 text-sm">
          الموقع المحدد: {lat.toFixed(4)}, {lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
}