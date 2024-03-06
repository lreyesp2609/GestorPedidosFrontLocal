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
        const pedidosOrdenados = data.Pedidos.sort((a, b) => {
          return new Date(b.fecha_pedido) - new Date(a.fecha_pedido);
        });
        console.log("pedidos: ");
        console.log(pedidosOrdenados);
        setPedidos(pedidosOrdenados);
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
    <div style={{ marginLeft: "30px", marginRight: "50px", marginTop: '20px' }} >
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
      <div class="table-responsive">
        <Table dataSource={pedidos} pagination={{ pageSize: 5 }} class="table">
        <Column title="Pedido" dataIndex="id_pedido" key="id_pedido" />
          <Column
            title="Fecha"
            dataIndex="fecha_pedido"
            key="fecha_pedido"
            render={(fecha_pedido) => (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Tag color="blue">{new Date(fecha_pedido).toLocaleDateString()}</Tag>
              </div>
            )}
          />
          <Column
            title="Hora"
            dataIndex="fecha_pedido"
            key="fecha_pedido"
            render={(fecha_pedido) => (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Tag color="green">{new Date(fecha_pedido).toLocaleTimeString()}</Tag>
              </div>
            )}
          />
          <Column
            title="Metodo de pago"
            dataIndex="tipo_pago"
            key="tipo_pago"
            render={(tipo) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Tag
                  color={
                    tipo === "E"
                      ? "rgb(17,54, 11)"
                      : tipo === "T"
                        ? "#0080C0"
                        : tipo === "X"
                          ? "#F46A0F"
                          : tipo === "F"
                            ? "#004080"
                            : "default"
                  }
                >
                  {tipo === "E"
                    ? "Pago en efectivo"
                    : tipo === "T"
                      ? "Pago por transferencia"
                      : tipo === "X"
                        ? "Pago por tarjeta"
                        : tipo === "F"
                          ? "Pagos divididos"
                          : tipo}
                </Tag>
              </div>
            )}
          />
          <Column
            title="Estado del pedido"
            dataIndex="estado_del_pedido"
            key="estado_del_pedido"
            render={(estado) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Tag
                  color={
                    estado === "O"
                      ? "rgb(6, 0, 94)"
                      : estado === "P"
                        ? "rgb(62, 0, 100)"
                        : estado === "C"
                          ? "rgb(211, 116, 0)"
                          : estado === "E"
                          ? "#008080"
                          : "default"
                  }
                >
                  {estado === "O"
                    ? "Ordenado"
                    : estado === "P"
                      ? "En Proceso"
                      : estado === "C"
                        ? "En camino"
                        : estado === "E"
                          ? "Entregado"
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
                      ? "rgb(6, 0, 94)"
                      : estado === "Pagado"
                        ? "rgb(17, 54, 11)"
                        : estado === "Denegado"
                          ? "rgb(110, 1, 1)"
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
          <Column title="Total" dataIndex="Total" key="precio_unitario" />
        </Table>
      </div>
    </div>
  );
};

export default Historial;
