import React, { useContext, useState, useEffect  } from "react";
import Lottie from 'react-lottie';
import { Form,Modal, Button, Row,ButtonGroup,
  Col, Container, Nav} from 'react-bootstrap';
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from "../context/CarritoContext";
import { Radio, InputNumber, Divider, Space, Card,Upload, message    } from 'antd';
import { notification } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';






import PayPal from "./Paypal";
import PayPal2 from "./Paypal2";
import Map3 from "./Map3";
const Pedidos = ({regresar}) => {
    const [cart, setCart] = useContext(CartContext);
    const [mostrarPedido, setMostrarPedido] = useState(false);
  
  
  
  
    const [MostrarModal, setMostrarModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showCardForm, setShowCardForm] = useState(false);
    
    const [pagoCompletado, setPagoCompletado] = useState(false); 
    const [modoPago, setModoPago] = useState(null); 
    const [fraccionadoValue, setFraccionadoValue] = useState(1);
    const [mostrarComponente, setMostrarComponente] = useState(false);
  
    const [modoPedido, setModoPedido] = useState(null); 
    const [showElegirUbicacion, setShowElegirUbicacion] = useState(false);
    const [isAnimationPaused, setIsAnimationPaused] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(1); // Inicialmente trabajando con la ubicación 1


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
    
      const handleModoPagoChange = (value) => {
        setModoPago(value);
      };
      const handleFraccionadoInputChange = (value) => {
        setFraccionadoValue(value);
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
      
      const HacerClick = () => {
        if (cart.length > 0) {
          setMostrarPedido(true);
        }
      };
      
    
      const quantity = cart.reduce((acc, curr) => {
        return acc + curr.quantity;
      }, 0);
    
      const totalPrice = cart.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0
      );
    const PagarPorEfectivo =()=>{
      if (id_cuenta) {
        const detalles_pedido = cart.map(item => ({
          id_producto: item.id,
          cantidad_pedido: item.quantity,
          costo_unitario: item.price,
        }));
    
    
        const formData = new FormData();
      
        formData.append('precio', totalPrice);
        formData.append('tipo_de_pedido', modoPedido);
        formData.append('metodo_de_pago', 'E'); 
        formData.append('puntos', 0); 
        formData.append('estado_del_pedido', 'O'); 
        formData.append('impuesto', 0);
        formData.append('estado_pago', 'En revisión');
        formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
        // Realiza la solicitud POST al backend
        fetch(`http://127.0.0.1:8000/cliente/realizar_pedido/${id_cuenta}/`, {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(responseData => {
          // Maneja la respuesta del backend según sea necesario
          if (responseData.success) {
            console.log('Respuesta del servidor:', responseData);
            console.log('Pedido realizado con éxito.');
            notification.success({
              message: 'Pedido Exitoso',
              description: '¡El pedido se ha completado con éxito!',
            });
          } else {
            console.error('Error al realizar el pedido:', responseData.message);
          }
        })
        .catch(error => {
          console.error('Error en la solicitud:', error);
        })
        .finally(() => {
          setCart([]);
          regresar();
       
        });
      } else {
        console.error('ID de cuenta no encontrado en localStorage');
      }
      

    };
    
    
    
    
    
      const CerrarModalDespuesDePago = () => {
        if (id_cuenta) {
          const detalles_pedido = cart.map(item => ({
            id_producto: item.id,
            cantidad_pedido: item.quantity,
            costo_unitario: item.price,
          }));
      
      
          // Construye el cuerpo de la solicitud con los datos necesarios
          const formData = new FormData();
        
          formData.append('precio', totalPrice);
          formData.append('tipo_de_pedido', modoPedido);
          formData.append('metodo_de_pago', 'E'); // Asumo que 'E' es el método de pago en efectivo
          formData.append('puntos', 0); // Ajusta según sea necesario
          formData.append('estado_del_pedido', 'O'); // Ajusta según sea necesario
          formData.append('impuesto', 0);
          formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
          // Realiza la solicitud POST al backend
          fetch(`http://127.0.0.1:8000/cliente/realizar_pedido/${id_cuenta}/`, {
            method: 'POST',
            body: formData,
          })
          .then(response => response.json())
          .then(responseData => {
            // Maneja la respuesta del backend según sea necesario
            if (responseData.success) {
              console.log('Respuesta del servidor:', responseData);
              console.log('Pedido realizado con éxito.');
              notification.success({
                message: 'Pedido Exitoso',
                description: '¡El pedido se ha completado con éxito!',
              });
            } else {
              console.error('Error al realizar el pedido:', responseData.message);
            }
          })
          .catch(error => {
            console.error('Error en la solicitud:', error);
          })
          .finally(() => {
            setCart([]);
            regresar();
          });
        } else {
          console.error('ID de cuenta no encontrado en localStorage');
        }
        }
    
        const PagarPorFraccionado = () => {
          setMostrarComponente(!mostrarComponente);
          console.log('Pagar por fraccionado con valor:', fraccionadoValue);
        };
        const handleLocationSelect = (location) => {
            setLocationData((prevLocationData) => ({
              ...prevLocationData,
              [`latitud${currentLocation}`]: location.latitud,
              [`longitud${currentLocation}`]: location.longitud,
            }));
            setMostrarModal(false);
          };
          
        
        const handleSaveLocation = () => {
          if (marker) {
            setLocationData((prevLocationData) => ({
              ...prevLocationData,
              [`latitud${currentLocation}`]: marker.latitude,
              [`longitud${currentLocation}`]: marker.longitude,
            }));
            setCurrentLocation((prevLocation) => (prevLocation % 3) + 1); // Cambiar a la siguiente ubicación (1, 2, 3)
          }
        };

        

        const isImage = file => {
          const imageTypes = ['image/jpeg', 'image/png']; 
          return imageTypes.includes(file.type);
        };      
          const [fileList, setFileList] = useState([]);
          const onChange = ({ fileList: newFileList }) => {
            setFileList(newFileList);
          };
          const onPreview = async (file) => {
            let src = file.url;
            if (!src) {
              src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
              });
            }
            const image = new Image();
            image.src = src;
            const imgWindow = window.open(src);
            imgWindow?.document.write(image.outerHTML);
          };
          const beforeUpload = file => {
            if (!isImage(file)) {
              message.error('Solo puedes subir imágenes!');
              return Upload.LIST_IGNORE;
            }
            return true;
          };
return(
<Row style={{marginLeft:'30px', marginRight:'50px'}}>
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
              <Map3
              onLocationSelect={handleLocationSelect}
              onSaveLocation={handleSaveLocation}
            />
              </Modal.Body>
            </Modal>
          <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione modo de pago:</div>
          <Nav fill variant="tabs">
                <Nav.Item>
                    
                    <Nav.Link onClick={() => handleModoPagoChange('T')}>Transferencia</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => handleModoPagoChange('E')}>Efectivo</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => handleModoPagoChange('F')}>Fraccionado</Nav.Link>
                </Nav.Item>
              </Nav>
              {modoPago === 'T' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'
                    , justifyContent: 'center' }}>
                     <Divider>Realize la transfrencia a la siguiente cuenta:</Divider>
                     <div style={{ display: 'flex',  alignItems: 'center'
                    , justifyContent: 'center' }}>
                     <Card
                        style={{
                          width: 400,
                          marginRight: '10px', 
                        }}
                      >
                        <p>Banco: Pichincha</p>
                        <p>Tipo de cuenta: Ahorros</p>
                        <p>Número de cuenta: 2207213048</p>
                        <p>Nombre: Angie Mayerli Díaz Veliz</p>
                        <p>Cedula: 0927711309</p>
                        <p>Email: angiediazv9@gmail.com</p>
                    </Card>
                    <Card
                        style={{
                          width: 400,
                        }}
                      >
                        <p>Banco: Guayaquil</p>
                        <p>Tipo de cuenta: Ahorros</p>
                        <p>Número de cuenta: 00012119645</p>
                        <p>Nombre: Angie Mayerli Díaz Veliz</p>
                        <p>Cedula: 0927711309</p>
                        <p>Email: angiediazv9@gmail.com</p>
                    </Card>
                    </div>
                    <Divider orientation="left">Comprobante de pago (foto, escaneo ó captura de pantalla)</Divider>
                    <div rotationSlider style={{ display: 'flex',  alignItems: 'center'
                      , justifyContent: 'center' }}>
                    <ImgCrop >
                    <Upload
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={beforeUpload}
                      
                    >
                    {fileList.length < 1 && '+ Subir comprobante'}
                    </Upload>
                    </ImgCrop>
                    </div>
                 
                    <Button style={{marginTop:'10px' ,width:'400px'}}
                    disabled={fileList.length === 0 || modoPedido === null}
                    onClick={PagarPorEfectivo} 
                    >
                    Pagar: ${totalPrice}
                    </Button>
           
                  <Divider>O pague con paypal </Divider>
                    <div style={{   width: '400px' }} >
                      <PayPal onSuccess={CerrarModalDespuesDePago} />
                    </div>
                    </div>
                  )}
                 
                {modoPago === 'E' && (
                <div className="d-grid gap-2">
                    <Button style={{ marginTop: '50px', marginBottom:'240px'}} 
                    disabled={modoPago !== 'E'}
                    onClick={PagarPorEfectivo} 
                    >
                    Pagar: ${totalPrice}
                    </Button>
                </div> 
                    )}
              
              <div style={{ textAlign: 'center', marginTop: '20px', marginBottom:'20px' }}>
                {modoPago === 'F' && (
                    <Space align="center">
                    <InputNumber
                        min={0}
                        value={fraccionadoValue}
                        onChange={handleFraccionadoInputChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <Button onClick={PagarPorFraccionado}>
                        Pagar: ${fraccionadoValue.toFixed(2)}
                    </Button>
                    </Space>
                )}
                </div>
            {mostrarComponente && modoPago === 'F' && (
                    <div style={{ marginBottom:'122px',  width: '400px',  margin: '0 auto'   }}>
                      <PayPal2 onSuccess={CerrarModalDespuesDePago} amount={fraccionadoValue}/>
                    </div>
                  )}
          
        </Col>
        <Col>
        <div>
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
        </div>
        </Col>
      </Row>
)
}




export default Pedidos;
