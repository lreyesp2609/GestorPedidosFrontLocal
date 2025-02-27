import React, { useState } from "react";
import { Card, Badge, Tooltip } from "antd";
import { Row, Col } from "react-bootstrap";
import {
  ShoppingCartOutlined, // Icono para Confirmación de Pedidos
  EnvironmentOutlined,  // Icono para Rutas de Entregas
  DollarOutlined,       // Icono para Caja Diaria
} from "@ant-design/icons";
import ListaPedidosDomicilio from "./ListaPedidosDomicilio";
import CajaDiaria from "./CajaDiaria"; // Importa el componente CajaDiaria

const MenuMotorizadoPedidos = () => {
  const [mostrarListaPedidos, setMostrarListaPedidos] = useState(false);
  const [mostrarRutas, setMostrarRutas] = useState(false);
  const [mostrarCajaDiaria, setMostrarCajaDiaria] = useState(false);

  const cardStyle = {
    width: "100%",
    height: "50%",
    margin: "16px",
    marginLeft: "1px",
    backgroundColor: "#CDEECC",
    border: "1px solid #A4A4A4",
    textAlign: "center",
    padding: "20px",
  };

  const iconStyle = {
    fontSize: "64px", // Tamaño del icono
    color: "#1890ff", // Color del icono
  };

  const { Meta } = Card;

  return (
    <div>
      {!mostrarListaPedidos && !mostrarRutas && !mostrarCajaDiaria ? (
        <Row>
          {/* Tarjeta de Confirmación de Pedidos */}
          <Col md={6}>
            <Badge.Ribbon text="Pedidos">
              <Tooltip title="Confirmación de pedidos">
                <Card
                  hoverable
                  style={cardStyle}
                  onClick={() => setMostrarListaPedidos(true)}
                >
                  <ShoppingCartOutlined style={iconStyle} />
                  <Meta title="Confirmación de Pedidos" style={{ marginTop: "10px" }} />
                </Card>
              </Tooltip>
            </Badge.Ribbon>
          </Col>

          {/* Tarjeta de Rutas de Entregas */}
          <Col md={6}>
            <Badge.Ribbon text="Rutas">
              <Tooltip title="Rutas de Entregas">
                <Card
                  hoverable
                  style={cardStyle}
                  onClick={() => setMostrarRutas(true)}
                >
                  <EnvironmentOutlined style={iconStyle} />
                  <Meta title="Rutas de Entregas" style={{ marginTop: "10px" }} />
                </Card>
              </Tooltip>
            </Badge.Ribbon>
          </Col>

          {/* Tarjeta de Caja Diaria */}
          <Col md={6}>
            <Badge.Ribbon text="Caja">
              <Tooltip title="Caja Diaria">
                <Card
                  hoverable
                  style={cardStyle}
                  onClick={() => setMostrarCajaDiaria(true)}
                >
                  <DollarOutlined style={iconStyle} />
                  <Meta title="Caja Diaria" style={{ marginTop: "10px" }} />
                </Card>
              </Tooltip>
            </Badge.Ribbon>
          </Col>
        </Row>
      ) : (
        <>
          {mostrarListaPedidos && (
            <ListaPedidosDomicilio onVolver={() => setMostrarListaPedidos(false)} />
          )}
          {mostrarRutas && (
            <div>
              {/* Aquí iría el componente para Rutas de Entregas */}
              <Button onClick={() => setMostrarRutas(false)}>Volver</Button>
              <h2>Rutas de Entregas</h2>
              {/* Contenido del componente de Rutas */}
            </div>
          )}
          {mostrarCajaDiaria && (
            <CajaDiaria onVolver={() => setMostrarCajaDiaria(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default MenuMotorizadoPedidos;