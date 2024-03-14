import React, { useState, useEffect } from 'react';
import { notification, Divider, Button, Input, Spin } from 'antd';
import { Row, Col, Modal } from 'react-bootstrap';
import MapS from '../Clientes/MapasSucursales';
import Geosector from './geosector';
import API_URL from '../config.js';
const ZonasCover = () => {
    const [MostrarModal, setMostrarModal] = useState(false);
    const [nombreGeo, setNombreGeo] = useState('');
    const CerrarModal = () => {
        setMostrarModal(false);
    };
    const guardarRuta = async (jsondetalle) => {
        console.log(nombreGeo);
        try {
            console.log('Lllega algo:');
            console.log(jsondetalle);
            if(nombreGeo){
                const formDataObject = new FormData();
                formDataObject.append('datosGeosector', JSON.stringify(jsondetalle));
                formDataObject.append('secnombre', nombreGeo);
                formDataObject.append('secdescripcion', 'Sector de atencion');
                formDataObject.append('tipo', 'R');
                const response = await fetch(API_URL + '/sucursal/crearGeosector/', {
                    method: 'POST',
                    body: formDataObject,
                });
    
    
                const responseData = await response.json();
    
                if (responseData.mensaje) {
                    notification.success({
                        message: 'Éxito',
                        description: 'Se creo la ruta con exito',
                    });
                    setNombreGeo('');
                    setMostrarModal(false);
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Error al crear la ruta: ' + responseData.error,
                    });
                }
            }else{
                notification.error({
                    message: 'Error',
                    description: 'Completa los campos',
                });
            }
            
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario:' + error,
            });
        }
    }
    return (
        <div>
            <Row>
                <Divider>Zonas de cobertura</Divider>
                <Col md={12}>
                    <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={() => setMostrarModal(true)}>
                        Crear zona de cobertura
                    </Button>
                </Col>
            </Row>
            <Modal show={MostrarModal} onHide={CerrarModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Crear zona</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                            Ingresa el nombre de tu zona:
                        </Col>
                        <Col md={8}>
                            <Input
                                onChange={(e) => setNombreGeo(e.target.value)}
                                style={{ width: "100%", height: "40px" }}
                            />
                        </Col>
                    </Row>
                    <Geosector onGeoSectorSave={guardarRuta} />
                </Modal.Body>
            </Modal>
        </div>

    )

};

export default ZonasCover;