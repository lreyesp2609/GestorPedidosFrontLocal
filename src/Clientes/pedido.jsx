import React, { useContext, useState, useEffect } from "react";
import Lottie from 'react-lottie';
import dayjs from 'dayjs';
import {
  Form, Modal, Button, Row, ButtonGroup,
  Col, Container, Nav
} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from "../context/CarritoContext";
import { TimePicker, InputNumber, Divider, Space, Card, Upload, message, Segmented, Badge } from 'antd';
import { notification, Alert, Tooltip, Pagination, Tag } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import PayPal from "./Paypal";
import PayPal2 from "./Paypal2";
import Map3 from "./Map3";
import imgentrega from "./res/entrega.png";
import imglocal from "./res/local.png";
import imghogar from "./res/hogar.png";
import imgtrabajao from "./res/localizacion.png";
import imgotro from "./res/ubicacion.png";
import imgtransfer from "./res/pagmovil.png";
import imgefectivo from "./res/pagefectivo.png";
import imgdividir from "./res/dividirpagos.png";
import imgpaypal from "./res/paypal.png";
const Pedidos = ({ regresar }) => {
  const [cart, setCart] = useContext(CartContext);
  const [mostrarPedido, setMostrarPedido] = useState(false);
  const [MostrarModal, setMostrarModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('Casa');
  const [showCardForm, setShowCardForm] = useState(false);
  const format = 'HH:mm';
  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [modoPago, setModoPago] = useState('E');
  const [fraccionadoValue, setFraccionadoValue] = useState(1);
  const [mostrarComponente, setMostrarComponente] = useState(false);
  const [modoPedido, setModoPedido] = useState("D");
  const [showElegirUbicacion, setShowElegirUbicacion] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [sucursalesData, setSucursalesData] = useState([]);
  const [sucursal, setSucursal] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(1);
  const [currentHour, setCurrentHour] = useState(dayjs().hour());
  const [HoraEntrega, setHoraEntrega] = useState(null);
  const [Permitido, setPermitido] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/empleado/obtener_datosB/');
      const result = await response.json();

      setData(result.Cuentas);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const cambiarhora = (hora) => {
    setHoraEntrega(hora);
    console.log('La hora llega:');
    console.log(hora);
    console.log(sucursalesData);

    const now = new Date();
    const dayOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][now.getDay()];
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const sucursalDeseada = sucursalesData.find((sucursalsele) => sucursalsele.id_sucursal === sucursal);
    console.log(sucursalDeseada);
    if (sucursalDeseada) {
      const horarioAbierto = sucursalDeseada.horario && sucursalDeseada.horario.detalles
        ? sucursalDeseada.horario.detalles.find((detalle) => {
          const fechaInicio = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horainicio}`);
          const fechaFin = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horafin}`);
          const horaSeleccionada = new Date(hora.$y, hora.$M, hora.$D, hora.$H, hora.$m, hora.$s);
          console.log("fechaInicio: " + fechaInicio);
          console.log("fecha enviada: " + horaSeleccionada);
          console.log("Fecha fin " + fechaFin);
          return detalle.dia === dayOfWeek &&
            fechaInicio <= horaSeleccionada &&
            fechaFin >= horaSeleccionada;
        })
        : null;

      if (horarioAbierto) {
        console.log('La sucursal estaría abierta en la hora seleccionada.');
        notification.success({
          message: 'La sucursal está disponible en la hora seleccionada'
        });
        setPermitido(false);
      } else {
        console.log('La sucursal estaría cerrada en la hora seleccionada.');
        notification.error({
          message: 'La sucursal estaría cerrada en la hora seleccionada.'
        });
        setPermitido(true);
      }
    } else {
      console.log('No se encontró la sucursal con el ID proporcionado.');
      notification.error({
        message: 'No se encuentra ninguna sucursal.'
      });
      setPermitido(true);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };
  const listarsucursales = () => {
    fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/')
      .then((response) => response.json())
      .then((data) => {
        console.log(data.sucursales);
        const sucursalesConEstado = obtenerhorarios(data.sucursales);
        setSucursalesData(sucursalesConEstado);
        console.log(sucursalesConEstado);
      })
      .catch((error) => {
        console.error('Error al obtener los datos de sucursales:', error);
      });
  };

  const verificarUbicacion = (newLocationData) => {
    if (id_cuenta) {
      const formData = new FormData();
      formData.append('latitud', newLocationData.latitud);
      formData.append('longitud', newLocationData.longitud);

      // Realiza la solicitud POST al backend
      fetch('http://127.0.0.1:8000/sucursal/secSucursal/', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.sucursal) {
            const sucursalesConEstado = obtenerhorarios(responseData.sucursal);
            if (sucursalesConEstado[0].estadoApertura === 'Abierto ahora') {
              notification.success({
                message: 'Sucursal disponible'
              });
              setSucursal(sucursalesConEstado[0].id_sucursal);
              setPermitido(false);
            }
            else {
              console.log("Ubicacion:");
              console.log(sucursalesConEstado);
              notification.error({
                message: 'No hay sucursales abiertas actualmente',
                description: 'Prueba más tarde o revisa otras sucursales',
              });
              setPermitido(true);
            }
          } else {
            notification.error({
              message: '¡Algo salió mal!',
              description: 'No hay sucursales disponibles actualmente',
            });
            setPermitido(true);
          }
        })
        .catch(error => {
          notification.error({
            message: '¡Algo salió mal!',
            description: '¡No se pudo buscar la sucursal!',
          });
          setPermitido(true);
          console.error('Error en la solicitud:', error);
        })
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
      setPermitido(true);
    }


  };



  const obtenerhorarios = (listSucursales) => {

    try {
      const now = new Date();
      const dayOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][now.getDay()];
      const month = now.getMonth() + 1; // Los meses en JavaScript son de 0 a 11, así que sumamos 1
      const day = now.getDate();
      console.log('Día de la semana actual:', dayOfWeek);
      const sucursalesConEstado = listSucursales.map((sucursal) => {
        const horarioAbierto = sucursal.horario && sucursal.horario.detalles
          ? sucursal.horario.detalles.find(
            (detalle) => {
              const fechaInicio = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horainicio}`);
              const fechaFin = new Date(`${now.getFullYear()}-${month}-${day} ${detalle.horafin}`);

              console.log('Fecha de inicio:', fechaInicio);
              console.log('Fecha de fin:', fechaFin);
              console.log('dia actual:', detalle.dia);
              console.log('Fecha actual:', now);
              return detalle.dia === dayOfWeek &&
                fechaInicio <= now &&
                fechaFin >= now;
            }
          )
          : null;

        return {
          ...sucursal,
          estadoApertura: horarioAbierto ? 'Abierto ahora' : 'Cerrado',
        };
      });
      return sucursalesConEstado;
    } catch (error) {
      console.error('Error al trabajar con fechas:', error);
    }
  }
  const [locationData, setLocationData] = useState({
    latitud: undefined,
    longitud: undefined
  });


  const id_cuenta = localStorage.getItem('id_cuenta');
  useEffect(() => {
    if (id_cuenta) {
      listarsucursales();
      fetch(`http://127.0.0.1:8000/Login/obtener_usuario/${id_cuenta}/`)
        .then(response => response.json())
        .then(data => {
          setUserData(data.usuario);

          setLocationData({
            latitud1: data.usuario?.ubicacion1?.latitud || undefined,
            longitud1: data.usuario?.ubicacion1?.longitud || undefined,
            latitud2: data.usuario?.ubicacion2?.latitud || undefined,
            longitud2: data.usuario?.ubicacion2?.longitud || undefined,
            latitud3: data.usuario?.ubicacion3?.latitud || undefined,
            longitud3: data.usuario?.ubicacion3?.longitud || undefined,
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
  const handleModoPedidoChange = (value) => {
    setPermitido(true);
    setModoPedido(value);

  };
  const handleLocationChange = (value) => {
    setHoraEntrega(null);
    setSelectedLocation(value);
    setShowElegirUbicacion(value === 'Otro');
    let newLocationData = {};
    console.log(`Cambiando a la ubicación: ${location}`);
    const tpicker = document.getElementById('time-envy');
    tpicker.value = '';
    switch (value) {
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
    }
    console.log('Nuevos datos de ubicación:', newLocationData);
    setLocationData((prevLocationData) => ({ ...prevLocationData, ...newLocationData }));
    verificarUbicacion(newLocationData);
  };

  const HacerClick = () => {
    regresar();
  };

  const obtenerNombreSucursal=(idSucursal)=>{
    const sucursalDeseada = sucursalesData.find((sucursalsele) => sucursalsele.id_sucursal === idSucursal);
    return sucursalDeseada.snombre;
  }

  const ivaPrecio = () => {
    let iva = 0;
    for (let i = 0; i < cart.length; i++) {
      const currentItem = cart[i];
      if (currentItem.iva == 1) {
        iva += currentItem.quantity * currentItem.price * 0.12;
      }
    }
    return iva;
  }


  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.price,
    0
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(dayjs().hour());
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(intervalId);
  }, []);
  const PagarPorEfectivo = () => {
    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));


      const formData = new FormData();

      formData.append('precio', Number(totalPrice) + Number(ivaPrecio().toFixed(2)));
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'T');
      formData.append('puntos', 0);
      formData.append('estado_del_pedido', 'O');
      formData.append('impuesto', 0);
      formData.append('estado_pago', 'En revisión');
      formData.append('imagen', fileList[0]?.originFileObj || null);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      formData.append('id_sucursal', sucursal);
      if (HoraEntrega) {
        formData.append('fecha_hora', HoraEntrega.hour());
        formData.append('fecha_minutos', HoraEntrega.minute());// Ajusta el formato según tus necesidades
      }
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
            setCart([]);
            regresar();
            setPermitido(true);
          } else {
            notification.error({
              message: 'Fallo en el pedido',
              description: '¡Algo salió mal!',
            });
            console.error('Error al realizar el pedido:', responseData.message);
            setPermitido(true);
          }
        })
        .catch(error => {
          notification.error({
            message: 'Fallo en el pedido',
            description: '¡Algo salió mal!',
          });
          console.error('Error en la solicitud:', error);
          setPermitido(true);
        })
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
      setPermitido(true);
    }


  };
  const PagarPorEfectivo2 = () => {
    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));


      const formData = new FormData();
      let valor = Number(totalPrice) + Number(ivaPrecio().toFixed(2));
      console.log('Total: ' + valor);
      formData.append('precio', valor);
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'E');
      formData.append('puntos', 0);
      formData.append('estado_del_pedido', 'O');
      formData.append('impuesto', 0);
      formData.append('estado_pago', 'En revisión');
      formData.append('id_sucursal', sucursal);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      if (HoraEntrega) {
        formData.append('fecha_hora', HoraEntrega.hour());
        formData.append('fecha_minutos', HoraEntrega.minute());// Ajusta el formato según tus necesidades
      }
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
            setCart([]);
            regresar();
          } else {
            notification.error({
              message: 'Fallo en el pedido',
              description: '¡Algo salió mal!',
            });
            console.error('Error al realizar el pedido:', responseData.message);
          }
        })
        .catch(error => {
          notification.error({
            message: 'Fallo en el pedido',
            description: '¡Algo salió mal!',
          });
          console.error('Error en la solicitud:', error);
        })
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

      formData.append('precio', number(totalPrice) + Number(ivaPrecio().toFixed(2)));
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'P'); // Asumo que 'E' es el método de pago en efectivo
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
            setCart([]);
            regresar();
            setPermitido(true);
          } else {
            console.error('Error al realizar el pedido:', responseData.message);
            setPermitido(true);
          }
        })
        .catch(error => {
          console.error('Error en la solicitud:', error);
          setPermitido(true);
        })
        .finally(() => {
          setPermitido(true);
          setCart([]);
          regresar();
        });
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
    }
  }
  const CerrarModalDespuesDePago2 = () => {
    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));


      // Construye el cuerpo de la solicitud con los datos necesarios
      const formData = new FormData();

      formData.append('precio', Number(totalPrice) + Number(ivaPrecio().toFixed(2)));
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'X'); // Asumo que 'E' es el método de pago en efectivo
      formData.append('puntos', 0); // Ajusta según sea necesario
      formData.append('estado_del_pedido', 'O'); // Ajusta según sea necesario
      formData.append('impuesto', 0);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      formData.append('estado_pago', 'Pagado');
      formData.append('id_sucursal', sucursal);
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
            setPermitido(true);
          } else {
            console.error('Error al realizar el pedido:', responseData.message);
            setPermitido(true);
          }
        })
        .catch(error => {
          console.error('Error en la solicitud:', error);
          setPermitido(true);
        })
        .finally(() => {
          setCart([]);
          regresar();
        });
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
      setPermitido(true);
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
  const handleSucursalSelect = (selectedSucursal) => {
    setSucursal(selectedSucursal);
    setPermitido(false);
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
  return (
    <Row style={{ marginLeft: '30px', marginRight: '50px' }}>
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
        Cancelar
      </Button>
      <Col md={12}>
        <Alert
          message="Hola ✌🏻"
          description="Revisa tu dirección y forma de pago antes de comprar."
          type="success"
          showIcon
        />
      </Col>
      <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione como quiere recibir/retirar su pedido:</div>
      <Col md={12} className="d-flex justify-content-center align-items-center">
        <Segmented
          onChange={handleModoPedidoChange}
          options={[
            {
              label: (
                <div
                  style={{
                    padding: 4,
                  }}
                >
                  <img src={imgentrega} style={{ width: "50%" }} />
                  <div>Domicilio</div>
                </div>
              ),
              value: 'D',
            },
            {
              label: (
                <div
                  style={{
                    padding: 4,
                  }}
                >
                  <img src={imglocal} style={{ width: "50%" }} />
                  <div>Retirar</div>
                </div>
              ),
              value: 'R',
            }
          ]}
        />
      </Col>
      <Col>
        {modoPedido === 'D' && (
          <>
            <Col md={12} className="d-flex justify-content-center align-items-center" style={{ marginTop: '5px' }}>
              <Segmented
                onChange={handleLocationChange}
                options={[
                  {

                    value: 'any',
                  },
                  {
                    label: (
                      <div
                        style={{
                          padding: 4,
                        }}
                      >
                        <img src={imghogar} style={{ width: "50%" }} />
                        <div>Casa</div>
                      </div>
                    ),
                    value: 'Casa',
                  },
                  {
                    label: (
                      <div
                        style={{
                          padding: 4,
                        }}
                      >
                        <img src={imgtrabajao} style={{ width: "50%" }} />
                        <div>Trabajo</div>
                      </div>
                    ),
                    value: 'Trabajo',
                  },
                  {
                    label: (
                      <div
                        style={{
                          padding: 4,
                        }}
                      >
                        <img src={imgotro} style={{ width: "50%" }} />
                        <div>Otro</div>
                      </div>
                    ),
                    value: 'Otro',
                  }
                ]}
              />
            </Col>


            {locationData.latitud !== undefined && locationData.longitud !== undefined ? (
              <>
                <Badge count={"Se entregará el pedido en  " + selectedLocation} showZero color='#52C41A' />
              </>
            ) : (
              'No tienes una ubicación agregada'
            )}
          </>
        )}
        {modoPedido==='R'&&(
          <>Selecciona donde retirar tu pedido: </>
        )}
        {modoPedido === 'R' && (
          sucursalesData.map((sucursal) => {
            if (sucursal.estadoApertura === 'Abierto ahora') {

              return (
                <Card
                  key={sucursal.id_sucursal}
                  hoverable
                  title={sucursal.snombre}
                  style={{
                    width: "auto",
                    margin: "10px",
                    border: sucursal.id_sucursal === sucursal ? "2px solid green" : "1px solid #A4A4A4",
                  }}
                  cover={
                    <img
                      alt="Descarga la aplicación móvil"
                      src={`data:image/png;base64,${sucursal.imagensucursal}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  }
                  className="text-center"
                  onClick={() => handleSucursalSelect(sucursal.id_sucursal)}  // Agrega este evento onClick
                >
                  <span style={{ fontWeight: 'bold', color: 'black', display: 'block' }}>{sucursal.sdireccion}</span>
                  <span style={{ color: 'green' }}>
                    {sucursal.estadoApertura}
                  </span>
                </Card>
              );
            }
            return (null)
          }))
        }
        
        
        {sucursal && modoPedido === 'R' && (
          <Tag color="blue">Se debe retirar en {obtenerNombreSucursal(sucursal)}</Tag>
        )}
        <div>No hay más sucursales disponibles ahora mismo</div>
</Col>
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
        <Col md={12} className="d-flex justify-content-center align-items-center" style={{ marginTop: '5px' }}>
          <Segmented
            onChange={handleModoPagoChange}
            options={[
              {
                label: (
                  <Tooltip placement="top" title="Pagar en efectivo" >
                    <div
                      style={{
                        padding: 4,
                      }}
                    >
                      <img src={imgefectivo} style={{ width: "100%" }} />
                    </div>
                  </Tooltip>
                ),
                value: 'E',
              },
              {
                label: (
                  <Tooltip placement="top" title="Pagar por transferencia">
                    <div
                      style={{
                        padding: 4,
                      }}
                    >
                      <img src={imgtransfer} style={{ width: "100%" }} />
                    </div>
                  </Tooltip>
                ),
                value: 'T',
              },
              {
                label: (
                  <Tooltip placement="top" title="Dividir los pagos" >
                    <div
                      style={{
                        padding: 4,
                      }}
                    >
                      <img src={imgdividir} style={{ width: "100%" }} />
                    </div>
                  </Tooltip>
                ),
                value: 'F',
              }
            ]}
          />
        </Col>
        <br />
        ¿No hay prisa? Selecciona la hora que deseas que se realice tu pedido:
        <TimePicker
          defaultValue={dayjs('00:00', format)}
          value={HoraEntrega}
          format={format}
          id="time-envy"
          onChange={(hora) => cambiarhora(hora)}
          disabledHours={() => Array.from({ length: currentHour }, (_, i) => i)}
          disabledMinutes={(selectedHour) =>
            selectedHour === currentHour
              ? Array.from({ length: dayjs().minute() }, (_, i) => i)
              : []
          }
        />
        {modoPago === 'T' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center'
            , justifyContent: 'center'
          }}>

            <Row
              justify="center"
            >
              <Divider style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>Realize la transfrencia a la siguiente cuenta:</Divider>
              {getPaginatedData().map((cuenta, index) => (
                <Col key={index} md={12} style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
                  <Card
                    style={{
                      width: 300,
                      overflow: 'hidden',
                    }}
                  >
                    <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      Banco: {cuenta.nombre_banco}
                    </p>
                    <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      Tipo de cuenta: {cuenta.tipo_cuenta}
                    </p>
                    <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      Número de cuenta: {cuenta.num_cuenta}
                    </p>
                    <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      Nombre: {cuenta.nombreapellidos}
                    </p>
                    <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      Cedula: {cuenta.identificacion}
                    </p>
                    <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      Email: {cuenta.correoelectronico}
                    </p>
                  </Card>
                </Col>
              ))}
              <Pagination
                current={currentPage}
                total={data.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                style={{ marginTop: '16px', textAlign: 'center' }}
              />
            </Row>
            <Row>
              <Col md={12}>
                <p>Comprobante de pago (foto, escaneo ó captura de pantalla)</p>
              </Col>
              <Col md={12} justifyContent='center'>
                <div rotationSlider>
                  <ImgCrop style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
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
              </Col>
              <Col md={12}>
                <Button style={{ marginTop: '10px', width: '100%' }}
                  disabled={fileList.length === 0 || modoPedido === null || Permitido}
                  onClick={PagarPorEfectivo}
                >
                  Pagar: ${Number(totalPrice) + Number(ivaPrecio().toFixed(2))}
                </Button>
              </Col>
              <Col md={12}>
                <Divider>O pague con paypal </Divider>
              </Col>
              <Col md={12}>
                <div style={{ width: '100%' }} >
                  {!Permitido && (
                    <PayPal2 onSuccess={CerrarModalDespuesDePago2} amount={Number(totalPrice) + Number(ivaPrecio().toFixed(2))} disabled={false} />
                  ) || (<Button style={{ width: '100%', background: '#FFC439', borderColor: '#FFC439' }} disabled={true}><img src={imgpaypal} style={{ width: '30%' }} /></Button>)}
                </div>
              </Col>

            </Row>
          </div>
        )}
        <Row>
          <Col md={12}>
            {modoPago === 'E' && (
              <div className="d-grid gap-2">
                <Button style={{ marginTop: '50px', marginBottom: '240px' }}
                  disabled={Permitido}
                  onClick={PagarPorEfectivo2}
                >
                  Realizar pedido: ${Number(totalPrice) + Number(ivaPrecio().toFixed(2))}
                </Button>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
              {modoPago === 'F' && (
                <Space align="center">
                  <InputNumber
                    min={0}
                    value={fraccionadoValue}
                    onChange={handleFraccionadoInputChange}
                    style={{ marginLeft: '10px' }}
                  />
                  <Button onClick={PagarPorFraccionado} disabled={Permitido}>
                    Pagar: ${fraccionadoValue.toFixed(2)}
                  </Button>
                </Space>
              )}
              {mostrarComponente && modoPago === 'F' && (
                <div>
                  <Divider orientation="left">Comprobante de pago (foto, escaneo ó captura de pantalla)</Divider>
                  <div rotationSlider style={{
                    display: 'flex', alignItems: 'center'
                    , justifyContent: 'center'
                  }}>
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

                  <Button style={{ marginTop: '10px', width: '400px' }}
                    disabled={fileList.length === 0 || modoPedido === null && Permitido}
                    onClick={PagarPorEfectivo}
                  >
                    Pagar: ${Number(totalPrice) + Number(ivaPrecio().toFixed(2))}
                  </Button>

                  <Divider>O pague con paypal </Divider>
                  <div style={{ marginBottom: '122px', width: '400px', margin: '0 auto' }}>
                    {!Permitido && (
                      <PayPal2 onSuccess={CerrarModalDespuesDePago2} amount={Number(totalPrice) + Number(ivaPrecio().toFixed(2))} disabled={Permitido} />
                    )
                      (<Button style={{ width: '100%', background: '#FFC439', borderColor: '#FFC439' }} disabled={true}><img src={imgpaypal} style={{ width: '30%' }} /></Button>)}
                  </div>
                </div>
              )}

            </div>
          </Col>
        </Row>
        
        </Row>
      

   
  )
}
export default Pedidos;
