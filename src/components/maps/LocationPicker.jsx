// LocationPicker.jsx (JavaScript)
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PUNE_CENTER } from '../../mocks/mockData';
import { MapPin, Crosshair, Check, AlertCircle } from 'lucide-react';

const createPickerPinIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: #0284c7;
        border: 3px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(2,132,199,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export const LocationPicker = ({
  initialLat = 18.5074,
  initialLng = 73.8077,
  initialAddress = 'Plot 42, Mayur Colony, Kothrud, Pune',
  onLocationSelect,
  height = '360px',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const marker = L.marker([initialLat, initialLng], {
        icon: createPickerPinIcon(),
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (event) => {
        const position = event.target.getLatLng();
        updateSelectedLocation(position.lat, position.lng);
      });

      map.on('click', (event) => {
        const { lat, lng } = event.latlng;
        marker.setLatLng([lat, lng]);
        updateSelectedLocation(lat, lng);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const updateSelectedLocation = (lat, lng) => {
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    setCoords({ lat: roundedLat, lng: roundedLng });

    // Mock reverse geocode address for Pune areas
    let resolvedAddress = `Selected Coordinates: ${roundedLat}, ${roundedLng}`;
    if (roundedLat >= 18.50 && roundedLat <= 18.52 && roundedLng <= 73.82) {
      resolvedAddress = 'Mayur Colony / Paud Road, Kothrud, Pune - 411038';
    } else if (roundedLat >= 18.52 && roundedLat <= 18.54) {
      resolvedAddress = 'Shivajinagar / FC Road, Pune - 411005';
    } else if (roundedLng >= 73.86) {
      resolvedAddress = 'Bhavani Peth / Camp, Pune - 411001';
    }

    setAddress(resolvedAddress);
    if (onLocationSelect) {
      onLocationSelect({
        latitude: roundedLat,
        longitude: roundedLng,
        address: resolvedAddress,
      });
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
            markerRef.current.setLatLng([lat, lng]);
          }
          updateSelectedLocation(lat, lng);
          setIsLocating(false);
        },
        () => {
          // Fallback to Pune Kothrud Center
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([18.5074, 73.8077], 16, { animate: true });
            markerRef.current.setLatLng([18.5074, 73.8077]);
          }
          updateSelectedLocation(18.5074, 73.8077);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Map Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.775rem',
            fontWeight: 600,
            color: 'var(--primary-700)',
          }}
        >
          <Crosshair size={15} className={isLocating ? 'animate-spin' : ''} />
          <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
        </button>

        {/* Instruction overlay bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            fontSize: '0.725rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <MapPin size={13} color="#38bdf8" />
          <span>Drag marker or click map to pinpoint delivery gate / sump</span>
        </div>
      </div>

      {/* Coordinate & Address Readout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--slate-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{address}</div>
          <div style={{ color: 'var(--slate-500)', fontSize: '0.725rem', fontFamily: 'var(--font-mono)' }}>
            Lat: {coords.lat}, Lng: {coords.lng} (PostGIS EPSG:4326)
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#059669',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        >
          <Check size={16} /> Location Pinned
        </div>
      </div>
    </div>
  );
};
