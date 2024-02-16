
import React, { useState,useContext} from 'react';
import {Container, Nav ,Modal ,Navbar, NavDropdown, Row,
  Col,Button} from 'react-bootstrap'
import logo from '../assets/images/descargar.jpg'
import LoginForm from '../components/login';
import { Link } from 'react-router-dom';
import RegistroForm from '../components/registro';
import ShoppingCart from './shopingcart';
import Historial from './Historial'
import ValidarPedido from './Validarpedido';
import Carrusel from './carrusel';
import { CartContext } from "../context/CarritoContext";
import EditarUser from "./EditarUser"
import ListProductos from './ListaProductos';
import Reserva from './Reserva';


const NavBar =()=>{
  const [cart, setCart] = useContext(CartContext);
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState('Carrusel');


  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);


    const navbarStyle = {
        backgroundColor: '#1c9e27', 
        border: '3px solid #ff4e02', 
        borderRadius: '15px',
        margin: '10px',
        marginLeft: '10px',
      };
   
      
      const estiloNavLink = {
        fontSize: '18px',
        borderRadius: '15px',
        textDecoration: 'none',
        color: 'black',
        transition: 'background-color 0.3s, color 0.3s', // Agrega una transición suave
        fontFamily: 'Arial, sans-serif',

      };
    
      const manejarMouseOver = (e) => {
        e.target.style.backgroundColor = '#467c3d'; // Cambia el color de fondo al pasar el mouse
        e.target.style.color = '#ffffff'; // Cambia el color del texto al pasar el mouse
      };
    
      const manejarMouseOut = (e) => {
        e.target.style.backgroundColor = ''; // Restaura el color de fondo al salir del mouse
        e.target.style.color = 'black'; // Restaura el color del texto al salir del mouse
      };
      const logoStyle = {
        width: '40px', 
        borderRadius: '50%', 
        marginRight: '10px',
      };
      const [MostrarModal, setMostrarModal] = useState(false);
      const [Logeado, setLogeado] = useState(false);
      const [ModalRegistroVisible, setModalRegistroVisible] = useState(false);

      const HacerClick = () => {
        setMostrarModal(true);
      };
    
      const CerrarModal = () => {
        setMostrarModal(false);
        setModalRegistroVisible(false)

      };


      const IniciarSesion = (userData) => {
        setLogeado(true);
        setMostrarModal(false);
        console.log('Usuario ha iniciado sesión:', userData);
      };

      
      const CerrarSesion = () => {
        setLogeado(false);
        setComponenteSeleccionado('Carrusel'); 
      };
      
      const RegresarAlLogin = () => {
        setModalRegistroVisible(false);
        setMostrarModal(true);
      };

      const MostrarComponente = (component) => {
        setComponenteSeleccionado(component);
      };
    
      const Regresar = () => {
        setComponenteSeleccionado('Carrusel');
      };


  return(
<>
  <Navbar expand="lg" style={navbarStyle}>
    <Container>
      <Navbar.Brand >
      <img src={logo} alt="Logo" style={logoStyle} />
      Hamburguesas al carbon  
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Container>
    <Container>
    <Navbar.Collapse className="justify-content-end">
        <Nav className="ml-auto">
          <Nav.Link onClick={() => MostrarComponente('Menu')} 
          style={estiloNavLink}
          onMouseOver={manejarMouseOver}
          onMouseOut={manejarMouseOut}>Menú</Nav.Link>
          {Logeado &&<NavDropdown 
            style={estiloNavLink}
            onMouseOver={manejarMouseOver}
            onMouseOut={manejarMouseOut}
          title="Perfil">
              <NavDropdown.Item onClick={() => MostrarComponente('Perfil')} style={{marginLeft: 'auto', fontSize: '18px' }}>Ver perfil</NavDropdown.Item>
              <NavDropdown.Item onClick={() => MostrarComponente('Historial')} style={{marginLeft: 'auto', fontSize: '18px' }}>Ver Historial</NavDropdown.Item>
              <NavDropdown.Item onClick={() => MostrarComponente('Pedido')} style={{marginLeft: 'auto', fontSize: '18px' }}>Validar pedido</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={CerrarSesion}  style={{ fontSize: '18px' }}>
                Cerrar sesion
              </NavDropdown.Item>
            </NavDropdown>}
          {Logeado &&<Nav.Link onClick={() => MostrarComponente('Reserva')}
            style={estiloNavLink}
            onMouseOver={manejarMouseOver}
            onMouseOut={manejarMouseOut}
          >Reserva</Nav.Link>}
          {Logeado && <Nav.Link
            style={estiloNavLink}
            onMouseOver={manejarMouseOver}
            onMouseOut={manejarMouseOut}
          >Puntos</Nav.Link>}

          {Logeado && <Link style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px' }}
          onClick={() => MostrarComponente('Carrito')}> <Nav.Link 
          style={estiloNavLink}
          onMouseOver={manejarMouseOver}
          onMouseOut={manejarMouseOut}
          to="/Carrito">Carrito:{quantity}</Nav.Link></Link>}

          
          {!Logeado && <Nav.Link onClick={HacerClick} 
            style={estiloNavLink}
            onMouseOver={manejarMouseOver}
            onMouseOut={manejarMouseOut}
          >Iniciar sesión</Nav.Link>}
    
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
<div>
  {ComponenteSeleccionado === 'Carrusel' && <Carrusel/>}
  {ComponenteSeleccionado === 'Menu' && <ListProductos/>}
  {ComponenteSeleccionado === 'Perfil' && <EditarUser/>}
  {ComponenteSeleccionado === 'Carrito' && <ShoppingCart />}
  {ComponenteSeleccionado === 'Historial' && <Historial />}
  {ComponenteSeleccionado === 'Pedido' && <ValidarPedido/>}
  {/*{ComponenteSeleccionado === 'Reserva' && <Reserva/>}*/}
  {ComponenteSeleccionado != 'Carrusel' && (
    
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
        <Modal.Header closeButton  style={{ borderBottom: 'none' }}>
        </Modal.Header>
        <Modal.Body>
        <LoginForm onLogin={IniciarSesion }  />
        </Modal.Body>
      </Modal>

      <Modal show={ModalRegistroVisible} onHide={CerrarModal}>
        <Modal.Header closeButton  style={{ borderBottom: 'none' }}>
        </Modal.Header>
        <Modal.Body>
        <RegistroForm onGoBackToLogin={RegresarAlLogin} />
        </Modal.Body>
      </Modal>
</>


    )
}

export default NavBar;