import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Nav,
  Modal,
  Navbar,
  NavDropdown,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import LoginForm from "../components/login";
import { Link } from "react-router-dom";
import RegistroForm from "../components/registro";
import ShoppingCart from "./shopingcart";
import Historial from "./Historial";
import Carrusel from "./carrusel";
import { CartContext } from "../context/CarritoContext";
import {RecompensaContext} from "../context/RecompensaContext"
import EditarUser from "./EditarUser";
import ListProductos from "./ListaProductos";
import Reclamar from "./ReclamarRecompensas";
import Reserva from "./Reserva";
import "../components/comanda.css";
import API_URL from '../config';

const NavBar = () => {
  const { cart, setCart, totalPoints2, calcularTotalPoints } = useContext(CartContext);
  const [recompensa, setrecompensa] = useContext(RecompensaContext);
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState(() => {
    // Obtener el componente seleccionado de localStorage al cargar la página
    const storedComponente = localStorage.getItem("ComponenteSeleccionado");
    return storedComponente || "Carrusel";
  });
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [nombreEmpresa, setNombre] = useState(null);
  const [logoEmpresa, setLogo] = useState(null);
  const [Direccion, setDireccion] = useState(null);
  const [Correo, setCorreo] = useState(null);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0) + recompensa.reduce((acc, curr) => acc + curr.quantity, 0);


  const navbarStyle = {
    backgroundColor: "#A80000",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  // Estilo común para todos los elementos de navegación
  const estiloNavLink = {
    fontSize: "14px",
    textDecoration: "none",
    color: "white",
    transition: "background-color 0.3s, color 0.3s",
    fontFamily: "Arial, sans-serif",
    padding: "8px 15px",
    margin: "0 5px",
    display: "inline-block",
    textTransform: "uppercase",
  };

  // Estilo para el contenedor Nav
  const navContainerStyle = {
    display: "flex",
    alignItems: "center",
    height: "100%",
  };

  // Estilo específico para el dropdown que hereda del estiloNavLink
  const navDropdownStyle = {
    color: "white",
    padding: "0",
  };

  const dropdownStyle = {
    color: "white",
    borderRadius: "15px",
    transition: "background-color 0.3s, color 0.3s",
    fontFamily: "Arial, sans-serif",
    padding: "8px 15px",
    margin: "0 5px",
    display: "inline-flex",
    alignItems: "center"
  };

  const dropdownItemStyle = {
    fontSize: "15px",
    padding: "10px 15px",
    transition: "background-color 0.2s, color 0.2s",
    borderLeft: "3px solid transparent",
  };

  const manejarMouseOver = (e) => {
    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    e.target.style.color = "white";
  };

  const manejarMouseOut = (e) => {
    e.target.style.backgroundColor = "";
    e.target.style.color = "white";
  };

  const manejarMouseOverDropdownItem = (e) => {
    e.target.style.backgroundColor = "#f8f9fa";
    e.target.style.color = "#A80000";
    e.target.style.borderLeft = "3px solid #A80000";
  };

  const manejarMouseOutDropdownItem = (e) => {
    e.target.style.backgroundColor = "";
    e.target.style.color = "";
    e.target.style.borderLeft = "3px solid transparent";
  };

  const logoStyle = {
    color: "white",
    width: "50px",
    borderRadius: "50%",
    border: "2px solid white",
  };
  const [MostrarModal, setMostrarModal] = useState(false);
  const [Logeado, setLogeado] = useState(() => {
    const storedLogeado = localStorage.getItem("Logeado");
    return storedLogeado ? JSON.parse(storedLogeado) : false;
  });
  const [ModalRegistroVisible, setModalRegistroVisible] = useState(false);

  const HacerClick = () => {
    setMostrarModal(true);
  };

  const CerrarModal = () => {
    setMostrarModal(false);
    setModalRegistroVisible(false);
  };
  const IniciarSesion = (userData) => {
    setLogeado(true);
    setMostrarModal(false);
    console.log("Usuario ha iniciado sesión:", userData);
    localStorage.setItem("Logeado", JSON.stringify(true));

  };

  const CerrarSesion = () => {
    setLogeado(false);
    setComponenteSeleccionado("Carrusel");
    localStorage.removeItem("Logeado");

  };

  const RegresarAlLogin = () => {
    setModalRegistroVisible(false);
    setMostrarModal(true);
  };

  const MostrarComponente = (component) => {
    setComponenteSeleccionado(component);

    // Almacenar el componente seleccionado en localStorage
    localStorage.setItem("ComponenteSeleccionado", component);
  };

  const Regresar = () => {
    setComponenteSeleccionado("Carrusel");
  };




  const obtenerInformacionEmpresa = async () => {
    try {
      const respuesta = await fetch(
        API_URL +"/empresa/infoEmpresa/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const datos = await respuesta.json();
      setEmpresaInfo(datos.empresa_info);
      console.log(datos.empresa_info);
      setNombre(datos.empresa_info.enombre);
      setLogo(datos.empresa_info.elogo);
      setDireccion(datos.empresa_info.direccion);
      setCorreo(datos.empresa_info.correoelectronico);
    } catch (error) {
      console.error("Error al obtener la información de la empresa:", error);
    }
  };
  const [userData, setUserData] = useState(null);
  const id_cuenta = localStorage.getItem("id_cuenta");
  const ObtenerUsuario = async () => {
    try {
      if (id_cuenta) {
        const response = await fetch(API_URL +`/Login/obtener_usuario/${id_cuenta}/`);
        const data = await response.json();
  
        if (response.ok) {
          setUserData(data.usuario.cpuntos);
  
          setLocationData({
            latitud1: data.usuario?.ubicacion1?.latitud || 0,
            longitud1: data.usuario?.ubicacion1?.longitud || 0,
            latitud2: data.usuario?.ubicacion2?.latitud || 0,
            longitud2: data.usuario?.ubicacion2?.longitud || 0,
            latitud3: data.usuario?.ubicacion3?.latitud || 0,
            longitud3: data.usuario?.ubicacion3?.longitud || 0,
          });
        } else {
          // Manejo de errores si la respuesta no está OK
          console.error("Error al obtener datos del usuario:", data.message || "Error desconocido");
        }
      } else {
        console.error("Nombre de usuario no encontrado en localStorage");
      }
    } catch (error) {
      // Manejo de errores generales
      console.error("Error al obtener datos del usuario:", error);
    }
  };
  


  useEffect(() => {
    obtenerInformacionEmpresa();
    ObtenerUsuario();
  }, []);

  return (
    <>
      <div className='contentlight' style={{ height: '100%', minHeight: '100vh' }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Merienda:wght@300..900&display=swap"
          rel="stylesheet"
        />
        <Row style={{ background: "black", color: "white", height: "25px" }}>
          <Col
            md={12}
            className="d-flex justify-content-center align-items-center"
          >
            {Direccion}
          </Col>
        </Row>
        <Navbar expand="lg" style={navbarStyle}>
          <Container>
            <Navbar.Brand className="d-flex align-items-center" href="/" onClick={() => {localStorage.removeItem("ComponenteSeleccionado"); MostrarComponente("Carrusel");}}>
              <img
                src={`data:image/png;base64,${logoEmpresa}`}
                alt="Logo"
                style={logoStyle}
              />
              <span
                style={{
                  color: "white",
                  fontSize: "22px",
                  fontFamily: "Merienda",
                  marginLeft: "10px",
                  fontWeight: "bold",
                }}
              >
                {nombreEmpresa}
              </span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Container>
          <Container>
            <Navbar.Collapse className="justify-content-end">
              <Nav className="ml-auto" style={navContainerStyle}>
                <Nav.Link
                  onClick={() => MostrarComponente("Menu")}
                  style={estiloNavLink}
                  onMouseOver={manejarMouseOver}
                  onMouseOut={manejarMouseOut}
                >
                  MENU
                </Nav.Link>
                {Logeado && (
                  <NavDropdown
                    style={estiloNavLink}
                    title="PERFIL"
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item
                      onClick={() => MostrarComponente("Perfil")}
                      style={dropdownItemStyle}
                      onMouseOver={manejarMouseOverDropdownItem}
                      onMouseOut={manejarMouseOutDropdownItem}
                    >
                      Ver perfil
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => MostrarComponente("Historial")}
                      style={dropdownItemStyle}
                      onMouseOver={manejarMouseOverDropdownItem}
                      onMouseOut={manejarMouseOutDropdownItem}
                    >
                      Ver Historial
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={CerrarSesion}
                      style={{...dropdownItemStyle, color: "#dc3545"}}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#dc3545";
                        e.target.style.color = "white";
                        e.target.style.borderLeft = "3px solid #b02a37";
                      }}
                      onMouseOut={manejarMouseOutDropdownItem}
                    >
                      Cerrar sesión
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {Logeado && (
                  <Nav.Link
                    onClick={() => MostrarComponente("Reserva")}
                    style={estiloNavLink}
                    onMouseOver={manejarMouseOver}
                    onMouseOut={manejarMouseOut}
                  >
                    RESERVA
                  </Nav.Link>
                )}
                {Logeado && (
                  <Nav.Link
                    onClick={() => MostrarComponente("ReclamarR")}
                    style={estiloNavLink}
                    onMouseOver={manejarMouseOver}
                    onMouseOut={manejarMouseOut}
                  >
                    Puntos: {totalPoints2}
                  </Nav.Link>
                )}
                {Logeado && (
                  <Nav.Link
                    onClick={() => MostrarComponente("Carrito")}
                    style={estiloNavLink}
                    onMouseOver={manejarMouseOver}
                    onMouseOut={manejarMouseOut}
                  >
                    CARRITO: {totalQuantity}
                  </Nav.Link>
                )}
                {!Logeado && (
                  <Nav.Link
                    onClick={HacerClick}
                    style={estiloNavLink}
                    onMouseOver={manejarMouseOver}
                    onMouseOut={manejarMouseOut}
                  >
                    INGRESAR
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div>
          {ComponenteSeleccionado === "Carrusel" && <Carrusel />}
          {ComponenteSeleccionado === "Menu" && <ListProductos />}
          {ComponenteSeleccionado === "Perfil" && <EditarUser />}
          {ComponenteSeleccionado === "Historial" && <Historial />}
          {ComponenteSeleccionado === "Carrito" && <ShoppingCart/>}
          {ComponenteSeleccionado === "ReclamarR" && <Reclamar/>}
          {ComponenteSeleccionado === 'Reserva' && <Reserva/>}
          {ComponenteSeleccionado != "Carrusel" && (
            <Row>
              <Col md={12}>
                <Button
                  variant="success"
                  style={{
                    position: "fixed",
                    right: "16px",
                    bottom: "16px",
                    zIndex: 1000,
                  }}
                  onClick={() => Regresar()}
                >
                  Atrás
                </Button>
              </Col>
            </Row>
          )}
        </div>
        {/* Modal */}
        <Modal show={MostrarModal} onHide={CerrarModal}>
          <Modal.Header
            closeButton
            style={{ borderBottom: "none" }}
          ></Modal.Header>
          <Modal.Body>
            <LoginForm onLogin={IniciarSesion} />
          </Modal.Body>
        </Modal>

        <Modal show={ModalRegistroVisible} onHide={CerrarModal}>
          <Modal.Header
            closeButton
            style={{ borderBottom: "none" }}
          ></Modal.Header>
          <Modal.Body>
            <RegistroForm onGoBackToLogin={RegresarAlLogin} />
          </Modal.Body>
        </Modal>
      </div>
  
    </>
  );
};
 
export default NavBar;
