import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Input, message } from 'antd';

const Mapafijo = ({ latitud, longitud,idm }) => {
  const defaultLat = -1.0120960779505797;
  const defaultLng = -79.47119403153062;

  const mapRef = useRef(null);
  const [inputLat, setInputLat] = useState(latitud || defaultLat);
  const [inputLng, setInputLng] = useState(longitud || defaultLng);

  useEffect(() => {
    const currentLat = latitud || defaultLat;
    const currentLng = longitud || defaultLng;

    if (!mapRef.current) {
         
        console.log('El mapa será: '+idm)
        const newMap = L.map('map' + idm, {
            center: [currentLat, currentLng],
            zoom: 13,
            dragging: false, 
            zoomControl: false, 
          });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap);

      if (latitud !== null && longitud !== null && latitud !== undefined && longitud !== undefined) {
        const marker = L.marker([currentLat, currentLng]).addTo(newMap);
        mapRef.current = { map: newMap, marker };
      } else {
        const messageMarker = L.marker([defaultLat, defaultLng]).addTo(newMap);
        mapRef.current = { map: newMap, marker: messageMarker };
      }

    } else {
      mapRef.current.map.setView([currentLat - 0.025, currentLng], 13);

      if (mapRef.current.marker) {
        mapRef.current.marker.setLatLng([currentLat, currentLng]);
      }
    }
  }, [latitud, longitud, defaultLat, defaultLng]);



  

  



  

  

  return (
    <div>
      <div id={"map"+idm} style={{ height: '536px' }}></div>
    </div>

  );
};

export default Mapafijo;
