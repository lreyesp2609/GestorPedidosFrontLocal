import React, { useState, useEffect } from "react";
import { Table } from "antd";

const VerFacturaMesero = ({ facturaData }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/producto/listar/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de productos.");
      }
      const data = await response.json();
      setProductos(data.productos);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const { detalles_factura } = facturaData;
  const columns = [
    {
      title: "Productos",
      dataIndex: "id_producto_id",
      key: "id_producto_id",
      render: (id_producto_id) => {
        const producto = productos.find(producto => producto.id_producto === id_producto_id);
        return producto ? producto.nombreproducto : id_producto_id;
      },
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
    },
    {
      title: "Descuento",
      dataIndex: "descuento",
      key: "descuento",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
  ];

  return (
    <div>
      <h3>ID Factura: {facturaData.id_factura}</h3>
      <h3>Fecha de Emisión: {facturaData.fecha_emision}</h3>
      <h3>Total: {facturaData.total}</h3>
      <Table dataSource={detalles_factura} columns={columns} rowKey="id_detallefactura" />
    </div>
  );
};

export default VerFacturaMesero;
