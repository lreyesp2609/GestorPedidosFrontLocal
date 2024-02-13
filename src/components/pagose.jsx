import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, Input, DatePicker, message, Card } from "antd";
import { Row, Col } from 'react-bootstrap';
import ConfigPagos from "./configpagos";

const { Option } = Select;

const PagosE = ({ }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [tipoActual, setTipoActual]=useState(null);
    const [tipoPagos, setTipoPagos]=useState(null);


    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    const handleOpenModal2 = (employee) => {
        tipoPagData();
        setSelectedEmployee(employee);
        setModalVisible2(true);
        setTipoActual(null);
        tipoPagos.forEach((item) => {
            console.log('Tipo de empleado:'+employee.tipo);
            console.log('rol de item: '+item.rol);
            if(employee.tipo==item.rol){
                console.log('Tipo de pago: '+item.tipo_pago);
                setTipoActual(item.tipo_pago);
            }
        })
        console.log(employee.tipo);
    };

    const handleCloseModal2 = () => {
        setModalVisible2(false);
    };

    const handleSaveConfig = () => {
        // Lógica para guardar la configuración de pagos
        message.success("Configuración de pagos guardada con éxito");
        handleCloseModal();
    };

    useEffect(() => {
        tipoPagData();
      }, []);
      const tipoPagData = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/pagos/tipodepagos/");
          if (response.ok) {
            const result = await response.json();
            setTipoPagos(result.tipopagos);
          } else {
            console.error("Error al cargar los datos");
          }
        } catch (error) {
          console.error("Error al procesar la solicitud", error);
        }
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/empleado/listar-empleados2/0/");
                if (response.ok) {
                    const result = await response.json();
                    setEmpleados(result.empleados);
                    console.log(result);
                } else {
                    console.error("Error al cargar los datos");
                }
            } catch (error) {
                console.error("Error al procesar la solicitud", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Row>
                <Col md={11}></Col>
                <Col md={1}>
                    <Button
                        type="primary"
                        onClick={handleOpenModal}
                    >
                        Configurar Pagos
                    </Button>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md={12}>
                    <Card
                        hoverable
                        className="text-center"
                        style={{ border: '1px solid' }}
                    >

                        <Row>

                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Fecha</p>
                                <Row>
                                    <Col md={4}>Desde:</Col>
                                    <Col md={8}><DatePicker /></Col>
                                </Row>
                                <Row>
                                    <Col md={4}>Hasta:</Col>
                                    <Col md={8}><DatePicker /></Col>
                                </Row>
                            </Col>
                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Trabajador</p>
                                <Row>
                                    <Col md={12}>
                                        <Input
                                            style={{ width: "100%" }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Estado</p>
                                <Row>
                                    <Col md={12}>
                                        <Select defaultValue={"Sin pagar"}>
                                            <Option value="s">Sin pagar</Option>
                                            <Option value="p">Pagados</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Tipo de pago</p>
                                <Row>
                                    <Col md={12}>
                                        <Select defaultValue={"S"}>
                                            <Option value="H">Pago por horas</Option>
                                            <Option value="S">Pago semanal</Option>
                                            <Option value="M">Pago mensual</Option>
                                            <Option value="T">Pago trimestral</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md={12}>
                    <Card
                        hoverable
                        className="text-center"
                        style={{ border: '1px solid' }}
                    >
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>N</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Trabajador</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Rol</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Sucursal</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {empleados.map((empleado) => (
                                    <tr>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{empleado.id}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{empleado.nombre} {empleado.apellido}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{empleado.tipo}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{empleado.sucursal ? empleado.sucursal : 'N/A'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>
                                            <Button
                                                type="primary"
                                                onClick={() => handleOpenModal2(empleado)}
                                            >
                                                Configurar Pagos
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md={12}>
                    <Card
                        hoverable
                        className="text-center"
                        style={{ border: '1px solid' }}
                    >
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>N</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Fecha Pago</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Trabajador</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Cedula</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Pagado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr></tr>
                            </tbody>
                        </table>


                    </Card>
                </Col>
            </Row>
            {/* Modal para la configuración de pagos */}
            <Modal
                title="Configura los pagos"
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <ConfigPagos />

            </Modal>
            <Modal
                title="Agregar pago"
                visible={modalVisible2}
                onCancel={handleCloseModal2}
                footer={null}
            >
                {selectedEmployee && (
                    <div>
                        <p>Empleado Seleccionado: {selectedEmployee.nombre} {selectedEmployee.apellido}</p>
                        <p>Selecciona {tipoActual === 'S' ? 'semana' : (tipoActual === 'T' ? 'el trimestre' : (tipoActual === 'M' ? 'el mes' : ''))}</p>
                        {tipoActual=='S'&&(
                            <DatePicker picker="week" />
                        )}
                        {tipoActual=='T'&&(
                            <DatePicker picker="quarter" />
                        )}
                        {tipoActual=='M'&&(
                            <DatePicker picker="month" />
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default PagosE;
