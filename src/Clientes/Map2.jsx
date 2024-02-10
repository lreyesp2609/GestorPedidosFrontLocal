import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map2 = ({ onLocationSelect  }) => {
  const [center, setCenter] = useState([-1.0241157747979186, -79.46108497663826]);
  const [marker, setMarker] = useState(null);

  const handleSaveLocation = () => {
    if (marker) {
      onLocationSelect({ latitud: marker.latitude, longitud: marker.longitude });
    }
  };
  const MapClickHandler = () => {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      console.log('Latitud:', lat, 'Longitud:', lng);
      setMarker({ latitude: lat, longitude: lng });

    });

    return null;
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        setMarker({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };

  const handleCancel = () => {
    setMarker(null);
  };



  

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapClickHandler />

        {marker && (
          <Marker position={[marker.latitude, marker.longitude]}>
            <Popup>{`Latitud: ${marker.latitude.toFixed(4)}, Longitud: ${marker.longitude.toFixed(4)}`}</Popup>
          </Marker>
        )}
      </MapContainer>
      <div>
        <button onClick={handleGetCurrentLocation}>
          Obtener Ubicación Actual
        </button>
        <button onClick={handleSaveLocation}>
          Guardar
        </button>
        <button onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Map2;
