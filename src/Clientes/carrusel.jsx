import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Row, Col, Card } from 'antd';
import NavBar from './NavBar';
import descar from './res/descargaapp.png'
import imgsucur from './res/sucursales.png'
import masvendidos from './res/maspedidos.png'
import imgrecompensas from './res/recompensas.png'
import API_URL from '../config';

const Carrusel = () => {
  const [avisos, setAvisos] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [hovered3, setHovered3] = useState(false);
  const [hovered4, setHovered4] = useState(false);

  const handleMouseEnter4 = () => {
    setHovered4(true);
  };

  const handleMouseLeave4 = () => {
    setHovered4(false);
  };

  const handleMouseEnter3 = () => {
    setHovered3(true);
  };

  const handleMouseLeave3 = () => {
    setHovered3(false);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  const handleMouseEnter2 = () => {
    setHovered2(true);
  };

  const handleMouseLeave2 = () => {
    setHovered2(false);
  };

  // Función para obtener los avisos principales de la API
  const fetchAvisosPrincipales = async () => {
    try {
      const response = await fetch(API_URL +'/avisos/avisos/');
      const data = await response.json();
      setAvisos(data.avisos_principales);
    } catch (error) {
      console.error('Error al obtener los avisos principales', error);
    }
  };

  useEffect(() => {
    fetchAvisosPrincipales();
  }, []); // Se ejecutará solo una vez al montar el componente

  // Estilos mejorados para los botones
  const createButtonStyle = (baseColor, isHovered) => ({
    marginTop: '15px',
    height: '44px',
    width: '100%',
    backgroundColor: isHovered ? '#333333' : baseColor,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  });

  const buttonStyle = createButtonStyle('#A80000', hovered);
  const buttonStyle2 = createButtonStyle('#2E7651', hovered2);
  const buttonStyle3 = createButtonStyle('#0B4362', hovered3);
  const buttonStyle4 = createButtonStyle('#C03E62', hovered4);

  const openSucursal = () => {
    window.open('/sucursal', '_self');
  };

  const cardStyle = {
    height: "100%",
    width: "auto",
    borderRadius: "12px",
    border: "1px solid #EEEEEE",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardImageStyle = {
    objectFit: "cover",
    height: "200px",
    width: "100%",
  };

  const cardTextStyle = {
    fontWeight: '600',
    color: '#333333',
    display: 'block',
    fontSize: '16px',
    marginBottom: '5px',
  };

  return (
    <>
      <div style={{ overflow: 'hidden' }}>
        <Carousel 
          fade 
          nextIcon={null} 
          prevIcon={null}
          indicators={true}
          interval={5000}
        >
          {avisos.map((aviso) => (
            <Carousel.Item key={aviso.id}>
              <img
                src={`data:image/png;base64, ${aviso.imagen}`}
                alt={aviso.titulo}
                style={{ 
                  width: '100%', 
                  height: '500px',
                  objectFit: 'cover',
                  filter: 'brightness(0.9)'
                }} />
              <Carousel.Caption style={{
                background: 'rgba(0,0,0,0.5)',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '80%',
                margin: '0 auto'
              }}>
                <h3 style={{ fontWeight: '700' }}>{aviso.titulo}</h3>
                <p>{aviso.descripcion}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '40px auto', 
        padding: '0 20px'
      }}>
        <Row gutter={[24, 24]} style={{ marginTop: 30 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={cardStyle}
              cover={
                <img
                  alt="Descarga la aplicación movil"
                  src={descar}
                  style={cardImageStyle}
                />
              }
              className="text-center"
              bodyStyle={{ padding: '20px' }}
            >
              <span style={cardTextStyle}>Lleva tus pedidos contigo, descarga la app ahora</span>
              <button
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                PROXIMAMENTE
              </button>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={cardStyle}
              cover={
                <img
                  alt="Encuentra tu sucursal más cercana"
                  src={imgsucur}
                  style={cardImageStyle}
                />
              }
              className="text-center"
              bodyStyle={{ padding: '20px' }}
            >
              <span style={cardTextStyle}>Encuentra tu sucursal más cercana</span>
              <button
                style={buttonStyle2}
                onMouseEnter={handleMouseEnter2}
                onMouseLeave={handleMouseLeave2}
                onClick={openSucursal}
              >
                VER SUCURSALES
              </button>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={cardStyle}
              cover={
                <img
                  alt="Descubre los favoritos"
                  src={masvendidos}
                  style={cardImageStyle}
                />
              }
              className="text-center"
              bodyStyle={{ padding: '20px' }}
            >
              <span style={cardTextStyle}>Descubre los favoritos de nuestros clientes</span>
              <button
                style={buttonStyle3}
                onMouseEnter={handleMouseEnter3}
                onMouseLeave={handleMouseLeave3}
              >
                MAS VENDIDOS
              </button>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={cardStyle}
              cover={
                <img
                  alt="Recompensas"
                  src={imgrecompensas}
                  style={cardImageStyle}
                />
              }
              className="text-center"
              bodyStyle={{ padding: '20px' }}
            >
              <span style={cardTextStyle}>Más compras, más regalos: canjea tus puntos</span>
              <button
                style={buttonStyle4}
                onMouseEnter={handleMouseEnter4}
                onMouseLeave={handleMouseLeave4}
              >
                VER RECOMPENSAS
              </button>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Carrusel;