import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button } from "antd";
import jsPDF from "jspdf";
import GenerarFacturaPDF from "./GenerarFacturaCliente";

const { Column, ColumnGroup } = Table;

const Historial = () => {
  const [pedidos, setPedidos] = useState([]);
  const id_cuenta = localStorage.getItem("id_cuenta");
  const [facturaData, setFacturaData] = useState(null);
  const [productos, setProductos] = useState([]);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [logoEmpresa, setLogoEmpresa] = useState(null);
  const [combos, setCombos] = useState([]);
  const [clienteData, setClienteData] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchEmpresaInfo();
    fetchCombos();
    fetchClienteData();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/producto/listar/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de productos.");
      }
      const data = await response.json();
      setProductos(data.productos);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/combos/ver_combos/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de combos.");
      }
      const data = await response.json();
      setCombos(data.combos);
    } catch (error) {
      console.error("Error al obtener la lista de combos:", error);
    }
  };

  const fetchEmpresaInfo = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/empresa/infoEmpresa/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mensaje: "Datos de la empresa",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la información de la empresa.");
      }
      const data = await response.json();
      setEmpresaInfo(data.empresa_info);
      if (data.empresa_info && data.empresa_info.elogo) {
        setLogoEmpresa(`data:image/png;base64,${data.empresa_info.elogo}`);
      }
    } catch (error) {
      console.error("Error al obtener la información de la empresa:", error);
    }
  };

  const fetchClienteData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/Login/obtener_usuario/${id_cuenta}/`
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la información del cliente.");
      }
      const data = await response.json();
      setClienteData(data.usuario); // Establecer la información del cliente en el estado
    } catch (error) {
      console.error("Error al obtener la información del cliente:", error);
    }
  };
  

  const obtenerTipoDePedido = (inicial) => {
    switch (inicial) {
      case "D":
        return "A domicilio";
      case "R":
        return "A retirar";
      case "L":
        return "En local";
      default:
        return "";
    }
  };

  const obtenerMetodoDePago = (inicial) => {
    switch (inicial) {
      case "E":
        return "En efectivo";
      case "T":
        return "Transferencia";
      case "X":
        return "Tarjeta";
      case "F":
        return "Fraccionado";
      default:
        return "";
    }
  };

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/cliente/obtener_pedido/${id_cuenta}/`
        );

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        setPedidos(data.Pedidos);
      } catch (error) {
        console.error("Error al obtener pedidos:", error.message);
      }
    };

    obtenerPedidos();
  }, []);

  const generarFactura = async (record) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/cliente/cliente/${id_cuenta}/pedidos/${record.id_pedido}/`
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const facturaData = await response.json();
      setFacturaData(facturaData); // Almacenar los datos de la factura en el estado
    } catch (error) {
      console.error("Error al generar la factura:", error.message);
    }
  };

  return (
    <div style={{ marginLeft: "30px", marginRight: "50px" }}>
      {facturaData && (
        <GenerarFacturaPDF
          facturaData={facturaData}
          empresaInfo={empresaInfo}
          logoEmpresa={logoEmpresa}
          clienteData={clienteData}
          productos={productos}
          combos={combos}
          obtenerTipoDePedido={obtenerTipoDePedido}
          obtenerMetodoDePago={obtenerMetodoDePago}
        />
      )}
      <Table dataSource={pedidos} pagination={{ pageSize: 5 }}>
        <ColumnGroup title="Nombres">
          <Column
            title="Primer Nombre"
            dataIndex="nombre_usuario"
            key="nombre_usuario"
          />
          <Column
            title="Primer Apellido"
            dataIndex="apellido_usuario"
            key="nombre_usuario"
          />
        </ColumnGroup>
        <Column
          title="Estado del pedido"
          dataIndex="estado_del_pedido"
          key="estado_del_pedido"
          render={(estado) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Tag
                color={
                  estado === "O"
                    ? "blue"
                    : estado === "P"
                    ? "purple"
                    : estado === "C"
                    ? "orange"
                    : "default"
                }
              >
                {estado === "O"
                  ? "Ordenado"
                  : estado === "P"
                  ? "En Proceso"
                  : estado === "C"
                  ? "En camino"
                  : estado}
              </Tag>
            </div>
          )}
        />
        <Column
          title="Estado del pago"
          dataIndex="Pago"
          key="Pago"
          render={(estado) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Tag
                color={
                  estado === "En revisón"
                    ? "blue"
                    : estado === "Pagado"
                    ? "green"
                    : estado === "Denegado"
                    ? "red"
                    : "default"
                }
              >
                {estado === "En revisón"
                  ? "En revisón"
                  : estado === "Pagado"
                  ? "Pagado"
                  : estado === "Denegado"
                  ? "Denegado"
                  : estado}
              </Tag>
            </div>
          )}
        />
        <Column title="Total" dataIndex="Total" key="precio_unitario" />
        <Column
          title="Fecha de Pedido"
          dataIndex="fecha_pedido"
          key="fecha_pedido"
        />
        <Column
          title="Acciones"
          key="acciones"
          render={(text, record) => (
            <Space size="middle">
              <Button onClick={() => generarFactura(record)}>
                Generar factura
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default Historial;
