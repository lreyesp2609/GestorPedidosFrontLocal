import React, { useEffect, useState } from "react";
import { Modal, Space, Table, Tag, Button, QRCode,Alert } from "antd";
import jsPDF from "jspdf";
import GenerarFacturaPDF from "./GenerarFacturaCliente";
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Row, Col } from "react-bootstrap";
import API_URL from '../config';

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
  const [MostrarModal, setMostrarModal] = useState(false);
  const [datosQR, setDatosQR] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchEmpresaInfo();
    fetchCombos();
    fetchClienteData();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(API_URL +"/producto/listar/");
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
      const response = await fetch(API_URL +"/combos/ver_combos/");
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
        API_URL +"/empresa/infoEmpresa/",
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
        API_URL +`/Login/obtener_usuario/${id_cuenta}/`
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

  const mostrarModal = (pedido) => {
    console.log(pedido);
    setMostrarModal(true);
    setDatosQR(JSON.stringify(pedido))
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
          API_URL +`/cliente/obtener_pedido/${id_cuenta}/`
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
        API_URL +`/cliente/cliente/${id_cuenta}/pedidos/${record.id_pedido}/`
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
    <div style={{ 
      padding: '30px', 
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      margin: '20px'
    }}>
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
      
      <h2 style={{ 
        marginBottom: '20px', 
        color: '#333',
        fontWeight: '600',
        fontSize: '24px'
      }}>Historial de Pedidos</h2>
      
      <div className="table-responsive">
        <Table 
          dataSource={pedidos} 
          pagination={{ 
            pageSize: 5,
            showSizeChanger: false,
            style: { marginTop: '20px' }
          }} 
          className="table"
          rowKey="id_pedido"
          style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <Column 
            title="Pedido" 
            dataIndex="id_pedido" 
            key="id_pedido"
            render={(id) => (
              <span style={{ fontWeight: '500' }}>#{id}</span>
            )}
          />
          <Column
            title="Fecha"
            dataIndex="fecha_pedido"
            key="fecha_pedido"
            render={(fecha_pedido) => (
              <Tag color="#e6f7ff" style={{ color: '#1890ff', border: 'none', padding: '4px 8px' }}>
                {new Date(fecha_pedido).toLocaleDateString()}
              </Tag>
            )}
          />
          <Column
            title="Hora"
            dataIndex="fecha_pedido"
            key="fecha_pedido"
            render={(fecha_pedido) => (
              <Tag color="#f6ffed" style={{ color: '#52c41a', border: 'none', padding: '4px 8px' }}>
                {new Date(fecha_pedido).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Tag>
            )}
          />
          <Column
            title="Método de pago"
            dataIndex="tipo_pago"
            key="tipo_pago"
            render={(tipo) => {
              let color, text, bgColor;
              
              if (tipo === "E") {
                color = '#135200';
                text = "Efectivo";
                bgColor = '#f6ffed';
              } else if (tipo === "T") {
                color = '#0050b3';
                text = "Transferencia";
                bgColor = '#e6f7ff';
              } else if (tipo === "X") {
                color = '#ad4e00';
                text = "Tarjeta";
                bgColor = '#fff7e6';
              } else if (tipo === "F") {
                color = '#003a8c';
                text = "Dividido";
                bgColor = '#e6f4ff';
              }
              
              return (
                <Tag color={bgColor} style={{ color, border: 'none', padding: '4px 8px' }}>
                  {text}
                </Tag>
              );
            }}
          />
          <Column
            title="Estado del pedido"
            dataIndex="estado_del_pedido"
            key="estado_del_pedido"
            render={(estado) => {
              let color, text, bgColor, icon;
              
              if (estado === "O") {
                color = '#030075';
                text = "Ordenado";
                bgColor = '#f0f5ff';
                icon = null;
              } else if (estado === "P") {
                color = '#531dab';
                text = "En Proceso";
                bgColor = '#f9f0ff';
                icon = <SyncOutlined spin style={{ marginRight: '5px' }} />;
              } else if (estado === "C") {
                color = '#ad4e00';
                text = "En camino";
                bgColor = '#fff7e6';
                icon = null;
              } else if (estado === "E") {
                color = '#006d75';
                text = "Entregado";
                bgColor = '#e6fffb';
                icon = <CheckCircleOutlined style={{ marginRight: '5px' }} />;
              }
              
              return (
                <Tag color={bgColor} style={{ color, border: 'none', padding: '4px 8px' }}>
                  {icon}{text}
                </Tag>
              );
            }}
          />
          <Column
            title="Estado del pago"
            dataIndex="Pago"
            key="Pago"
            render={(estado) => {
              let color, bgColor, icon;
              
              if (estado === "En revisón") {
                color = '#030075';
                bgColor = '#f0f5ff';
                icon = null;
              } else if (estado === "Pagado") {
                color = '#135200';
                bgColor = '#f6ffed';
                icon = <CheckCircleOutlined style={{ marginRight: '5px' }} />;
              } else if (estado === "Denegado") {
                color = '#a8071a';
                bgColor = '#fff1f0';
                icon = <CloseCircleOutlined style={{ marginRight: '5px' }} />;
              }
              
              return (
                <Tag color={bgColor} style={{ color, border: 'none', padding: '4px 8px' }}>
                  {icon}{estado}
                </Tag>
              );
            }}
          />
          <Column
            title="Total"
            dataIndex="Total"
            key="precio_unitario"
            render={(total) => (
              <span style={{ fontWeight: '600', color: '#135200' }}>
                ${total}
              </span>
            )}
          />
          <Column
            title="Acciones"
            key="acciones"
            render={(text, record) => (
              <Space size="middle">
                <Button 
                  onClick={() => generarFactura(record)}
                  type="primary"
                  style={{ 
                    backgroundColor: '#722ed1',
                    borderColor: '#722ed1',
                    borderRadius: '6px',
                    boxShadow: 'none'
                  }}
                  size="small"
                >
                  Factura
                </Button>
                <Button 
                  onClick={() => mostrarModal(record)}
                  style={{ 
                    backgroundColor: '#13c2c2',
                    borderColor: '#13c2c2',
                    color: 'white',
                    borderRadius: '6px',
                    boxShadow: 'none'
                  }}
                  size="small"
                >
                  QR
                </Button>
              </Space>
            )}
          />
        </Table>
      </div>

      <Modal 
        visible={MostrarModal} 
        onCancel={() => setMostrarModal(false)} 
        footer={null} 
        title="Código de pedido"
        width={400}
        bodyStyle={{ padding: '20px' }}
        style={{ top: 20 }}
      >
        <div style={{ 
          backgroundColor: '#f6ffed', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <Alert
            message="¡Escanea este código QR!"
            description="Muestra el código al motorizado o en el local para confirmar la entrega o retirar tu pedido."
            type="success"
            showIcon
            style={{ border: 'none', backgroundColor: 'transparent' }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          padding: '10px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <QRCode
            errorLevel="H"
            size={200}
            value={datosQR}
            icon={logoEmpresa}
            iconSize={40}
            style={{ margin: '10px 0' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Historial;
