
import React, { useState,useContext} from 'react';
import {Container, Nav ,Modal ,Navbar, NavDropdown, Row,
  Col,Button} from 'react-bootstrap'
import logo from '../assets/images/descargar.jpg'
import LoginForm from '../components/login';
import { Link } from 'react-router-dom';
import RegistroForm from '../components/registro';
import ShoppingCart from './shopingcart';
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
        backgroundColor: '#88b8df',  
        borderRadius: '15px',
        margin: '10px',
        marginLeft: '10px',
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
          <Nav.Link onClick={() => MostrarComponente('Menu')}>Menú</Nav.Link>
          {Logeado &&<NavDropdown title="Perfil">
              <NavDropdown.Item onClick={() => MostrarComponente('Perfil')} style={{marginLeft: 'auto', fontSize: '14px' }}>Ver perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={CerrarSesion}  style={{ fontSize: '14px' }}>
                Cerrar sesion
              </NavDropdown.Item>
            </NavDropdown>}
          {Logeado &&<Nav.Link onClick={() => MostrarComponente('Reserva')}>Reserva</Nav.Link>}
          {Logeado && <Nav.Link>Puntos</Nav.Link>}

          {Logeado && <Link style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={() => MostrarComponente('Carrito')}> <Nav.Link to="/Carrito">Carrito: 
          <span>{quantity}</span></Nav.Link></Link>}

          
          {!Logeado && <Nav.Link onClick={HacerClick}>Iniciar sesión</Nav.Link>}
    
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
<div>
  {ComponenteSeleccionado === 'Carrusel' && <Carrusel/>}
  {ComponenteSeleccionado === 'Menu' && <ListProductos/>}
  {ComponenteSeleccionado === 'Perfil' && <EditarUser/>}
  {ComponenteSeleccionado === 'Carrito' && <ShoppingCart />}
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