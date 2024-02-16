import React, { useState, useEffect } from "react";
import  Item  from "./item2";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/producto/listar/')
      .then(response => response.json())
      .then(data => setProducts(data.productos))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="items-list">
      {products.map(product => (
        <Item key={product.id_producto} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
