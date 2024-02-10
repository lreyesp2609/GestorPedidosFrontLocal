import React, { useState,  useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faMapMarkerAlt, faEye, faEyeSlash  } from '@fortawesome/free-solid-svg-icons';
import Map2 from './Map2';
import god from '../assets/images/god1.jpg'
import NavBar from './NavBar';


const EditarUser =()=>{
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [MostrarModal, setMostrarModal] = useState(false);

  const [locationData, setLocationData] = useState({
    latitud1: 0,
    longitud1: 0,
    latitud2: 0,
    longitud2: 0,
    latitud3: 0,
    longitud3: 0,
  });
  
  const handleLocationSelect = (location) => {
    setLocationData((prevLocation) => ({
      ...prevLocation,
      ...location,
    }));
    CerrarModal();
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
  };

 

  const HacerClick = () => {
    setMostrarModal(true);
  };

  const CerrarModal = () => {
    setMostrarModal(false);

  };

  const [userData, setUserData] = useState(null);

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

 
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
      }
    },
  });

return(
    <>
 
        <Container>
        
          <Row>
            <Col md={4} style={styles.formularioContainer} >
              <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: '50%',
                    width: '200px',
                    height: '200px',
                    margin: '0 auto',
                    position: 'relative',
                  }}
                  {...getRootProps()}>
          {selectedImage ? (
              <img
                src={selectedImage}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
                
                style={{
                  borderRadius: '50%',
                  transition: 'transform 0.3s ease',
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              ) : (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  }}>
                  <FontAwesomeIcon icon={faUser} size="5x"
                   onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                   onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
            <span >Editar foto de perfil</span>
            </div>
                <div style={{ textAlign: 'center',marginTop: '130px',  }} >
                
                <Button variant="primary" type="submit" style={{ width: '150px', borderRadius: '10px', }}
                onClick={handleEditClick}>
                  editar datos
                </Button>
                </div>
                <div style={{ textAlign: 'center',}}>
              <Button variant="secondary" type="button" style={{ width: '150px', borderRadius: '10px', marginTop: '10px' }}>
              Editar contraseña
              </Button>
            </div>
            <Col md={1100} style={{ ...styles.centerContainer, marginTop: '20px',  }}>
              <div style={{ marginTop: '60px' }}></div>
            </Col>
            </Col>
            <Col md={8}>
            <Row>
            <Col md={6} style={{ justifyContent: 'center', marginTop: '30px',
              
              padding: '20px',
                  
              }}>
                
                <h5 style={{ textAlign: 'center',
                  border: '1px solid #fcaf6f',
                  borderRadius: '10px',
                  backgroundColor: '#fcaf6f', // Agregar color de fondo gris
                  padding: '10px' // Añadir relleno para mejorar la apariencia
                  }}>Datos generales</h5>
                
               <Form>
                     <Form.Group>
                   <Row>
                     <Col>
                     <Form.Label>Nombre</Form.Label>
                      <Form.Control value={userData?.nombre_usuario || ''} 
                       readOnly={!isEditing}
                       onChange={(e) => isEditing && setUserData({ ...userData, nombre_usuario: e.target.value })}
                      />
                    </Col>
                    <Col>
                    <Form.Label>Apellido</Form.Label>
                      <Form.Control value={userData?.capellido||''}  
                       readOnly={!isEditing}
                       onChange={(e) => isEditing && setUserData({ ...userData, capellido: e.target.value })}/>
                      </Col>
                  </Row>
                  <Row>
                    <Col>
                    <Form.Label>telefono</Form.Label>
                      <Form.Control  value={userData?.telefono||''}  
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && setUserData({ ...userData, telefono: e.target.value })}/>
                    </Col>
                  </Row>
                    </Form.Group>
                    <Form.Group >
                    <Row>
                   
                    <Form.Label>Direccion 1</Form.Label>
                  
                    <Col lg={10}>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={`Latitud: ${locationData.latitud1}, 
Longitud: ${locationData.longitud1}`}
                      />
             
                    </Col>
                    <Col  lg={1}>
                      <FontAwesomeIcon
                      onClick={HacerClick}
                      icon={faMapMarkerAlt} size="2x"/>
                      </Col> 
                    </Row>
                    </Form.Group>
                    {isEditing && (
                        <div className="mt-4">
                        
                        <button
                          
                          onClick={handleSaveClick}
                        >
                          Guardar Cambios
                        </button>
                            
                      </div>
                      )}
                </Form>
            </Col>
                  {/* Columna de Datos Generales 2 */}
                <Col md={6} style={{  marginTop: '30px', padding: '20px',   }}>
                  <h5 style={{ textAlign: 'center', border: '1px solid #fcaf6f', borderRadius: '10px', backgroundColor: '#fcaf6f', padding: '10px' }}>
                    Datos opcionales</h5>
                  <Form>
                  <Form.Group>
                   <Row>
                     <Col>
                     <Form.Label>Razon social</Form.Label>
                      <Form.Control value={userData?.razon_social||''}
                       readOnly={!isEditing}
                       onChange={(e) => isEditing && setUserData({ ...userData, razon_social: e.target.value })} />
                    </Col>
                    <Col>
                    <Form.Label>Identificacion</Form.Label>
                      <Form.Control   value={userData?.ruc_cedula||''} 
                               readOnly={!isEditing}
                               onChange={(e) => isEditing && setUserData({ ...userData, ruc_cedula: e.target.value })}/>
                      </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group >
                    <Row>
                      <Form.Label>Direccion 2</Form.Label>
                      <Col lg={10}>
                      <Form.Control 
                      as="textarea"
                      rows={3}
                        value={`Latitud: ${locationData.latitud2}, 
Longitud: ${locationData.longitud2}`}
                      />
                      </Col>
                      <Col  lg={1}>
                        <FontAwesomeIcon
                        onClick={HacerClick}
                        icon={faMapMarkerAlt} size="2x"/>
                        </Col>
                        <Form.Label>Direccion 3</Form.Label>
                      <Col lg={10}>
                      <Form.Control 
                      as="textarea"
                      rows={3}
                        value={`Latitud: ${locationData.latitud3}, 
Longitud: ${locationData.longitud3}`}
                      />
                      </Col>
                      <Col  lg={1}>
                        <FontAwesomeIcon
                        onClick={HacerClick}
                        icon={faMapMarkerAlt} size="2x"/>
                        </Col>  
                      </Row>
                    </Form.Group>
                  </Form>
                </Col>
                <Col  style={{  marginTop: '30px', padding: '20px',   }}>
                  <h5 style={{ textAlign: 'center', border: '1px solid #fcaf6f', borderRadius: '10px', backgroundColor: '#fcaf6f', padding: '10px' }}>Datos generales</h5>
                  <Form>
                  <Form.Group>
                    <Row>
                   
                     <Form.Label>Nombre</Form.Label>
                     <Col lg={11}>
                      <Form.Control  />
                      </Col>
                    <Col>
                      <FontAwesomeIcon
                        onClick={HacerClick}
                        icon={faMapMarkerAlt} size="2x"/>
                    </Col>
                    </Row>    
                    </Form.Group>

                    <Form.Group style={{ marginTop:'10px' }}>
                 <Row>
                    <Col>
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control type='password'  />
                    </Col>
                    <Col>
                    <Form.Label>nueva contraseña</Form.Label>
                    <Form.Control   />
                    </Col>
                  </Row>
                    </Form.Group>
                  </Form>
                </Col>
        </Row>
        </Col>
          </Row>
        </Container>

        {isEditing && (
          <Modal show={MostrarModal} onHide={CerrarModal} size="lg" >
            <Modal.Header closeButton  style={{ borderBottom: 'none' }}>
            </Modal.Header>
            <Modal.Body>
              <Map2  onLocationSelect={handleLocationSelect}/>
            </Modal.Body>
          </Modal>
        )}
        </>
      );
    }
    
    const styles = {
      formularioContainer: {
        border: '1px solid rgba(196, 208, 255, 0.74)',
        borderRadius: '50px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor:'rgba(196, 208, 255, 0.74)',
        marginTop: '30px', 
      },
      centerContainer: {
        
     
       
      },
      heading: {
        textAlign: 'center',
      },
    };


export default EditarUser;