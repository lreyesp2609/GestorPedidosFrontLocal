import React, { useContext, useState, useEffect  } from "react";
import {Card, Form,Modal, Button, Row,ButtonGroup,
  Col} from 'react-bootstrap';
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../context/CarritoContext";
import { Radio } from 'antd';
import PayPal from "./Paypal";
import Map2 from "./Map2";

const ShoppingCart = () => {
  const [cart, setCart] = useContext(CartContext);
  const [MostrarModal, setMostrarModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  
  const [pagoCompletado, setPagoCompletado] = useState(false); 
  const [modoPago, setModoPago] = useState(null); 
  const [modoPedido, setModoPedido] = useState(null); 
  const [showElegirUbicacion, setShowElegirUbicacion] = useState(false);

  const [locationData, setLocationData] = useState({
    latitud: 0,
    longitud: 0
  });

  const id_cuenta = localStorage.getItem('id_cuenta');
  useEffect(() => {
    
  
    if (id_cuenta) {
      fetch(`http://127.0.0.1:8000/Login/obtener_usuario/${id_cuenta}/`)
        .then(response => response.json())
        .then(data => {
          setUserData(data.usuario);
          
          setLocationData({
            latitud1: data.usuario?.ubicacion1?.latitud || 0,
            longitud1: data.usuario?.ubicacion1?.longitud || 0,
            latitud2: data.usuario?.ubicacion2?.latitud || 0,
            longitud2: data.usuario?.ubicacion2?.longitud || 0,
            latitud3: data.usuario?.ubicacion3?.latitud || 0,
            longitud3: data.usuario?.ubicacion3?.longitud || 0,
          });
        })
        .catch(error => console.error('Error al obtener datos del usuario:', error));
    } else {
      console.error('Nombre de usuario no encontrado en localStorage');
    }
  }, []);

  const handleModoPagoChange = (e) => {
    setModoPago(e.target.value);
  };

  const handleModoPedidoChange = (e) => {
    setModoPedido(e.target.value);
  };
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setShowElegirUbicacion(location === 'Otro');
    let newLocationData = {};
    console.log(`Cambiando a la ubicación: ${location}`);


    switch (location) {
      case 'Casa':
        newLocationData = {
          latitud: locationData.latitud1,
          longitud: locationData.longitud1,
        };
        break;
      case 'Trabajo':
        newLocationData = {
          latitud: locationData.latitud2,
          longitud: locationData.longitud2,
        };
        break;
      case 'Otro':
        newLocationData = {
          latitud: locationData.latitud3,
          longitud: locationData.longitud3,
        };
        break;
      default:
        newLocationData = {
          latitud: 0,
          longitud: 0,
        };
    }
    console.log('Nuevos datos de ubicación:', newLocationData);
    setLocationData((prevLocationData) => ({ ...prevLocationData, ...newLocationData }));
  };
  

  const handleShowCardForm = () => {
    setShowCardForm(true);
  };
  const handleElegirUbicacionClick = () => {

    setShowElegirUbicacion(false);
  };
  const cerrarCardForm = () => {
    setShowCardForm(false);
  };
  const HacerClick = () => {
    if (cart.length > 0) {
      setMostrarModal(true);
    }
  };
  
  const CerrarModal = () => {
    setMostrarModal(false);
    setShowCardForm(false); 

  };
  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.price,
    0
  );

  const CerrarModalDespuesDePago = () => {
    console.log('modoPedido:', modoPedido);

    setMostrarModal(false);
    setShowCardForm(false);
    setPagoCompletado(true); 
    fetch(`http://127.0.0.1:8000/cliente/realizar_pedido/${id_cuenta}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      precio: totalPrice,
      tipo_de_pedido: modoPedido,  // Ajusta según sea necesario
      metodo_de_pago: modoPago,    // Ajusta según sea necesario
      puntos: 0,  // Ajusta según sea necesario
      estado_del_pedido: 'O',  // Ajusta según sea necesario
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
      // Puedes manejar la respuesta según sea necesario
    })
    .catch(error => console.error('Error al realizar el pedido:', error));
    }
  return (
    <>
      <div  style={{ maxWidth: '600px', margin: '0 auto', padding: '20px',}}>
        <div>
          <div style={{ marginTop: '10px', fontSize: '18px' }}>Productos en el carrito: {quantity}</div>
          {cart.length > 0 ? (
          <>
              <ul>
                {cart.map((item) => (
                  <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px', fontSize: '18px', 
                  marginTop:'10px'}}>
                    <img
                      src={`data:image/png;base64,${item.image}`} 
                      alt={`Imagen de ${item.Name}`}
                      style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    {item.Name} - Cantidad: {item.quantity} - Precio: ${item.price}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '10px', fontSize: '18px' }}>Total: ${totalPrice}</div>
            <div style={{display: 'flex', justifyContent: 'end' }}>
              <Button 
              onClick={HacerClick}
              style={{
                marginTop: '20px',
                padding: '10px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >Hacer pedido</Button>
            </div>
            </>
             ) : (
              <div style={{ marginTop: '20px', fontSize: '18px' }}>No hay productos en el carrito.</div>
            )}
        </div>
      </div>

    <Modal show={MostrarModal} onHide={CerrarModal} size="lg" >
      <Modal.Header closeButton  style={{ borderBottom: 'none' }}>
      </Modal.Header>
      <Row>
        <Col>
          <h5>Hola ✌🏻</h5>
          <span>Revisa tu dirección y forma de pago antes de comprar.</span>
          <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione como quiere recibir/retirar su pedido:</div>
          <Radio.Group onChange={handleModoPedidoChange} value={modoPedido}>
            <Col style={{marginLeft:'10px'}}>
              <Row>
                <Radio value="D">Domicilio</Radio>
                <Radio value="R">Retirar</Radio>
                <Radio value="L">Local</Radio>
              </Row>
            </Col>
          </Radio.Group>
          {modoPedido === 'D' && (
          <>
            <ButtonGroup style={{marginLeft:'10px',marginTop: '10px',width:'100%', 
            marginBottom:'10px' }}>
              <Button variant="outline-warning" 
              onClick={() => handleLocationChange('Casa')}
              style={{color:'rgb(255, 121, 32)'}}>Casa</Button>
              <Button variant="outline-warning" 
              onClick={() => handleLocationChange('Trabajo')}
              style={{color:'rgb(255, 121, 32)'}}>Trabajo</Button>
              <Button variant="outline-warning" 
              onClick={() => handleLocationChange('Otro')}
              style={{color:'rgb(255, 121, 32)'}}>Otro</Button>
          </ButtonGroup>
              <h5>Coordenadas de {selectedLocation}:</h5>
              {locationData.latitud !== undefined && locationData.longitud !== undefined ? (
                `Latitud: ${locationData.latitud}, Longitud: ${locationData.longitud}`
              ) : (
                'Coordenadas no disponibles'
              )}
          </>
          )}
            <Modal show={showElegirUbicacion} onHide={() => setShowElegirUbicacion(false)} size="mg">
              <Modal.Header closeButton style={{ borderBottom: 'none' }} />
              <Modal.Body>
                <Map2 onLocationSelect={handleLocationChange} />
              </Modal.Body>
            </Modal>
          <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione modo de pago:</div>
          <Radio.Group onChange={handleModoPagoChange} value={modoPago}>
            <Col style={{marginLeft:'10px'}}>
              <Row>
                <Radio value="T">Transferencia/Tarjeta</Radio>
                {modoPago === 'T' && (
                    <div style={{ marginLeft: '10px', marginTop: '10px' }}>
                      <PayPal onSuccess={CerrarModalDespuesDePago} />
                    </div>
                  )}
                <Radio value="E">Efectivo</Radio>
                <Radio value="F">Fraccionado</Radio>
                <Button style={{ marginLeft: '10px', marginTop: '10px', marginBottom:'10px' }} 
                  disabled={modoPago !== 'E'}>
                  Pagar: ${totalPrice}
                </Button>
              </Row>
            </Col>
          </Radio.Group>
          
        </Col>
        <Col>
          <span>HOLA :D</span>
        </Col>
      </Row>
 

    </Modal>
      
    </>
  );
};

export default ShoppingCart;