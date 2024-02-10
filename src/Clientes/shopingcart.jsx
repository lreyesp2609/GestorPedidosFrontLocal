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
  const [showElegirUbicacion, setShowElegirUbicacion] = useState(false);

  const [locationData, setLocationData] = useState({
    latitud1: 0,
    longitud1: 0,
    latitud2: 0,
    longitud2: 0,
    latitud3: 0,
    longitud3: 0,
  });
  useEffect(() => {
    const nombreUsuario = localStorage.getItem('username');
  
    if (nombreUsuario) {
      fetch(`http://127.0.0.1:8000/Login/obtener_usuario/${nombreUsuario}/`)
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


  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setShowElegirUbicacion(location === 'Otro');

    setLocationData({
      ...locationData,
      latitud1: data.usuario?.ubicacion1?.latitud || 0,
      longitud1: data.usuario?.ubicacion1?.longitud || 0,
    });
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
  const CerrarModalDespuesDePago = () => {
    setMostrarModal(false);
    setShowCardForm(false);
    setPagoCompletado(true); 
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
          <h5>Hola ✌🏻 </h5>
          <span>Revisa tu dirección y forma de pago antes de comprar.</span>
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
          <div>Dirección de entrega: {selectedLocation}</div>
          <div>Latitud: {locationData[`latitud${selectedLocation === 'Casa' ? 1 : selectedLocation === 'Trabajo' ? 2 : 3}`]}</div>
          <div>Longitud: {locationData[`longitud${selectedLocation === 'Casa' ? 1 : selectedLocation === 'Trabajo' ? 2 : 3}`]}</div>
            
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