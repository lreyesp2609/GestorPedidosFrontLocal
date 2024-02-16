import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input } from 'antd';

const MovimientosInventario = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleMovimiento, setDetalleMovimiento] = useState({});
  const [reversionVisible, setReversionVisible] = useState(false);
  const [reversionMotivo, setReversionMotivo] = useState('');

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
    {
      title: 'Acciones',
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
    setReversionMotivo('');
  };

  const handleReversion = () => {
    // Aquí puedes hacer la llamada a la API para guardar la reversión con el motivo
    // y el ID del movimiento
    console.log('Motivo de Reversión:', reversionMotivo);
    console.log('ID del Movimiento:', detalleMovimiento.id_movimiento);

    // Luego de hacer la llamada a la API y guardar la reversión,
    // puedes cerrar el modal de reversión
    setReversionVisible(false);
    setReversionMotivo('');
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
        <Input value={reversionMotivo} onChange={e => setReversionMotivo(e.target.value)} />
      </Modal>
    </div>
  );
};

export default MovimientosInventario;
