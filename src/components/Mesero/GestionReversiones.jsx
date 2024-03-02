import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";

const ReversionesFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [meseros, setMeseros] = useState({});
  const [clientes, setClientes] = useState({});
  const [facturasValidadas, setFacturasValidadas] = useState([]);
  const [userData, setUserData] = useState(null);
  const [idFacturaSeleccionada, setIdFacturaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleFactura, setDetalleFactura] = useState(null);
  const [detalleNotaCredito, setDetalleNotaCredito] = useState(null);

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
          (factura) => factura.estado === "R"
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
        factura.estado === "R"
    );
    setFacturasValidadas(facturasFiltradas);
  }, [facturas]);

  const abrirModal = (idFactura) => {
    setIdFacturaSeleccionada(idFactura);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setIdFacturaSeleccionada(null);
    setModalVisible(false);
    setDetalleFactura(null);
    setDetalleNotaCredito(null);
  };

  const obtenerDetallesFactura = async (idFactura) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/Mesero/lista_facturas_con_detalles/${idFactura}/`);
      const data = await response.json();
      const factura = data.facturas_con_detalles.find(f => f.id_factura === idFactura);
      setDetalleFactura(factura);
      obtenerDetallesNotaCredito(idFactura);
    } catch (error) {
      console.error('Error al obtener detalles de la factura:', error);
    }
  };

const obtenerDetallesNotaCredito = async (id_notacredito) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/Mesero/listar_notas_credito/${id_notacredito}/`);
    const data = await response.json();
    setDetalleNotaCredito(data.nota_credito);
  } catch (error) {
    console.error('Error al obtener detalles de la nota de crédito:', error);
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
            onClick={() => {
              obtenerDetallesFactura(record.id_factura);
              abrirModal(record.id_factura);
            }}
          >
            Ver Detalles
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
          <Button type="primary">Generar nota de credito</Button>
        </span>
      )
    }
  ];

  return (
    <div>
      <h2>Reversion de Facturas</h2>
      <div style={{ overflowX: "auto" }}>
        <Table columns={columns} dataSource={facturasNoValidadas} />
      </div>

      {facturasValidadas.length > 0 && (
        <div>
          <h2>Reversion de Facturas Validadas</h2>
          <div style={{ overflowX: "auto" }}>
            <Table columns={columnsValidadas} dataSource={facturasValidadas} />
          </div>
        </div>
      )}

      <Modal
  title="Detalles del Reverso"
  visible={modalVisible}
  onOk={cerrarModal}
  onCancel={cerrarModal}
>
  {detalleFactura && (
    <div>
      <h3>Detalles de la reversión</h3>
      <p>Fecha de Emisión de la Factura: {detalleFactura.fecha_emision}</p>
      {detalleNotaCredito && (
        <div>
          <p>Fecha de Emisión del Reverso: {detalleNotaCredito.fecha_emision}</p>
          <p>Motivo: {detalleNotaCredito.motivo}</p>
        </div>
      )}
      <h4>Productos</h4>
      <ul>
        {detalleFactura.detalles_factura.map((detalle, index) => (
          <li key={index}>
            {detalle.nombre_producto || detalle.id_combo} - Cantidad:{" "}
            {detalle.cantidad}
          </li>
        ))}
      </ul>
      <p>Total a Pagar: {detalleFactura.a_pagar}</p>
    </div>
  )}
</Modal>
    </div>
  );
};

export default ReversionesFacturas;