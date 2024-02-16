import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';

const MovimientosInventario = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleMovimiento, setDetalleMovimiento] = useState({});

  useEffect(() => {
    // Llamada a la API para obtener los movimientos de inventario de tipo 'S'
    fetch('http://127.0.0.1:8000/Inventario/listar_movimientos_inventario/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los movimientos de inventario');
        }
        return response.json();
      })
      .then(data => {
        // Filtrar los movimientos de tipo 'S'
        const movimientosSalida = data.movimientos_inventario.filter(movimiento => movimiento.tipo_movimiento === 'S');
        setMovimientos(movimientosSalida);
      })
      .catch(error => {
        console.error('Error al obtener los movimientos de inventario:', error);
      });
  }, []);

  const columns = [
    {
      title: 'ID Movimiento',
      dataIndex: 'id_movimiento',
      key: 'id_movimiento',
    },
    {
      title: 'Fecha/Hora',
      dataIndex: 'fechahora',
      key: 'fechahora',
    },
    {
      title: 'Detalles',
      key: 'detalles',
      render: (text, record) => (
        <Button type="link" onClick={() => showDetalle(record)}>Ver Detalles</Button>
      ),
    },
  ];

  const showDetalle = (record) => {
    setDetalleMovimiento(record);
    setDetalleVisible(true);
  };

  const handleCloseDetalle = () => {
    setDetalleVisible(false);
  };

  return (
    <div>
      <Table dataSource={movimientos} columns={columns} />

      <Modal
        title="Detalle de Movimiento"
        visible={detalleVisible}
        onCancel={handleCloseDetalle}
        footer={[
          <Button key="cerrar" onClick={handleCloseDetalle}>
            Cerrar
          </Button>
        ]}
      >
        <p><strong>Fecha/Hora:</strong> {detalleMovimiento.fechahora}</p>
        <p><strong>Detalles:</strong></p>
        <ul>
          {detalleMovimiento.detalles && detalleMovimiento.detalles.map(detalle => (
            <li key={detalle.id_detalle_movimiento}>
              ID Artículo: {detalle.id_articulo} | ID Producto: {detalle.id_producto} | Cantidad: {detalle.cantidad} | Tipo: {detalle.tipo}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default MovimientosInventario;
