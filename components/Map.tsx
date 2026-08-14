'use client';

import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';
import type { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import { geoJSON, type Layer } from 'leaflet';
import { GeoJSON, LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet';

type ModelProperties = {
  layer?: string;
  river?: string;
  reach?: string;
  river_station?: string;
  max_water_surface_ft?: number;
  max_channel_velocity_fps?: number;
};

const MODEL_LAYER_URL = '/data/hec-ras-results.geojson';

function FitModelExtent({ data }: { data: FeatureCollection | null }) {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const bounds = geoJSON(data).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.12));
  }, [data, map]);

  return null;
}

function modelStyle(feature?: Feature) {
  const properties = feature?.properties as ModelProperties | null;

  if (properties?.layer === 'model-reach') {
    return { color: '#075985', weight: 4, opacity: 0.9 };
  }

  return { color: '#f97316', weight: 2, opacity: 0.9 };
}

function modelPopup(feature: Feature, layer: Layer) {
  const properties = feature.properties as ModelProperties | null;
  if (!properties || properties.layer !== 'cross-section') return;

  const waterSurface = properties.max_water_surface_ft?.toFixed(2) ?? 'Not available';
  const velocity = properties.max_channel_velocity_fps?.toFixed(2) ?? 'Not available';

  layer.bindPopup(
    `<strong>HEC-RAS cross section ${properties.river_station ?? ''}</strong>` +
      `<br />${properties.river ?? 'Model river'} · ${properties.reach ?? 'Model reach'}` +
      `<br />Peak water surface: ${waterSurface} ft` +
      `<br />Peak channel velocity: ${velocity} ft/s`,
  );
}

export default function Map() {
  const [modelData, setModelData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch(MODEL_LAYER_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load HEC-RAS results');
        return response.json() as Promise<FeatureCollection>;
      })
      .then(setModelData)
      .catch(() => setModelData(null));
  }, []);

  return (
    <MapContainer
      center={[40.055, -75.28]}
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
      {modelData && (
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="HEC-RAS model results">
            <GeoJSON
              data={modelData as GeoJsonObject}
              style={modelStyle}
              onEachFeature={modelPopup}
            />
          </LayersControl.Overlay>
        </LayersControl>
      )}
      <FitModelExtent data={modelData} />
    </MapContainer>
  );
}
