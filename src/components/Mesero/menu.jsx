import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Image, Card, Badge, Tooltip, Divider, Modal, Table } from "antd";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Dropdown,
  Offcanvas,
} from "react-bootstrap";
import imgtomarpedido from "./res/imgtomarpedido.png";
import imgfacturas from "./res/imgfacturas.png"

import RealizarPedidoMesero from "./pedidomesa";
import FacturasMesero from "./facturasmesero";
import RealizarPedidoLocal from "./pedidoslocal";

const MenuM = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const { Meta } = Card;
  const tooltipTitle = "Realiza pedidos a las mesas";
  const tooltipTitle1 = "Gestiona tus facturas";
  const tooltipTitle2 = "Gestiona tus pedidos";

  const columns = [
    {
      title: "ID",
      dataIndex: "id_pedido",
      key: "id_pedido",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio"
    },
    {
      title: "Mesa Asociada",
      dataIndex: "mesa_asociada",
      key: "mesa_asociada",
      render: (mesa_asociada) => (
        <Badge
        color={mesa_asociada ? '#F08C1E' : '#50B496'}
        count={mesa_asociada ? mesa_asociada.observacion : 'Local'}
      />
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_del_pedido",
      key: "estado_del_pedido",
      render: (estado_del_pedido) => (
        <Badge
          count={estado_del_pedido === 'O' ? 'Ordenado' : 'Preparado'}
          style={{
            backgroundColor: estado_del_pedido === 'O' ? '#f5222d' : '#52c41a',
          }}
        />
      ),
    },
    {
      title: "Accion",
      dataIndex: "estado_del_pedido",
      key: "Accion",
      render: (estado_del_pedido, record) => {
        console.log(record.estado_del_pedido);
        return estado_del_pedido === 'P' ? (
          <Button onClick={() => handleConfirmarPedido(record.id_pedido)}>
            Confirmar Pedido
          </Button>
        ) : null;
      },
    },
  ];

  const [currentPage, setCurrentPage] = useState("homemesero");
  useEffect(() => {
    listpedidos();
    const intervalId = setInterval(() => {
      listpedidos();
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  const listpedidos = () => {
    fetch("http://127.0.0.1:8000/Mesero/listpedidos/")
    .then((response) => response.json())
    .then((data) => {
      setPedidos(data.pedidos);
      console.log(data.pedidos);
    })
    .catch((error) => console.error("Error fetching pedidos:", error));
  }

  const handleCardClick = (page) => {
    console.log("Clicked on:", page);
    setCurrentPage(page);
  };

  const handleAtrasClick = (page) => {
    console.log("Clicked on:", page);
    setCurrentPage("homemesero");
  };

  const cardStyle = {
    width: "100%",
    height: "50%",
    margin: "16px",
    marginLeft: "1px",
    backgroundColor: "#CDEECC",
    border: "1px solid #A4A4A4",
  };

  const titleStyle = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const openNewWindow = () => {
    window.open("/cocina", "_blank");
  };
  const handleConfirmarPedido = (idPedido) => {
    // Lógica para confirmar el pedido
    const formData = new FormData();
    formData.append('id_pedido', idPedido);
  
    fetch('http://127.0.0.1:8000/Mesero/confirmarpedido/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        listpedidos();
      })
      .catch(error => console.error('Error confirmando el pedido:', error));
  };

  return (
    <>
      <Row>
        {currentPage === "homemesero" && (
          <>
            <Col xs={24} sm={12} md={5} lg={3}>
              <Badge.Ribbon text="Pedidos">
                <Tooltip title={tooltipTitle}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Pedidos"
                        src={imgtomarpedido}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("pedidos")}
                  >
                    <Meta title={tooltipTitle}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col xs={24} sm={12} md={5} lg={3}>
              <Badge.Ribbon text="Facturas">
                <Tooltip title={tooltipTitle1}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <Image
                        alt="Facturas"
                        src={imgfacturas}
                        style={{
                          padding: "5%",
                          height: "150px",
                          width: "auto",
                        }}
                        preview={false}
                      />
                    }
                    className="text-center"
                    onClick={() => handleCardClick("facturas")}
                  >
                    <Meta title={tooltipTitle1}></Meta>
                  </Card>
                </Tooltip>
              </Badge.Ribbon>
            </Col>
            <Col md={6}>
              <div style={{ border: "1px solid #A4A4A4", borderRadius: '5px', minHeight: '100%' }}>
                <Divider>Pedidos</Divider>
                <Card>
                  <p>Pedidos actuales:</p>
                  <p>Pedidos pendientes:</p>
                  <p>Pedidos listos:</p>
                </Card>
                <Divider>Pedidos</Divider>
                <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={pedidos}
                  rowKey="id_pedido"
                />
                </div>
              </div>
            </Col>

          </>
        )}
        {currentPage != "homemesero" && (
          <>
            <Row>
              <Col md={12}>
                <Button
                  variant="success"
                  style={{
                    position: "fixed",
                    right: "16px",
                    bottom: "16px",
                    zIndex: 1000,
                  }}
                  onClick={() => handleAtrasClick()}
                >
                  Atrás
                </Button>
              </Col>
            </Row>
          </>
        )}
        {currentPage === "pedidos" && (
          <>
            <Button
              variant="success"
              style={{
                right: "16px",
                bottom: "16px",
                zIndex: 1000,
              }}
              onClick={showModal}
            >
              Realizar pedido
            </Button>
            <Row>
              <Divider>Pedidos de mesas</Divider>
              <Col md={12}>
                <RealizarPedidoMesero />
              </Col>
            </Row>
          </>
        )}
        {currentPage === "facturas" && (
          <>
            <Row>
              <Divider>Gestión de facturación</Divider>
              <Col md={12}>
                <FacturasMesero />
              </Col>
            </Row>
          </>
        )}
      </Row>

      <RealizarPedidoLocal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

    </>
  );
};

export default MenuM;
