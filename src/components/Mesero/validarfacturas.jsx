import React, { useState, useEffect } from "react";
import { Table, Button, notification, Modal, Input } from "antd";

const ValidarFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [meseros, setMeseros] = useState({});
  const [clientes, setClientes] = useState({});
  const [facturasValidadas, setFacturasValidadas] = useState([]);
  const [userData, setUserData] = useState(null);
  const [idFacturaSeleccionada, setIdFacturaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [motivoReverso, setMotivoReverso] = useState("");

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
        const facturasFiltradas = data.facturas.filter(
          (factura) => factura.estado !== "R"
        );
        setFacturas(facturasFiltradas);
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
        factura.numero_factura_hasta &&
        factura.estado !== "R"
    );
    setFacturasValidadas(facturasFiltradas);
  }, [facturas]);

  const validarFactura = (idFactura) => {
    if (userData) {
      const idCuenta = userData.id_cuenta;
      fetch(
        `http://127.0.0.1:8000/CodigoFactura/validar_factura/${idCuenta}/${idFactura}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log(`Factura con ID ${idFactura} validada con éxito.`);
            notification.success({
              message: "Validación Exitosa",
              description: `La factura con ID ${idFactura} se validó correctamente.`,
            });
            cargarFacturas(); // Actualizar la lista de facturas
          } else {
            console.error(
              `Error al validar la factura con ID ${idFactura}.`
            );
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    } else {
      console.error("Error: datos del usuario no disponibles.");
    }
  };

  const abrirModal = (idFactura) => {
    setIdFacturaSeleccionada(idFactura);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setIdFacturaSeleccionada(null);
    setModalVisible(false);
    setMotivoReverso("");
  };

  const confirmarReverso = () => {
    if (motivoReverso.trim() !== "") {
      cerrarModal();
      fetch(
        `http://127.0.0.1:8000/Mesero/crear_reverso_factura/${idFacturaSeleccionada}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ motivo_reverso: motivoReverso }),
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log(
              `Reverso de factura con ID ${idFacturaSeleccionada} creado con éxito.`
            );
            notification.success({
              message: "Reverso Exitoso",
              description: `Se ha creado el reverso de la factura con ID ${idFacturaSeleccionada}.`,
            });
            cargarFacturas(); // Actualizar la lista de facturas
          } else {
            console.error(
              `Error al crear el reverso de la factura con ID ${idFacturaSeleccionada}.`
            );
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    } else {
      notification.error({
        message: "Error",
        description: "Por favor, ingrese un motivo para el reverso.",
      });
    }
  };

  const facturasNoValidadas = facturas.filter(
    (factura) =>
      !(
        factura.codigo_factura &&
        factura.numero_factura_desde &&
        factura.numero_factura_hasta
      )
  );

  const deshacerValidacion = (idFactura) => {
    setIdFacturaSeleccionada(idFactura);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "ID Factura",
      dataIndex: "id_factura",
      key: "id_factura"
    },
    {
      title: "ID Pedido",
      dataIndex: "id_pedido",
      key: "id_pedido"
    },
    {
      title: "Cliente",
      dataIndex: "id_cliente",
      key: "id_cliente",
      render: (id_cliente) => clientes[id_cliente]
    },
    {
      title: "Mesero",
      dataIndex: "id_mesero",
      key: "id_mesero",
      render: (id_mesero) => meseros[id_mesero]
    },
    {
      title: "Fecha Emisión",
      dataIndex: "fecha_emision",
      key: "fecha_emision"
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total"
    },
    {
      title: "IVA",
      dataIndex: "iva",
      key: "iva"
    },
    {
      title: "Descuento",
      dataIndex: "descuento",
      key: "descuento"
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal"
    },
    {
      title: "A Pagar",
      dataIndex: "a_pagar",
      key: "a_pagar"
    },
    {
      title: "Código Factura",
      dataIndex: "codigo_factura",
      key: "codigo_factura"
    },
    {
      title: "Código Autorización",
      dataIndex: "codigo_autorizacion",
      key: "codigo_autorizacion"
    },
    {
      title: "Número Factura Desde",
      dataIndex: "numero_factura_desde",
      key: "numero_factura_desde"
    },
    {
      title: "Número Factura Hasta",
      dataIndex: "numero_factura_hasta",
      key: "numero_factura_hasta"
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            onClick={() => validarFactura(record.id_factura)}
          >
            Validar
          </Button>{" "}
        </span>
      )
    },
    {
      title: "Reversión",
      key: "reversión",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            danger
            onClick={() => deshacerValidacion(record.id_factura)}
          >
            Reverso
          </Button>
        </span>
      )
    }
  ];

  const columnsValidadas = [
    {
      title: "ID Factura",
      dataIndex: "id_factura",
      key: "id_factura"
    },
    {
      title: "ID Pedido",
      dataIndex: "id_pedido",
      key: "id_pedido"
    },
    {
      title: "Cliente",
      dataIndex: "id_cliente",
      key: "id_cliente",
      render: (id_cliente) => clientes[id_cliente]
    },
    {
      title: "Mesero",
      dataIndex: "id_mesero",
      key: "id_mesero",
      render: (id_mesero) => meseros[id_mesero]
    },
    {
      title: "Fecha Emisión",
      dataIndex: "fecha_emision",
      key: "fecha_emision"
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total"
    },
    {
      title: "IVA",
      dataIndex: "iva",
      key: "iva"
    },
    {
      title: "Descuento",
      dataIndex: "descuento",
      key: "descuento"
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal"
    },
    {
      title: "A Pagar",
      dataIndex: "a_pagar",
      key: "a_pagar"
    },
    {
      title: "Código Factura",
      dataIndex: "codigo_factura",
      key: "codigo_factura"
    },
    {
      title: "Código Autorización",
      dataIndex: "codigo_autorizacion",
      key: "codigo_autorizacion"
    },
    {
      title: "Número Factura Desde",
      dataIndex: "numero_factura_desde",
      key: "numero_factura_desde"
    },
    {
      title: "Número Factura Hasta",
      dataIndex: "numero_factura_hasta",
      key: "numero_factura_hasta"
    },
    {
      title: "Reversión",
      key: "reversión",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            danger
            onClick={() => deshacerValidacion(record.id_factura)}
          >
            Reverso
          </Button>
        </span>
      )
    }
  ];

  return (
    <div>
      <h2>Lista de Facturas</h2>
      <div style={{ overflowX: "auto" }}>
        <Table columns={columns} dataSource={facturasNoValidadas} />
      </div>

      {facturasValidadas.length > 0 && (
        <div>
          <h2>Facturas Validadas</h2>
          <div style={{ overflowX: "auto" }}>
            <Table columns={columnsValidadas} dataSource={facturasValidadas} />
          </div>
        </div>
      )}

      <Modal
        title="Motivo del Reverso"
        visible={modalVisible}
        onOk={confirmarReverso}
        onCancel={cerrarModal}
      >
        <Input
          placeholder="Ingrese el motivo del reverso"
          value={motivoReverso}
          onChange={(e) => setMotivoReverso(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ValidarFacturas;
