import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Container, Row, Col, Button, Form, Nav, Navbar, Dropdown} from 'react-bootstrap';
import { notification, Avatar, Card, Popconfirm, Statistic, Select,Modal } from 'antd';
import MovimientosInventario from "./ReversionMovimientosInventario.jsx"; // Asegúrate de que la ruta del archivo sea correcta
import "./comanda.css";

const MenuComandas = () => {
    const [empresaInfo, setEmpresaInfo] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [bodega, setBodega] = useState('');
    const [bodegas, setBodegas] = useState([]);
    const [tiemposTranscurridos, setTiemposTranscurridos] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/bodega/listar/')
            .then(response => response.json())
            .then(data => {
                setBodegas(data.bodegas);
                if (data.bodegas.length > 0) {
                    setBodega(data.bodegas[0].id_bodega);
                }
            })
            .catch(error => console.error('Error fetching bodegas:', error));
    }, []);

    const handleClearLocalStorage = () => {
        window.location.href = '/';
        localStorage.clear();
        console.log('LocalStorage limpiado.');
    };

    const obtenerPedidos = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/Mesero/pedidos/');
            const data = await response.json();
            const pedidosOrdenados = data.pedidos.sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido));
            setPedidos(pedidosOrdenados);
        } catch (error) {
            console.error('Error al obtener la lista de pedidos', error);
        }
    };

    useEffect(() => {
        obtenerPedidos();
        const intervalId = setInterval(obtenerPedidos, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const obtenerInformacionEmpresa = async () => {
        try {
            const respuesta = await fetch('http://127.0.0.1:8000/empresa/infoEmpresa/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const datos = await respuesta.json();
            setEmpresaInfo(datos.empresa_info);
        } catch (error) {
            console.error('Error al obtener la información de la empresa:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/Login/rol/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('token'),
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const rol = data.rol;

                    if (rol !== 'S' && rol !== 'X') {
                        window.location.href = '/';
                    }
                    obtenerInformacionEmpresa();
                } else {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };
        fetchData();
    }, []);

    const handleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleBodega = (value) => {
        setBodega(value);
    };

    const onStartCronometro = (pedido) => {
        const fechaPedidoObj = new Date(pedido.fecha_pedido);
        const interval = setInterval(() => {
            const tiempoTranscurrido = Date.now() - fechaPedidoObj.getTime();
            setTiemposTranscurridos(prevTiempos => ({
                ...prevTiempos,
                [pedido.id_pedido]: tiempoTranscurrido,
            }));
        }, 1000);
        return () => clearInterval(interval);
    };

    useEffect(() => {
        pedidos.forEach((pedido) => {
            onStartCronometro(pedido);
        });
    }, [pedidos]);

    return (
        <div className='content' style={{ height: '100%', minHeight: '100vh' }}>
            <div style={{ padding: '0.5%', height: '100%' }}>
                <Navbar expand="lg" style={{ backgroundColor: '#4CAF50', color: '#fff', borderRadius: '10px' }}>
                    <Container fluid>
                        <Navbar.Brand href="/cocina">
                            {empresaInfo && empresaInfo.elogo && (
                                <img src={`data:image/png;base64,${empresaInfo.elogo}`} width={50} style={{ borderRadius: '50%' }} alt="Logo de la empresa" />
                            )}
                            <strong style={{ fontWeight: 'bold', fontSize: '15px' }}>      COMANDAS</strong>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll />
                            <Form className="d-flex">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                        <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}> Perfil</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1" onClick={handleClearLocalStorage}>Salir</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            <Row >
                <Col md={3}><Button type="primary" onClick={handleModal} style={{ margin: '16px' }}>Ver últimos movimientos</Button></Col>
                
                <Col md={1} style={{ padding: '5px', margin: '2px' }}>
                    <Select
                        style={{ width: '100%', marginBottom: '16px' }}
                        value={bodega}
                        onChange={(value) => handleBodega(value)}
                    >
                        {bodegas.map(bodega => (
                            <Select.Option key={bodega.id_bodega} value={bodega.id_bodega}>
                                {bodega.nombrebog}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                
            </Row>
            <Row style={{ marginLeft: '2%' }}>
                <Col md={12}>
                    <Row>
                        {pedidos.map((pedido) => (
                            <Col md={2} key={pedido.id_pedido}>
                                <Popconfirm
                                    title="Preparar pedido"
                                    description="¿Ya está listo el pedido?"
                                    okText="Sí"
                                    cancelText="No"
                                    onConfirm={() => enviarListaProductos(pedido.detalle_pedido, pedido.id_pedido)}
                                >
                                    <Card
                                        title={"Pedido " + pedido.id_pedido}
                                        style={{
                                            marginTop: '5px',
                                            height: '300px',
                                            overflowY: 'auto',
                                            border: '3px solid',
                                            color: tiemposTranscurridos[pedido.id_pedido] > 1000000
                                                ? 'red'
                                                : tiemposTranscurridos[pedido.id_pedido] > 480000
                                                    ? 'orange'
                                                    : tiemposTranscurridos[pedido.id_pedido] > 300000
                                                        ? 'brown'
                                                        : '',
                                        }}
                                        extra={
                                            <Statistic
                                                value={tiemposTranscurridos[pedido.id_pedido] || 0}
                                                formatter={(value) => {
                                                    const hours = String(Math.floor(value / 3600000)).padStart(2, '0');
                                                    const minutes = String(Math.floor((value % 3600000) / 60000)).padStart(2, '0');
                                                    const seconds = String(Math.floor((value % 60000) / 1000)).padStart(2, '0');
                                                    return `${hours}:${minutes}:${seconds}`;
                                                }}
                                            />
                                        }
                                        hoverable
                                    >
                                        <Row>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th style={{ border: '1px solid #ddd', padding: '4px' }}>Producto</th>
                                                        <th style={{ border: '1px solid #ddd', padding: '4px' }}>Cant.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pedido.detalle_pedido.map((detalle) => (
                                                        <tr key={detalle.id_producto}>
                                                            <td style={{ border: '1px solid #ddd', padding: '4px' }}>{detalle.nombreproducto}</td>
                                                            <td style={{ border: '1px solid #ddd', padding: '4px' }}>{detalle.cantidad}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <br />
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th style={{ border: '1px solid #ddd', padding: '4px' }}>Observación</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{pedido.observacion_del_cliente}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Row>
                                    </Card>
                                </Popconfirm>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Modal
                title="Últimos movimientos"
                visible={modalVisible} // Utiliza el estado modalVisible para controlar la visibilidad del modal
                onCancel={handleModal}
                footer={null}
            >
                <MovimientosInventario/>
            </Modal>
        </div>
    );
};

export default MenuComandas;
