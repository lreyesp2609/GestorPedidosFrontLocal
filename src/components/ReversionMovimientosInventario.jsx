import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input } from 'antd';

const MovimientosInventario = ({ movimientosinv }) => {
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleMovimiento, setDetalleMovimiento] = useState({});
  const [reversionVisible, setReversionVisible] = useState(false);
  const [reversionObservacion, setReversionObservacion] = useState('');
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    setMovimientos(movimientosinv);
}, []);

  const columns = [
    {
      title: 'ID Movimiento',
      dataIndex: 'id_movimiento',
      key: 'id_movimiento',
    },
    {
      title: 'Pedido',
      dataIndex: 'id_pedido',
      key: 'id_pedido',
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
    {
      title: 'Reversión',
      key: 'reversion',
      render: (text, record) => (
        <Button type="primary" onClick={() => showReversionModal(record)}>Reversión</Button>
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

  const showReversionModal = (record) => {
    setDetalleMovimiento(record);
    setReversionVisible(true);
  };

  const handleCloseReversion = () => {
    setReversionVisible(false);
    setReversionObservacion('');
  };

  const handleReversion = () => {
    fetch(`http://127.0.0.1:8000/Inventario/crear_movimiento_reversion/${detalleMovimiento.id_movimiento}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ observacion: reversionObservacion }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al revertir el movimiento');
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta de la API:', data);
        setReversionVisible(false);
        setReversionObservacion('');
        
        // Actualizar el estado localmente eliminando el movimiento revertido
        setMovimientos(prevMovimientos => prevMovimientos.filter(movimiento => movimiento.id_movimiento !== detalleMovimiento.id_movimiento));
      })
      .catch(error => {
        console.error('Error al revertir el movimiento:', error);
      });
  };

  return (
    <div>
      <div className='table-responsive'><Table dataSource={movimientosinv} columns={columns} /></div>
      

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
              {detalle.nombre_articulo} {detalle.nombre_producto} - Cantidad: {detalle.cantidad}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        title="Reversión de Movimiento"
        visible={reversionVisible}
        onCancel={handleCloseReversion}
        footer={[
          <Button key="cancelar" onClick={handleCloseReversion}>
            Cancelar
          </Button>,
          <Button key="revertir" type="primary" onClick={handleReversion}>
            Revertir
          </Button>
        ]}
      >
        <p>Por favor, ingrese el motivo de la reversión:</p>
        <Input value={reversionObservacion} onChange={e => setReversionObservacion(e.target.value)} />
      </Modal>
    </div>
  );
};

export default MovimientosInventario;
