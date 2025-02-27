import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Row, Col, Table } from "react-bootstrap";
import API_URL from '../../config';

const CajaDiaria = ({ onVolver }) => {
  const [pedidosEnCamino, setPedidosEnCamino] = useState([]); // Pedidos con estado 'C' (En Camino)
  const [montoAcumulado, setMontoAcumulado] = useState(0); // Monto acumulado en la caja diaria
  const idMotorizado = localStorage.getItem("id_motorizado"); // Obtén el id_motorizado

  useEffect(() => {
    listarPedidosEnCamino();
    obtenerCajaDiaria();
    const intervalId = setInterval(() => {
      listarPedidosEnCamino();
      obtenerCajaDiaria();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Obtener la lista de pedidos en camino (estado 'C')
  const listarPedidosEnCamino = () => {
    fetch(API_URL + "/Motorizado/pedidos/domicilio/")
      .then((response) => response.json())
      .then((data) => {
        // Filtrar solo los pedidos en camino (estado 'C')
        const pedidosFiltrados = data.filter((pedido) => pedido.estado_del_pedido === 'C');
        setPedidosEnCamino(pedidosFiltrados);
      })
      .catch((error) => console.error("Error fetching pedidos en camino:", error));
  };

  // Obtener el monto acumulado en la caja diaria
  const obtenerCajaDiaria = () => {
    fetch(API_URL + `/Motorizado/pedidos/caja-diaria/${idMotorizado}/`)
      .then((response) => response.json())
      .then((data) => {
        setMontoAcumulado(data.monto_acumulado || 0);
      })
      .catch((error) => console.error("Error fetching caja diaria:", error));
  };

  // Marcar un pedido como entregado
  const handleEntregarPedido = async (idPedido) => {
    try {
      const response = await fetch(API_URL + "/Motorizado/pedidos/entregar-pedido/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_pedido: idPedido,
          id_motorizado: idMotorizado,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Pedido entregado correctamente.");
        listarPedidosEnCamino(); // Recargar la lista de pedidos en camino
        obtenerCajaDiaria(); // Actualizar el monto acumulado
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al entregar el pedido:", error);
      alert("Error al entregar el pedido.");
    }
  };

  return (
    <Row className="mt-4">
      <Col>
        <Card>
          <Card.Header as="h5" className="bg-primary text-white">
            Caja Diaria
            <Button
              variant="light"
              style={{ float: "right" }}
              onClick={onVolver}
            >
              Volver
            </Button>
          </Card.Header>
          <Card.Body>
            {/* Monto Acumulado */}
            <h5>Monto Acumulado: ${montoAcumulado}</h5>

            {/* Lista de Pedidos en Camino */}
            <Table striped bordered hover responsive className="mt-4">
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
                {pedidosEnCamino.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>{pedido.id_pedido}</td>
                    <td>{pedido.id_cliente}</td>
                    <td>${pedido.precio}</td>
                    <td>{pedido.metodo_de_pago === 'E' ? 'Efectivo' : 'Tarjeta'}</td>
                    <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                    <td>
                      <Badge bg="info">En Camino</Badge>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => handleEntregarPedido(pedido.id_pedido)}
                      >
                        Entregar
                      </Button>
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

export default CajaDiaria;