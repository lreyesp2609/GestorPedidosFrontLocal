import React, { useState, useEffect } from 'react';
import { Table, Button, Tooltip, Avatar, Modal, Divider, Pagination, Segmented } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined } from '@ant-design/icons';
import imgmesas from './res/imgmesas.png';
import reversionpedido from './res/reversionpedido.png';
import reversionproveedor from './res/reversionproveedor.png';
import reversionpago from './res/reversionpago.png';
import reversionfactura from './res/reversionfactura.png';

const VerReversionesPedidos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [detalleMovimiento, setDetalleMovimiento] = useState({});
    const [selectedOpcion, setSelectedOpcion] = useState('ReversionPedido');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/Inventario/listar_movimientos_inventario/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los movimientos de inventario');
                }
                return response.json();
            })
            .then(data => {
                const movimientosReversion = data.movimientos_inventario.filter(movimiento => movimiento.tipo_movimiento === 'R' || movimiento.tipo_movimiento === 'P' && movimiento.sestado === '0');
                setMovimientos(movimientosReversion);
                setTotal(movimientosReversion.length);
            })
            .catch(error => {
                console.error('Error al obtener los movimientos de inventario:', error);
            });
    }, []);

    const columns = [
        {
            title: 'Tipo de Movimiento',
            dataIndex: 'tipo_movimiento',
            key: 'tipo_movimiento',
            render: (text) => (
                <span>{text === 'P' ? 'Original' : text === 'R' ? 'Reversión' : ''}</span>
            ),
        },
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
            title: 'Observación',
            dataIndex: 'observacion',
            key: 'observacion',
        },
        {
            title: 'Detalles',
            key: 'detalles',
            render: (text, record) => (
                <Button type="primary" onClick={() => showDetalle(record)}>Ver Detalles</Button>
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


    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Aquí podrías cargar datos paginados desde el servidor si fuera necesario
    };

    const Changueopcion = (value) => {
        setSelectedOpcion(value);
    }

    return (
        <div>
            <Row>
                <Col md={12}>
                    <Segmented
                        options={[
                            {
                                label: (
                                    <Tooltip title="Reversión de Pedidos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionpedido} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'ReversionPedido',

                            },
                            {
                                label: (
                                    <Tooltip title="Reversión de Pedidos de Proveedor">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionproveedor} size="large" />
                                        </div>
                                    </Tooltip>

                                ),
                                value: 'Mesas',

                            },
                            {
                                label: (
                                    <Tooltip title="Reversión de Facturas">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionfactura} size="large" />
                                        </div>
                                    </Tooltip>

                                ),
                                value: 'Mesas',

                            },
                            {
                                label: (
                                    <Tooltip title="Reversión de Pagos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={reversionpago} size="large" />
                                        </div>
                                    </Tooltip>

                                ),
                                value: 'Mesas',

                            }

                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}

                    />
                </Col>

                {selectedOpcion === 'ReversionPedido' && (
                    <>
                        <Divider>Control mesas</Divider>
                        <Col md={12}>
                            <Row>
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
                                                Producto:  {detalle.nombre_articulo} {detalle.nombre_producto} Cantidad: {detalle.cantidad}
                                            </li>
                                        ))}
                                    </ul>
                                </Modal>
                            </Row>

                        </Col>
                    </>
                )}
                {selectedOpcion === 'Categorias' && (
                    <>
                        <Divider>Control categorías</Divider>
                        <Col md={12}>
                            <EditarRecompensaComboForm />
                        </Col>
                    </>
                )}
            </Row>
        </div>
    );
};

export default VerReversionesPedidos;
