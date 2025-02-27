import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Row, Col, Table } from "react-bootstrap";
import API_URL from '../../config';

const ListaPedidosDomicilio = ({ onVolver }) => {
  const [pedidos, setPedidos] = useState([]);
  const idMotorizado = localStorage.getItem("id_motorizado"); // Obtén el id_motorizado

  useEffect(() => {
    listarPedidosDomicilio();
    const intervalId = setInterval(() => {
      listarPedidosDomicilio();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const listarPedidosDomicilio = () => {
    fetch(API_URL + "/Motorizado/pedidos/domicilio/")
      .then((response) => response.json())
      .then((data) => {
        setPedidos(data);
      })
      .catch((error) => console.error("Error fetching pedidos:", error));
  };

  const handleAceptarPedido = async (idPedido, idMotorizado, cantidad) => {
    try {
      const response = await fetch(API_URL + "/Motorizado/pedidos/aceptar-pedido/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_motorizado: idMotorizado,
          id_pedido: idPedido,
          cantidad: cantidad,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Pedido aceptado correctamente.");
        listarPedidosDomicilio(); // Recargar la lista de pedidos
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      alert("Error al aceptar el pedido.");
    }
  };

  return (
    <Row className="mt-4">
      <Col>
        <Card>
          <Card.Header as="h5" className="bg-primary text-white">
            Pedidos de Domicilio
            <Button
              variant="light"
              style={{ float: "right" }}
              onClick={onVolver}
            >
              Volver
            </Button>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Precio</th>
                  <th>Método de Pago</th>
                  <th>Fecha Pedido</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>{pedido.id_pedido}</td>
                    <td>{pedido.id_cliente}</td>
                    <td>${pedido.precio}</td>
                    <td>{pedido.metodo_de_pago === 'E' ? 'Efectivo' : 'Tarjeta'}</td>
                    <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                    <td>
                      <Badge
                        bg={
                          pedido.estado_del_pedido === 'P'
                            ? 'warning' // Pendiente
                            : pedido.estado_del_pedido === 'C'
                            ? 'info' // En Camino
                            : pedido.estado_del_pedido === 'E'
                            ? 'success' // Entregado
                            : 'secondary' // Otro
                        }
                      >
                        {pedido.estado_del_pedido === 'P'
                          ? 'Pendiente'
                          : pedido.estado_del_pedido === 'C'
                          ? 'En Camino'
                          : pedido.estado_del_pedido === 'E'
                          ? 'Entregado'
                          : 'Otro'}
                      </Badge>
                    </td>
                    <td>
                      {pedido.estado_del_pedido === 'O' && (
                        <Button
                          variant="success"
                          onClick={() => handleAceptarPedido(pedido.id_pedido, idMotorizado, 1)} // Usa idMotorizado
                        >
                          Confirmar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ListaPedidosDomicilio;