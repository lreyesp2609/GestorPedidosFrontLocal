import React, { useContext, useState, useEffect } from "react";
import Lottie from "react-lottie";
import {
  Form,
  Modal,
  Button,
  Row,
  ButtonGroup,
  Container,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../context/CarritoContext";
import { Radio, InputNumber } from "antd";
import { Avatar, Card, Skeleton, Badge } from 'antd';
const { Meta } = Card;
import { notification } from "antd";
import animationData from "../assets/lottis/B.json"; // Importa el archivo JSON de tu animación
import Pedidos from "./pedido"

const ShoppingCart = () => {
  const [cart, setCart] = useContext(CartContext);
  const [mostrarPedido, setMostrarPedido] = useState(false);

  const [MostrarModal, setMostrarModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);

  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [modoPago, setModoPago] = useState(null);
  const [fraccionadoValue, setFraccionadoValue] = useState(0);
  const [mostrarComponente, setMostrarComponente] = useState(false);
  const [modoPedido, setModoPedido] = useState(null);
  const [showElegirUbicacion, setShowElegirUbicacion] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const lottieOptions = {
    loop: true,
    autoplay: !isAnimationPaused,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const toggleAnimation = () => {
    setIsAnimationPaused(!isAnimationPaused);
  };
  const estiloTexto = {
    marginTop: "200px",
    fontSize: "24px", // Ajusta el tamaño del texto
    textAlign: "center",
    fontFamily: "Circular, sans-serif", // Cambia el estilo de letra
    color: "Black", // Cambia el color del texto
    marginBottom: "270px",
  };

  const [locationData, setLocationData] = useState({
    latitud: 0,
    longitud: 0,
  });

  const id_cuenta = localStorage.getItem("id_cuenta");
  useEffect(() => {
    if (id_cuenta) {
      fetch(`http://127.0.0.1:8000/Login/obtener_usuario/${id_cuenta}/`)
        .then((response) => response.json())
        .then((data) => {
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
        .catch((error) =>
          console.error("Error al obtener datos del usuario:", error)
        );
    } else {
      console.error("Nombre de usuario no encontrado en localStorage");
    }
  }, []);







  const handleModoPagoChange = (e) => {
    setModoPago(e.target.value);
    setFraccionadoValue(1);
  };
  const handleFraccionadoInputChange = (value) => {
    setFraccionadoValue(value);
  };
  const handleModoPedidoChange = (e) => {
    setModoPedido(e.target.value);
  };
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setShowElegirUbicacion(location === "Otro");
    let newLocationData = {};
    console.log(`Cambiando a la ubicación: ${location}`);

    switch (location) {
      case "Casa":
        newLocationData = {
          latitud: locationData.latitud1,
          longitud: locationData.longitud1,
        };
        break;
      case "Trabajo":
        newLocationData = {
          latitud: locationData.latitud2,
          longitud: locationData.longitud2,
        };
        break;
      case "Otro":
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
    console.log("Nuevos datos de ubicación:", newLocationData);
    setLocationData((prevLocationData) => ({
      ...prevLocationData,
      ...newLocationData,
    }));
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
      setMostrarPedido(true);
    }
  };
  const regresar = () => {
    setMostrarPedido(false);

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
      <div>
        {mostrarPedido ? (
          <Pedidos regresar={regresar} />
        ) : (
          <div style={{ marginTop: '5px' }}>
            {cart.length > 0 ? (
              <>
                <Container>
                  <Badge count={"Productos en el carrito: " + quantity} showZero color='#faad14' />

                  <ul>
                    {cart.map((item) => (

                      <div
                        key={item.id}
                        style={{

                          fontSize: "18px",
                          marginTop: "10px",
                        }}
                      >
                        <Row>
                          <Col md={4}  >
                            <img style={{
                              width: "90px",
                              height: "90px",
                              border: '1px solid #9b9b9b',
                            }}
                              src={`data:image/png;base64,${item.image}`} alt="User" />
                          </Col>
                          <Col md={8}>
                            <strong>{item.Name}</strong>
                            <br />
                            <Meta
                              description={`Cantidad: ${item.quantity} - Precio: $${item.price}`}
                            />
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </ul>

                  <Col style={{
                    backgroundColor: 'rgb(255, 255, 255)', borderRadius: '5px'
                    , marginLeft: '10px'
                  }}  >
                    <Row>
                      <Col>
                        <div style={{ marginTop: "10px", fontSize: "18px" }}>
                          Total: ${totalPrice}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="d-grid gap-2">
                          <Button
                            onClick={HacerClick}
                            size="lg"
                            style={{
                              marginBottom: "10px",
                              marginTop: "10px",
                              backgroundColor: "#131212",
                              borderRadius: "8px",
                              padding: "15px 30px",
                              fontSize: "16px",
                              color: "#fff",
                              border: "1px solid #131212",
                              transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#333")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#000")
                            }
                          >
                            Hacer pedido
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Container>
              </>
            ) : (
              <div style={estiloTexto}>
                No hay productos en el carrito.
                <br />
                <div onClick={toggleAnimation}>
                  <Lottie options={lottieOptions} height={100} width={100} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>

  );
};

export default ShoppingCart;
 
