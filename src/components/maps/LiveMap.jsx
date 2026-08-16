// LiveMap.jsx (JavaScript + Leaflet Native Wrapper for 100% React 19 Stability)
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PUNE_CENTER } from '../../mocks/mockData';
import { Layers, Maximize2, Navigation, AlertTriangle, Truck, MapPin, Building2, ShieldCheck } from 'lucide-react';

// Custom SVG Icons
const createTankerIcon = (heading = 0, isEmergency = false) => {
  const color = isEmergency ? '#e11d48' : '#0284c7';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: ${color};
        border: 2.5px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transform: rotate(${heading}deg);
        transition: all 0.3s ease;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

const createRequestIcon = (priority = 'MEDIUM') => {
  const colors = {
    CRITICAL: '#be123c',
    HIGH: '#ea580c',
    MEDIUM: '#d97706',
    LOW: '#059669',
  };
  const color = colors[priority] || '#0284c7';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 2px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 8px rgba(0,0,0,0.25);
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
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const createHospitalIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: #ffffff;
        border: 2.5px solid #e11d48;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(225,29,72,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #e11d48;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6v12M6 12h12"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const createEmergencyPulseIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(225, 29, 72, 0.4);
          border-radius: 50%;
          animation: ping-glow 1.8s infinite ease-in-out;
        "></div>
        <div style="
          width: 32px;
          height: 32px;
          background: #e11d48;
          border: 2.5px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(225,29,72,0.4);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
};

export const LiveMap = ({
  center = PUNE_CENTER,
  zoom = 13,
  tankers = [],
  requests = [],
  emergencies = [],
  activeAssignment = null,
  height = '560px',
  onSelectTanker,
  onSelectRequest,
  showLegend = true,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const routeLayerRef = useRef(null);

  const [layers, setLayers] = useState({
    tankers: true,
    requests: true,
    emergencies: true,
    geofence: true,
    routes: true,
  });

  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
      });

      // CartoDB Positron / OSM tiles for crisp GovTech appearance
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !layerGroup || !routeLayer) return;

    layerGroup.clearLayers();
    routeLayer.clearLayers();

    // 1. Plot Tankers
    if (layers.tankers && tankers.length > 0) {
      tankers.forEach((tanker) => {
        const isEmergencyRedirect = tanker.currentAssignmentId && activeAssignment?.isReassigned;
        const icon = createTankerIcon(tanker.heading || 0, isEmergencyRedirect);
        const marker = L.marker([tanker.latitude, tanker.longitude], { icon });

        marker.bindPopup(`
          <div style="font-family: var(--font-sans); min-width: 180px;">
            <div style="font-weight: 700; font-size: 0.95rem; color: #0f172a; margin-bottom: 2px;">
              🚛 ${tanker.registrationNumber}
            </div>
            <div style="font-size: 0.775rem; color: #64748b; margin-bottom: 6px;">
              Driver: <strong>${tanker.driver.name}</strong> (${tanker.driver.rating} ★)
            </div>
            <div style="display: flex; gap: 4px; font-size: 0.75rem; margin-bottom: 6px;">
              <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                ${tanker.status}
              </span>
              <span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                ${tanker.currentLiters} / ${tanker.capacityLiters} L
              </span>
            </div>
            <div style="font-size: 0.75rem; color: #475569;">
              Speed: ${tanker.speedKmH} km/h • Battery: ${tanker.batteryLevel}%
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectTanker) onSelectTanker(tanker);
        });

        marker.addTo(layerGroup);
      });
    }

    // 2. Plot Requests
    if (layers.requests && requests.length > 0) {
      requests.forEach((req) => {
        const icon = createRequestIcon(req.priorityLevel);
        const marker = L.marker([req.latitude, req.longitude], { icon });

        marker.bindPopup(`
          <div style="font-family: var(--font-sans); min-width: 190px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 0.9rem; color: #0f172a;">#${req.id}</strong>
              <span style="font-size: 0.7rem; font-weight: 700; background: ${req.priorityLevel === 'CRITICAL' ? '#ffe4e6' : '#fef3c7'}; color: ${req.priorityLevel === 'CRITICAL' ? '#be123c' : '#b45309'}; padding: 1px 6px; border-radius: 4px;">
                ${req.priorityLevel} (${req.priorityScore})
              </span>
            </div>
            <div style="font-size: 0.8rem; font-weight: 600; color: #334155;">${req.citizenName}</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 6px;">${req.address}</div>
            <div style="font-size: 0.75rem; color: #0284c7; font-weight: 600;">
              Requirement: ${req.quantityLiters} L • ${req.daysWithoutWater} days dry
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectRequest) onSelectRequest(req);
        });

        marker.addTo(layerGroup);
      });
    }

    // 3. Plot Emergencies / Hospitals
    if (layers.emergencies && emergencies.length > 0) {
      emergencies.forEach((emg) => {
        const icon = emg.status === 'ACTIVE' ? createEmergencyPulseIcon() : createHospitalIcon();
        const marker = L.marker([emg.latitude, emg.longitude], { icon });

        marker.bindPopup(`
          <div style="font-family: var(--font-sans); min-width: 200px;">
            <div style="font-weight: 800; font-size: 0.925rem; color: #be123c; margin-bottom: 2px;">
              🚨 ${emg.facilityName}
            </div>
            <div style="font-size: 0.75rem; color: #475569; margin-bottom: 6px;">${emg.reason}</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #be123c;">
              Required Volume: ${emg.requiredLiters} L
            </div>
            <div style="font-size: 0.7rem; color: #64748b; margin-top: 4px;">
              Contact: ${emg.contactPerson} (${emg.contactPhone})
            </div>
          </div>
        `);

        marker.addTo(layerGroup);
      });
    }

    // 4. Plot Active Assignment Route & Geofence
    if (activeAssignment) {
      // Geofence Circle (100m)
      if (layers.geofence) {
        const geofenceCircle = L.circle([activeAssignment.targetLat, activeAssignment.targetLng], {
          radius: 120,
          color: activeAssignment.isGeofenceValid ? '#10b981' : '#0284c7',
          fillColor: activeAssignment.isGeofenceValid ? '#10b981' : '#38bdf8',
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '5, 5',
        });
        geofenceCircle.bindTooltip('PostGIS Geofenced Delivery Zone (120m)', { permanent: false, direction: 'top' });
        geofenceCircle.addTo(routeLayer);
      }

      // Polyline Route
      if (layers.routes && activeAssignment.routeCoordinates?.length > 1) {
        const polyline = L.polyline(activeAssignment.routeCoordinates, {
          color: activeAssignment.isReassigned ? '#e11d48' : '#0284c7',
          weight: 5,
          opacity: 0.8,
          lineJoin: 'round',
          dashArray: activeAssignment.isReassigned ? '6, 8' : undefined,
        });
        polyline.addTo(routeLayer);
      }
    }
  }, [tankers, requests, emergencies, activeAssignment, layers]);

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
      {/* Map Target */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Map Controls Top-Right */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Recenter Button */}
        <button
          onClick={recenterMap}
          title="Recenter City Map"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--slate-700)',
          }}
        >
          <Navigation size={18} />
        </button>

        {/* Layer Toggle Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Toggle Map Layers"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-700)',
            }}
          >
            <Layers size={18} />
          </button>

          {showLayerMenu && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: '48px',
                width: '200px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                padding: '10px',
                zIndex: 1000,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>
                GIS Layer Visibility
              </div>
              <LayerCheckbox label="Active Tankers" checked={layers.tankers} onChange={(val) => setLayers({ ...layers, tankers: val })} />
              <LayerCheckbox label="Citizen Requests" checked={layers.requests} onChange={(val) => setLayers({ ...layers, requests: val })} />
              <LayerCheckbox label="Emergencies & Hospitals" checked={layers.emergencies} onChange={(val) => setLayers({ ...layers, emergencies: val })} />
              <LayerCheckbox label="Geofence Perimeter" checked={layers.geofence} onChange={(val) => setLayers({ ...layers, geofence: val })} />
              <LayerCheckbox label="Optimized Routes" checked={layers.routes} onChange={(val) => setLayers({ ...layers, routes: val })} />
            </div>
          )}
        </div>
      </div>

      {/* Map Legend Bottom-Left */}
      {showLegend && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            boxShadow: 'var(--shadow-md)',
            zIndex: 100,
            fontSize: '0.75rem',
            color: 'var(--slate-700)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            maxWidth: 'calc(100% - 32px)',
          }}
        >
          <LegendItem color="#0284c7" label="Tanker (Active)" />
          <LegendItem color="#be123c" label="Critical Need" />
          <LegendItem color="#ea580c" label="High Need" />
          <LegendItem color="#e11d48" label="Hospital Emergency" />
          <LegendItem color="#10b981" label="Geofence Zone" />
        </div>
      )}
    </div>
  );
};

const LayerCheckbox = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '4px 0', cursor: 'pointer', color: 'var(--slate-700)' }}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span>{label}</span>
  </label>
);

const LegendItem = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
    <span style={{ fontWeight: 600 }}>{label}</span>
  </div>
);
