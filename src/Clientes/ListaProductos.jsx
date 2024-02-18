import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Card as AntCard } from "antd";
import { CartContext } from "../context/CarritoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
const { Meta } = AntCard;

const ListProductos = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useContext(CartContext);

  useEffect(() => {
    // Realizar la solicitud a la API al montar el componente
    fetch("http://127.0.0.1:8000/producto/listar/")
      .then((response) => response.json())
      .then((data) => setProducts(data.productos))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleCardClick = (product) => {
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
        return [
          ...currItems,
          {
            id: productId,
            quantity: 1,
            Name: selectedProduct.nombreproducto,
            image: selectedProduct.imagenp,
            price: parseFloat(selectedProduct.preciounitario),
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

  return (
    <>
      <div style={{ marginTop: "30px", marginLeft: "50px", display: "flex" }}>
        {products.map((product, index) => (
          <AntCard
            hoverable
            key={product.id}
            style={{
              width: "18rem",
              cursor: "pointer",
              marginRight: index < products.length - 1 ? "20px" : "0",
            }}
            onClick={() => handleCardClick(product)}
            cover={
              <img
                alt={`Imagen de ${product.nombreproducto}`}
                src={`data:image/png;base64,${product.imagenp}`}
                style={{ width: "100%", height: "270px" }}
              />
            }
          >
            <Meta title={product.nombreproducto} description={product.descripcionproducto} />
            <div style={{display:'flex'}}>
            <p
            style={{
              marginTop:'10px',
              width:'50px',
              backgroundColor: "#0a2e02",
              marginRight: '10px', 
              color: "#fff",
              borderRadius: "10px",
              textAlign:'center',
            }}
            >{`$${product.preciounitario}`}</p>
            <p
            style={{
              marginTop:'10px',
              width:'50px',
              backgroundColor: "#6e3700",
              color: "#fff",
              borderRadius: "10px",
              textAlign:'center',
            }}
            >{`${product.puntosp}`}</p>
            </div>
          </AntCard>
        ))}
      </div>

      <Modal visible={showModal} onCancel={handleCloseModal} footer={null}>
        <div>
          {selectedProduct && (
            <>
              <h5>{selectedProduct.nombreproducto}</h5>
              <img
                src={`data:image/png;base64,${selectedProduct.imagenp}`}
                alt={`Imagen de ${selectedProduct.nombreproducto}`}
                style={{ width: "100%", height: "340px" }}
              />
              <p>{selectedProduct.descripcionproducto}</p>
              <p>{`$${selectedProduct.preciounitario}`}</p>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {selectedProduct && (
                  <>
                    

                    {getQuantityById(selectedProduct.id_producto) === 0 ? (
                      <Button style={{ 
                        backgroundColor: "#022c01",
                        color: "#fff",
                        border:'none'
                         }} 
                         icon={<FontAwesomeIcon icon={faShoppingCart} />}
                         onClick={() => addToCart(selectedProduct.id_producto)}>
                         Añadir al carrito
                      </Button>
                    ) : (
                      <Button
                        style={{
                          marginLeft: "1px",
                          backgroundColor: "#050138",
                          color: "#fff",
                          border:'none'
                        }}
                        onClick={() => addToCart(selectedProduct.id_producto)}
                      >
                        + 
                      </Button>
                    )}
                    {getQuantityById(selectedProduct.id_producto) > 0 && (
                      <div
                        style={{
                          padding: "6px",
                          width:'40px',
                          marginLeft: "10px",
                          backgroundColor: "#000000",
                          color: "#fff",
                          borderRadius: "10px",
                          textAlign:'center'
                        }}
                      >
                        {getQuantityById(selectedProduct.id_producto)}
                      </div>
                    )}
                    {getQuantityById(selectedProduct.id_producto) > 0 && (
                      <Button
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "#A80000",
                          color: "#fff",
                          border:'none'
                        }}
                        onClick={() => removeItem(selectedProduct.id_producto)}
                      >
                        -
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ListProductos;
