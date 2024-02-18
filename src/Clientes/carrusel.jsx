import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Row, Col, Card } from 'antd';
import NavBar from './NavBar';
import descar from './res/descargaapp.png'
import imgsucur from './res/sucursales.png'
import masvendidos from './res/maspedidos.png'
import imgrecompensas from './res/recompensas.png'



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
    width: '200px', // Ajusta el ancho según tus preferencias
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
  const buttonStyle2 = {
    marginTop:'10px',
    width: '200px', // Ajusta el ancho según tus preferencias
    height: '40px', // Ajusta la altura según tus preferencias
    backgroundColor: hovered2 ? 'black' : '#2E7651',
    color: 'white',
    border: 'none',
    borderRadius: '5px', // Ajusta el radio de la esquina según tus preferencias
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontSize: '15px', // Ajusta el tamaño de la fuente según tus preferencias
    fontWeight: 'bold',
  };
  const buttonStyle3 = {
    marginTop:'10px',
    width: '200px', // Ajusta el ancho según tus preferencias
    height: '40px', // Ajusta la altura según tus preferencias
    backgroundColor: hovered3 ? 'black' : '#0B4362',
    color: 'white',
    border: 'none',
    borderRadius: '5px', // Ajusta el radio de la esquina según tus preferencias
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontSize: '15px', // Ajusta el tamaño de la fuente según tus preferencias
    fontWeight: 'bold',
  };
  const buttonStyle4 = {
    marginTop:'10px',
    width: '200px', // Ajusta el ancho según tus preferencias
    height: '40px', // Ajusta la altura según tus preferencias
    backgroundColor: hovered4 ? 'black' : '#C03E62',
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
        <Col md={5} style={{ margin: 25, marginTop: 25 }}>

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
            <spam style={{ fontWeight: 'bold', color: 'black',display:'block' }}>Lleva tus pedidos contigo, descarga la app ahora</spam>
            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              PROXIMAMENTE
            </button>
          </Card>
        </Col>
        <Col md={5} style={{ margin: 25, marginTop: 25 }}>

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
                alt="Encuentra tu sucursal más cercana"
                src={imgsucur}

              />
            }
            className="text-center"
          >
            <spam style={{ fontWeight: 'bold', color: 'black',display:'block' }}>Encuentra tu sucursal más cercana</spam>
            <button
              style={buttonStyle2}
              onMouseEnter={handleMouseEnter2}
              onMouseLeave={handleMouseLeave2}
            >
              VER SUCURSALES
            </button>
          </Card>
        </Col>
        <Col md={5} style={{ margin: 25, marginTop: 25 }}>

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
                alt="Encuentra tu sucursal más cercana"
                src={masvendidos}

              />
            }
            className="text-center"
          >
            <spam style={{ fontWeight: 'bold', color: 'black',display:'block' }}>Descubre los favoritos de nuestros clientes</spam>
            <button
              style={buttonStyle3}
              onMouseEnter={handleMouseEnter3}
              onMouseLeave={handleMouseLeave3}
            >
             MÁS VENDIDOS
            </button>
          </Card>
        </Col>
        <Col md={5} style={{ margin: 25, marginTop: 25 }}>

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
                alt="Encuentra tu sucursal más cercana"
                src={imgrecompensas}

              />
            }
            className="text-center"
          >
            <spam style={{ fontWeight: 'bold', color: 'black',display:'block' }}>Más compras, más regalos: canjea tus puntos</spam>
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
    </>
  );
}

export default Carrusel;