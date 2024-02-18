import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Row, Col, Card } from 'antd';
import NavBar from './NavBar';
import descar from './res/descargaapp.png'



const Carrusel = () => {
  const [avisos, setAvisos] = useState([]);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  // Función para obtener los avisos principales de la API
  const fetchAvisosPrincipales = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/avisos/avisos/');
      const data = await response.json();
      setAvisos(data.avisos_principales);
    } catch (error) {
      console.error('Error al obtener los avisos principales', error);
    }
  };

  useEffect(() => {
    fetchAvisosPrincipales();
  }, []); // Se ejecutará solo una vez al montar el componente

  const buttonStyle = {
    marginTop:'10px',
    width: '150px', // Ajusta el ancho según tus preferencias
    height: '40px', // Ajusta la altura según tus preferencias
    backgroundColor: hovered ? 'black' : '#A80000',
    color: 'white',
    border: 'none',
    borderRadius: '5px', // Ajusta el radio de la esquina según tus preferencias
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontSize: '15px', // Ajusta el tamaño de la fuente según tus preferencias
    fontWeight: 'bold',
  };

  return (
    <>

      <div style={{ overflow: 'hidden' }}>

        <Carousel fade nextIcon={null} prevIcon={null}>
          {avisos.map((aviso) => (
            <Carousel.Item >
              <img
                src={`data:image/png;base64, ${aviso.imagen}`}
                alt={aviso.titulo}
                style={{ width: '100%', height: '500px' }} />
              <Carousel.Caption>
                <h3>{aviso.titulo}</h3>
                <p>{aviso.descripcion}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <Row>
        <Col md={5} style={{ marginLeft: 100, marginTop: 25 }}>

          <Card
            hoverable
            style={{
              height: "100%",
              width: "auto",
              borderRadius: "5%",
              border: "1px solid #A4A4A4"
            }}
            cover={
              <img
                alt="Descarga la aplicación movil"
                src={descar}

              />
            }
            className="text-center"
          >
            <spam style={{ fontWeight: 'bold', color: 'black' }}>Lleva tus pedidos contigo, descarga la app ahora</spam>
            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              PROXIMAMENTE
            </button>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Carrusel;