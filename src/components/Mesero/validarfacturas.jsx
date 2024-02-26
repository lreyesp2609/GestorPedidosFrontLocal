import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { notification } from "antd";

const ValidarFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [meseros, setMeseros] = useState({});
  const [clientes, setClientes] = useState({});
  const [facturasValidadas, setFacturasValidadas] = useState([]);

  const [userData, setUserData] = useState(null);
  const id_cuenta = localStorage.getItem("id_cuenta");

  const ObtenerUsuario = async () => {
    if (id_cuenta) {
      fetch(`http://127.0.0.1:8000/Mesero/obtener_usuario/${id_cuenta}/`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.mesero);
          console.log("Datos del usuario:", data.mesero);
        })
        .catch((error) =>
          console.error("Error al obtener datos del usuario:", error)
        );
    } else {
      console.error("Nombre de usuario no encontrado en localStorage");
    }
  };

  useEffect(() => {
    ObtenerUsuario();
  }, []);

  const cargarFacturas = () => {
    fetch("http://127.0.0.1:8000/Mesero/lista_facturas/")
      .then((response) => response.json())
      .then((data) => {
        setFacturas(data.facturas);
      })
      .catch((error) => console.error("Error fetching facturas:", error));
  };

  useEffect(() => {
    cargarFacturas();

    fetch("http://127.0.0.1:8000/Mesero/listar_meseros/")
      .then((response) => response.json())
      .then((data) => {
        const meserosData = {};
        data.meseros.forEach((mesero) => {
          meserosData[mesero.id_mesero] = `${mesero.nombre} ${mesero.apellido}`;
        });
        setMeseros(meserosData);
      })
      .catch((error) => console.error("Error fetching meseros:", error));

    fetch("http://127.0.0.1:8000/cliente/ver_clientes/")
      .then((response) => response.json())
      .then((data) => {
        const clientesData = {};
        data.clientes.forEach((cliente) => {
          clientesData[cliente.id_cliente] = cliente.crazon_social;
        });
        setClientes(clientesData);
      })
      .catch((error) => console.error("Error fetching clientes:", error));
  }, []);

  useEffect(() => {
    const facturasFiltradas = facturas.filter(
      (factura) =>
        factura.codigo_factura &&
        factura.numero_factura_desde &&
        factura.numero_factura_hasta
    );
    setFacturasValidadas(facturasFiltradas);
  }, [facturas]);

  const validarFactura = (idFactura) => {
    if (userData) {
      const idCuenta = userData.id_cuenta;
      fetch(`http://127.0.0.1:8000/CodigoFactura/validar_factura/${idCuenta}/${idFactura}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      })
      .then((response) => {
        if (response.ok) {
          console.log(`Factura con ID ${idFactura} validada con éxito.`);
          notification.success({
            message: 'Validación Exitosa',
            description: `La factura con ID ${idFactura} se validó correctamente.`
          });
          cargarFacturas(); // Actualizar la lista de facturas
        } else {
          console.error(`Error al validar la factura con ID ${idFactura}.`);
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
    } else {
      console.error("Error: datos del usuario no disponibles.");
    }
  };

  const deshacerValidacion = (idFactura) => {
    console.log("Deshaciendo validación de factura con ID:", idFactura);
  };

  const deshacerValidacionValidada = (idFactura) => {
    console.log(
      "Deshaciendo validación de factura validada con ID:",
      idFactura
    );
  };

  const facturasNoValidadas = facturas.filter(
    (factura) =>
      !(
        factura.codigo_factura &&
        factura.numero_factura_desde &&
        factura.numero_factura_hasta
      )
  );

  return (
    <div>
      <h2>Lista de Facturas</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Factura</th>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Mesero</th>
            <th>Fecha Emisión</th>
            <th>Total</th>
            <th>IVA</th>
            <th>Descuento</th>
            <th>Subtotal</th>
            <th>A Pagar</th>
            <th>Código Factura</th>
            <th>Código Autorización</th>
            <th>Número Factura Desde</th>
            <th>Número Factura Hasta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturasNoValidadas.map((factura) => (
            <tr key={factura.id_factura}>
              <td>{factura.id_factura}</td>
              <td>{factura.id_pedido}</td>
              <td>{clientes[factura.id_cliente]}</td>
              <td>{meseros[factura.id_mesero]}</td>
              <td>{factura.fecha_emision}</td>
              <td>{factura.total}</td>
              <td>{factura.iva}</td>
              <td>{factura.descuento}</td>
              <td>{factura.subtotal}</td>
              <td>{factura.a_pagar}</td>
              <td>{factura.codigo_factura}</td>
              <td>{factura.codigo_autorizacion}</td>
              <td>{factura.numero_factura_desde}</td>
              <td>{factura.numero_factura_hasta}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => validarFactura(factura.id_factura)}
                >
                  Validar
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => deshacerValidacion(factura.id_factura)}
                >
                  Reverso
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Tabla de Facturas Validadas */}
      {facturasValidadas.length > 0 && (
        <div>
          <h2>Facturas Validadas</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID Factura</th>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Mesero</th>
                <th>Fecha Emisión</th>
                <th>Total</th>
                <th>IVA</th>
                <th>Descuento</th>
                <th>Subtotal</th>
                <th>A Pagar</th>
                <th>Código Factura</th>
                <th>Código Autorización</th>
                <th>Número Factura Desde</th>
                <th>Número Factura Hasta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasValidadas.map((factura) => (
                <tr key={factura.id_factura}>
                  <td>{factura.id_factura}</td>
                  <td>{factura.id_pedido}</td>
                  <td>{clientes[factura.id_cliente]}</td>
                  <td>{meseros[factura.id_mesero]}</td>
                  <td>{factura.fecha_emision}</td>
                  <td>{factura.total}</td>
                  <td>{factura.iva}</td>
                  <td>{factura.descuento}</td>
                  <td>{factura.subtotal}</td>
                  <td>{factura.a_pagar}</td>
                  <td>{factura.codigo_factura}</td>
                  <td>{factura.codigo_autorizacion}</td>
                  <td>{factura.numero_factura_desde}</td>
                  <td>{factura.numero_factura_hasta}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() =>
                        deshacerValidacionValidada(factura.id_factura)
                      }
                    >
                      Reverso
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ValidarFacturas;
