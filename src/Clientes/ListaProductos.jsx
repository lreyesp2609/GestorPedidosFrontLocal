import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Card as AntCard, Input, notification, Spin } from "antd";
import { CartContext } from "../context/CarritoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faStar } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from 'react-bootstrap';
import API_URL from '../config';
const { Meta } = AntCard;
const { TextArea } = Input;

const ListProductos = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cart, setCart, totalPoints2, calcularTotalPoints } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL + "/producto/listar/")
      .then((response) => response.json())
      .then((data) => setProducts(data.productos))
      .catch((error) => console.error("Error fetching products:", error))
      .finally(()=>setLoading(false));
  }, []);

  const handleCardClick = (product) => {
    console.log(products);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const addToCart = (productId) => {
    setCart((currItems) => {
      const isItemFound = currItems.find((item) => item.id === productId);
      if (isItemFound) {
        return currItems.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      } else {
        notification.success({
          message: 'Se agregó el producto al carrito',
          placement: 'topLeft'
        });
        return [
          ...currItems,
          {
            id: productId,
            type: 'producto',
            quantity: 1,
            Name: selectedProduct.nombreproducto,
            image: selectedProduct.imagenp,
            puntos: selectedProduct.puntosp,
            price: parseFloat(selectedProduct.preciounitario),
            iva: selectedProduct.iva,
          },
        ];
      }
    });
  };

  const removeItem = (productId) => {
    setCart((currItems) => {
      const updatedCart = currItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(item.quantity - 1, 0) };
        } else {
          return item;
        }
      });

      return updatedCart.filter((item) => item.quantity > 0);
    });
  };

  const getQuantityById = (productId) => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  // Add new styles
  // Update the page style to a more appealing background color
  const pageStyle = {
    backgroundColor: '#2b1e1e', // Darker, richer background that complements the red theme
    minHeight: '100vh',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(168, 0, 0, 0.2)',
    border: 'none',
    transition: 'transform 0.3s ease',
    height: '100%',
    width: '100%' // Make cards fill their container
  };

  const modalStyle = {
    backgroundColor: '#2b1e1e',
    padding: '20px',
    borderRadius: '15px'
  };

  return (
    <div style={pageStyle}>
      <Spin spinning={loading} tip="Cargando..." style={{height:'500px', color: 'white'}}>
        <Row className="g-2">
          {products.map((product) => (
            <Col xs={6} sm={4} md={3} lg={3} key={product.id_producto || product.id} className="mb-3">
              <AntCard
                hoverable
                style={cardStyle}
                onClick={() => handleCardClick(product)}
                cover={
                  <img
                    alt={`Imagen de ${product.nombreproducto}`}
                    src={`data:image/png;base64,${product.imagenp}`}
                    style={{ 
                      width: "100%", 
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0"
                    }}
                  />
                }
              >
                <Meta 
                  title={<span style={{color: '#333', fontSize: '16px'}}>{product.nombreproducto}</span>}
                  description={<span style={{color: '#666'}}>{product.descripcionproducto}</span>}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                  <p
                    style={{
                      margin: '0',
                      padding: '5px 15px',
                      backgroundColor: "#0a2e02",
                      color: "#fff",
                      borderRadius: "20px",
                      fontSize: '14px'
                    }}
                  >{`$${product.preciounitario}`}</p>
                  <p
                    style={{
                      margin: '0',
                      padding: '5px 15px',
                      backgroundColor: "#5a0a03",
                      color: "#fff",
                      borderRadius: "20px",
                      fontSize: '14px'
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{
                        color: "#FFD700",
                        marginRight: '5px'
                      }}
                    />
                    {product.puntosp}
                  </p>
                </div>
              </AntCard>
            </Col>
          ))}
        </Row>
      </Spin>

      <Modal 
        visible={showModal} 
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        bodyStyle={modalStyle}
      >
        {selectedProduct && (
          <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '12px'}}>
            <h3 style={{ 
              textAlign: 'center', 
              color: '#333',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>{selectedProduct.nombreproducto}</h3>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <img
                  src={`data:image/png;base64,${selectedProduct.imagenp}`}
                  alt={`Imagen de ${selectedProduct.nombreproducto}`}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <div style={{padding: '0 20px'}}>
                  <h5 style={{ 
                    borderBottom: '2px solid #eee', 
                    paddingBottom: '10px',
                    color: '#333'
                  }}>Descripción</h5>
                  <p style={{color: '#666'}}>{selectedProduct.descripcionproducto}</p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px'
                  }}>
                    <div>
                      <h5 style={{color: '#333'}}>Precio</h5>
                      <p style={{
                        backgroundColor: "#0a2e02",
                        padding: '5px 15px',
                        color: "#fff",
                        borderRadius: "20px",
                        display: 'inline-block'
                      }}>{`$${selectedProduct.preciounitario}`}</p>
                    </div>
                    <div>
                      <h5 style={{color: '#333'}}>Puntos</h5>
                      <p style={{
                        backgroundColor: "#5a0a03",
                        padding: '5px 15px',
                        color: "#fff",
                        borderRadius: "20px",
                        display: 'inline-block'
                      }}>
                        <FontAwesomeIcon icon={faStar} style={{color: "#FFD700", marginRight: '5px'}}/>
                        {selectedProduct.puntosp}
                      </p>
                    </div>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    marginTop: '30px'
                  }}>
                    {getQuantityById(selectedProduct.id_producto) === 0 ? (
                      <Button style={{
                        backgroundColor: "#000000",
                        color: "#fff",
                        border: 'none',
                        borderRadius: '20px',
                        padding: '0 25px',
                        height: '40px'
                      }}
                      icon={<FontAwesomeIcon icon={faShoppingCart} style={{marginRight: '8px'}}/>}
                      onClick={() => addToCart(selectedProduct.id_producto)}>
                        Añadir al carrito
                      </Button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                          style={{
                            marginLeft: "1px",
                            backgroundColor: "#050138",
                            color: "#fff",
                            border: 'none'
                          }}
                          onClick={() => addToCart(selectedProduct.id_producto)}
                        >
                          +
                        </Button>
                        <div
                          style={{
                            padding: "5px",
                            width: '57px',
                            marginLeft: "10px",
                            backgroundColor: "#000000",
                            color: "#fff",
                            borderRadius: "10px",
                            textAlign: 'center'
                          }}
                        >
                          {getQuantityById(selectedProduct.id_producto)}
                        </div>
                        <Button
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#A80000",
                            color: "#fff",
                            border: 'none'
                          }}
                          onClick={() => removeItem(selectedProduct.id_producto)}
                        >
                          -
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListProductos;

