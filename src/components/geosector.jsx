import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMapEvent } from 'react-leaflet';
import { Button, notification } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UndoOutlined } from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';
import pointInPolygon from 'point-in-polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

const Geosector = ({ onGeoSectorSave, shadedPolygonCoordinates ,prevValores}) => {
    const [center, setCenter] = useState([-1.0241157747979186, -79.46108497663826]);
    const [currentLocation, setCurrentLocation] = useState([]);
    const [polyline, setPolyline] = useState([]);
    const [polygon, setPolygon] = useState(null);
    const [positionNumber, setPositionNumber] = useState(1);

    const handleCancel = () => {
        setCurrentLocation([]);
        setPolyline([]);
        setPolygon(null);
        setPositionNumber(1);
    };

    const MapClickHandler = () => {
        useMapEvent('click', (event) => {
            const { lat, lng } = event.latlng;
            const newMarker = { id: Date.now(), latitude: lat, longitude: lng, position: positionNumber };
            setCurrentLocation([...currentLocation, newMarker]);
            setPositionNumber(positionNumber + 1);
        });

        return null;
    };

    useEffect(() => {
        if(shadedPolygonCoordinates){
            setCenter([shadedPolygonCoordinates.longitude,shadedPolygonCoordinates.latitude]);
        }
        if (prevValores) {
            const initialLocations = prevValores.map((ubicacion) => ({
                id: ubicacion.id_ubicacion,
                latitude: parseFloat(ubicacion.latitud),
                longitude: parseFloat(ubicacion.longitud),
                position: ubicacion.position,
            }));

            setCurrentLocation(initialLocations);
            setPositionNumber(initialLocations.length + 1);
        }
    }, [prevValores]);

    useEffect(() => {
        setPolyline(currentLocation);

        if (currentLocation.length > 2) {
            const latLngs = currentLocation.map((marker) => [marker.latitude, marker.longitude]);
            setPolygon(latLngs);
        } else {
            setPolygon(null);
        }
    }, [currentLocation]);

    useEffect(() => {
        const geoSectorJSON = currentLocation.map((marker) => ({
            id: marker.id,
            latitude: marker.latitude,
            longitude: marker.longitude,
            position: marker.position,
        }));
    }, [currentLocation]);

    const handleUndo = () => {
        setCurrentLocation(currentLocation.slice(0, -1));
        setPositionNumber(positionNumber - 1);
    };

    const handleSaveGeoSector = () => {
        if (currentLocation && shadedPolygonCoordinates) {
            const shadedCoordinatesArray = [parseFloat(shadedPolygonCoordinates.latitude), parseFloat(shadedPolygonCoordinates.longitude)];
            if (shadedCoordinatesArray) {
                const coordinatesArray = currentLocation.map((marker) => [marker.latitude, marker.longitude]);
                if (coordinatesArray) {
                    const isInside = pointInPolygon(shadedCoordinatesArray, coordinatesArray);
                    if (isInside) {
                        const geoSectorJSON = currentLocation.map((marker) => ({
                            id: marker.id,
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                            position: marker.position,
                        }));
                        console.log(geoSectorJSON);
                        if(geoSectorJSON != null){
                            onGeoSectorSave(geoSectorJSON);
                        }
                        
                    } else {
                        notification.warning({
                            message: 'Algo salió mal',
                            description: 'Parece que está intentando configurar una zona de cobertura, fuera de la ubicación de su sucursal.'
                        });
                    }
                } else {
                    console.error('Error: coordinatesArray es undefined');
                }
            } else {
                notification.warning({
                    message: 'Algo salió mal',
                    description: 'No tiene asignada la ubicación de su sucursal.'
                });
            }
        } else {
            notification.warning({
                message: 'Algo salió mal',
                description: 'No ha creado una zona de cobertura.'
            });
        }
    };
    useEffect(() => {
        if (shadedPolygonCoordinates && shadedPolygonCoordinates.latitude && shadedPolygonCoordinates.longitude) {
          setCenter([parseFloat(shadedPolygonCoordinates.latitude), parseFloat(shadedPolygonCoordinates.longitude)]);
        }
      }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Row align="left">
                <Col>
                    <Button icon={<UndoOutlined />} onClick={handleUndo} style={{ margin: '1%' }}></Button>
                    <Button onClick={handleSaveGeoSector}>Guardar zona de cobertura</Button>
                    <Button onClick={handleCancel} style={{ margin: '1%' }}>Limpiar</Button>
                </Col>
            </Row>
            {shadedPolygonCoordinates && shadedPolygonCoordinates.latitude && (
                <MapContainer center={[shadedPolygonCoordinates.latitude,shadedPolygonCoordinates.longitude]} zoom={13} style={{ height: '1000px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler/>
                {currentLocation.map((marker) => (
                    <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    draggable={true}
                    icon={L.divIcon({
                        className: 'custom-marker',
                        html: '<div class="icon-container" style="background-color: black; border-radius: 50%; width: 10px; height: 10px;"></div>',
                        iconSize: [10, 10],
                    })}
                >
                    <Popup>{`Latitud: ${marker.latitude.toFixed(4)}, Longitud: ${marker.longitude.toFixed(4)}, Posición: ${marker.position}`}</Popup>
                </Marker>
                ))}
                {shadedPolygonCoordinates && (
                    <Marker
                    position={[parseFloat(shadedPolygonCoordinates.latitude), parseFloat(shadedPolygonCoordinates.longitude)]}
                    icon={L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    })}
                >
                        <Popup>sucursal</Popup>
                    </Marker>
                )}
                {polyline.length > 1 && (
                    <>
                        <Polyline
                            pathOptions={{ color: 'blue' }}
                            positions={polyline.map((marker) => [marker.latitude, marker.longitude])}
                            key={polyline.map((marker) => `${marker.latitude}_${marker.longitude}`).join('_')}
                        />
                        {polygon && (
                            <Polygon
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }}
                                positions={polygon}
                            />
                        )}
                    </>
                )}
            </MapContainer>
            )||(
                <MapContainer center={center} zoom={13} style={{ height: '1000px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler/>
                {currentLocation.map((marker) => (
                    <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    draggable={true}
                    icon={L.divIcon({
                        className: 'custom-marker',
                        html: '<div class="icon-container" style="background-color: black; border-radius: 50%; width: 10px; height: 10px;"></div>',
                        iconSize: [10, 10],
                    })}
                >
                    <Popup>{`Latitud: ${marker.latitude.toFixed(4)}, Longitud: ${marker.longitude.toFixed(4)}, Posición: ${marker.position}`}</Popup>
                </Marker>
                ))}
                {shadedPolygonCoordinates && (
                    <Marker
                    position={[parseFloat(shadedPolygonCoordinates.latitude), parseFloat(shadedPolygonCoordinates.longitude)]}
                    icon={L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    })}
                >
                        <Popup>sucursal</Popup>
                    </Marker>
                )}
                {polyline.length > 1 && (
                    <>
                        <Polyline
                            pathOptions={{ color: 'blue' }}
                            positions={polyline.map((marker) => [marker.latitude, marker.longitude])}
                            key={polyline.map((marker) => `${marker.latitude}_${marker.longitude}`).join('_')}
                        />
                        {polygon && (
                            <Polygon
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }}
                                positions={polygon}
                            />
                        )}
                    </>
                )}
            </MapContainer>
            )}
            
            <p></p>
        </div>
    );
};

export default Geosector;