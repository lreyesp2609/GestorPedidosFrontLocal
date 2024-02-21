import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input } from 'antd';

const MovimientosInventario = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleMovimiento, setDetalleMovimiento] = useState({});
  const [reversionVisible, setReversionVisible] = useState(false);
  const [reversionObservacion, setReversionObservacion] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/Inventario/listar_movimientos_inventario/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los movimientos de inventario');
        }
        return response.json();
      })
      .then(data => {
        const movimientosSalida = data.movimientos_inventario.filter(movimiento => movimiento.tipo_movimiento === '' || movimiento.tipo_movimiento === 'P');
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
        // Actualizar la lista de movimientos después de la reversión
        fetch('http://127.0.0.1:8000/Inventario/listar_movimientos_inventario/')
          .then(response => response.json())
          .then(data => {
            const movimientosSalida = data.movimientos_inventario.filter(movimiento => movimiento.tipo_movimiento === '' || movimiento.tipo_movimiento === 'P');
            setMovimientos(movimientosSalida);
          })
          .catch(error => {
            console.error('Error al obtener los movimientos de inventario después de la reversión:', error);
          });
      })
      .catch(error => {
        console.error('Error al revertir el movimiento:', error);
      });
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
              Artículo: {detalle.nombre_articulo} | Producto: {detalle.nombre_producto} | Cantidad: {detalle.cantidad} | Tipo: {detalle.tipo}
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
