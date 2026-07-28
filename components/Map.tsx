'use client';

import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer } from 'react-leaflet';

export default function Map() {
  return (
    <MapContainer
      center={[39.965, -75.183]}
      zoom={13}
      style={{
        height: '600px',
        width: '100%',
        borderRadius: '12px',
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}