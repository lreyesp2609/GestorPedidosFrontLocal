import React, { useState, useContext, useEffect } from "react";
import { Card as AntCard, message,notification, Alert } from 'antd';
import { Row, Col, Button } from 'react-bootstrap';
import {RecompensaContext} from "../context/RecompensaContext"

const { Meta } = AntCard;
const Reclamar = () => {
    const [products, setProducts] = useState([]);
    const [recompensasProductos, setRecompensasProductos] = useState([]);
   
    const [recompensa, setrecompensa] = useContext(RecompensaContext);
    const addToCart = (productId, productName, productImage, productPoints) => {
      if (!userData || userData.cpuntos < productPoints) {
        console.log('No tienes suficientes puntos para reclamar esta recompensa.');
        notification.error({
          message: 'Puntos insuficentes',
          description: 'No tienes suficientes puntos para reclamar esta recompensa.',
        });
        return;
      }
    
      setrecompensa((currItems) => {
        const isItemFound = currItems.find((item) => item.id === productId);
    
        if (isItemFound) {
          console.log('Item encontrado en el carrito. Actualizando cantidad...');
          return currItems.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
        }
    
        console.log('Añadiendo nueva recompensa al carrito...');
        return [
          ...currItems,
          {
            id: productId,
            type: 'recompensa',
            quantity: 1,
            Name: productName,
            image: productImage,
            price: 0,
            puntos: productPoints,
          },
        ];
      });
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
    
    const obtenerProductos = async () => {
        try {
          const respuesta = await fetch(API_URL +'/producto/listar/');
    
          if (!respuesta.ok) {
            throw new Error(`Error al obtener los productos. Código de estado: ${respuesta.status}`);
          }
    
          const data = await respuesta.json();
          setProducts(data.productos);
        } catch (error) {
          console.error('Error al obtener productos:', error);
        }
      };
      const obtenerDatosDeAPI = async () => {
        try {
          const respuesta = await fetch(API_URL +'/Recompensas/lista_recompensas_producto/');
          
          if (!respuesta.ok) {
            throw new Error(`Error al obtener los datos. Código de estado: ${respuesta.status}`);
          }
      
          const datos = await respuesta.json();
           setRecompensasProductos(datos.recompensas_productos);
         
      
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      };
      const reclamarPuntos = async (recompensa) => {
        try {
          const formData = new FormData();
          formData.append('puntos_recompensa_producto', recompensa.puntos_recompensa_producto);
          formData.append('id_recompensa_producto', recompensa.id_recompensa_producto);
          // Realiza la solicitud POST a la API
          const response = await fetch(API_URL +`/Recompensas/Restar_puntos/${id_cuenta}/`, {
            method: 'POST',
            body: formData,
          });
    
          // Verifica si la solicitud fue exitosa
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
          }
        } catch (error) {
          console.error(error.message);
        }
      };
      
      useEffect(() => {
        obtenerProductos();
        obtenerDatosDeAPI();
        ObtenerUsuario();
      },[userData, recompensasProductos]);

return(
        
        <div>
              <Row gutter={1}>
    {recompensasProductos
        .filter((recompensa) => recompensa.sestado === '1')
        .map((recompensa) => {
            // Encuentra el producto correspondiente usando el id_producto de la recompensa
            const producto = products.find((p) => p.id_producto === recompensa.id_producto);

            // Verifica si se encontró el producto antes de intentar acceder a sus propiedades
            if (!producto) {
            return null; // Otra opción es manejar este caso de manera específica
            }

            return (
                <Col key={recompensa.id_recompensa_producto} xs={1} sm={1} md={1} lg={1} xl={3}>
            <AntCard key={recompensa.id_recompensa_producto} 
            hoverable
            style={{
                width: '100%',
                cursor: 'pointer',
                marginBottom: '16px',
                maxWidth: '300px', // Ajusta el ancho máximo según tus necesidades
                margin: 'auto', // Centra la tarjeta
                marginTop:'10px'
                
              }}
              cover={
              <img src={`data:image/png;base64,${producto.imagenp}`} alt={producto.nombreproducto} 
                 style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              }
            >
                <Meta title={producto.nombreproducto}description= { recompensa.puntos_recompensa_producto} />
                <div className="d-grid gap-2">
                <Button style={{marginTop:'10px'}}
                onClick={() => {
                  addToCart(recompensa.id_recompensa_producto, producto.nombreproducto, producto.imagenp, recompensa.puntos_recompensa_producto);
                  reclamarPuntos(recompensa);
                }}
                >Reclamar</Button>
                </div>
            </AntCard>
            </Col>
            );
        })}


</Row>
        </div>
        
        
    )
}


export default Reclamar 