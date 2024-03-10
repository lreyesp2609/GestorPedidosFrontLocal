import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Table, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import GenerarReportePDF from "./generarReporte";
import moment from 'moment';
import { notification } from 'antd';

const { Column } = Table;
const { Option } = Select;

const ReportManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [selectedTipoEmpleado, setSelectedTipoEmpleado] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empleadosData, setEmpleadosData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasc, setCategoriasCombos] = useState([]);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [logoEmpresa, setLogoEmpresa] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [facturasEmitidas, setFacturasEmitidas] = useState([]);
  const [selectedSucursalName, setSelectedSucursalName] = useState("")
  const [selectedTipoEmpleadoName, setSelectedTipoEmpleadoName] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCombos, setSelectedCombos] = useState(null);
  const [modalVisibleProductos, setModalVisibleProductos] = useState(false);
  const [modalVisibleCombos, setModalVisibleCombos] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfViewerVisible, setPdfViewerVisible] = useState(null);
  const [modalVisibleVentas, setModalVisibleVentas] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [selectedVentasName, setSelectedVentasName] = useState("");
  const [showSucursalOptions, setShowSucursalOptions] = useState(false);
  const [showMeseroOptions, setShowMeseroOptions] = useState(false);
  const [showProductoOptions, setShowProductoOptions] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [meseros, setMeseros] = useState([]);
  const [selectedMesero, setSelectedMesero] = useState(null);
  const [selectedMeseroName, setSelectedMeseroName] = useState("")
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedProductoName, setSelectedProductoName] = useState("")
  const [tipoproductos, setTipoProductos] = useState([]);
  const [selectedTipoProducto, setSelectedTipoProducto] = useState(null);
  const [selectedTipoProductoName, setSelectedTipoProductoName] = useState("")
  const [showTipoProductoOptions, setShowTipoProductoOptions] = useState(false);

  const [modalVisibleReverso, setModalVisibleReverso] = useState(false);
  const [selectedReverso, setSelectedReverso] = useState(null);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reiniciar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => document.getElementById("searchInput").select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ) : (
        text
      ),
  });

  useEffect(() => {
    fetchSucursales();
    fetchCategorias();
    fetchEmpresaInfo();
    fetchCategoriasCombos();
    fetchMeseros();
    fetchProductos();
    fetchTipoProductos();
  }, []);

  const fetchTipoProductos = () => {
    setLoading(true);
    fetch(API_URL +"/producto/listarproductos/")
      .then((response) => response.json())
      .then((data) => {
        setTipoProductos(data.tipos_productos);
      })
      .catch((error) => console.error("Error fetching tipo productos:", error))
      .finally(() => setLoading(false));
  };

  const fetchProductos = () => {
    setLoading(true);
    fetch(API_URL +"/producto/listar/")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data.productos);
      })
      .catch((error) => console.error("Error fetching productos:", error))
      .finally(() => setLoading(false));
  };

  const fetchCategorias = () => {
    setLoading(true);
    fetch(API_URL +"/producto/listar_categorias/")
      .then((response) => response.json())
      .then((data) => {
        setCategorias(data.categorias);
      })
      .catch((error) => console.error("Error fetching categorias:", error))
      .finally(() => setLoading(false));
  };

  const fetchCategoriasCombos = () => {
    setLoading(true);
    fetch(API_URL +"/combos/listcategoria/")
      .then((response) => response.json())
      .then((data) => {
        setCategoriasCombos(data.categorias_combos);
      })
      .catch((error) => console.error("Error fetching categorias de combos:", error))
      .finally(() => setLoading(false));
  };


  const fetchSucursales = () => {
    setLoading(true);
    fetch(API_URL +"/sucursal/sucusarleslist/")
      .then((response) => response.json())
      .then((data) => {
        setSucursales(data.sucursales);
      })
      .catch((error) => console.error("Error fetching sucursales:", error))
      .finally(() => setLoading(false));
  };

  const fetchMeseros = () => {
    setLoading(true);
    fetch(API_URL +"/Mesero/listar_meseros/")
      .then((response) => response.json())
      .then((data) => {
        setMeseros(data.meseros);
      })
      .catch((error) => console.error("Error fetching meseros:", error))
      .finally(() => setLoading(false));
  };

  const fetchEmpresaInfo = () => {
    setLoading(true);
    fetch(API_URL +"/empresa/infoEmpresa/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        // Almacenamos la información de la empresa en el estado
        if (data.empresa_info && data.empresa_info.elogo) {
          setLogoEmpresa(`data:image/png;base64,${data.empresa_info.elogo}`);
        }
        setEmpresaInfo(data.empresa_info);
      })
      .catch((error) => console.error("Error fetching empresa info:", error))
      .finally(() => setLoading(false));
  };

  const data = [
    { key: 1, reportName: "Reporte de empleados" },
    { key: 2, reportName: "Reporte de facturas emitidas" },
    { key: 3, reportName: "Reporte de clientes" },
    { key: 4, reportName: "Reporte de productos" },
    { key: 5, reportName: "Reporte de combos" },
    { key: 6, reportName: "Reporte de sucursales" },
    { key: 7, reportName: "Reporte de ventas" },
    { key: 8, reportName: "Reporte de pagos" },
    { key: 9, reportName: "Reporte de reverso" },
  ];

  const handleSucursal = () => {
    setSelectedReport("sucursal");
    GenerarReportePDF({
      empresaInfo: empresaInfo,
      logoEmpresa: logoEmpresa,
      sucursal: sucursales,
      selectedReport: "sucursal",
      handleShowViewer: handleShowViewer,
      setPdfBlob: setPdfBlob
    });
  };

  const handleGenerateReport = () => {
    console.log("Sucursal seleccionada:", selectedSucursal);
    let url;

    if (selectedTipoEmpleado === "todas" && selectedSucursal === "todas") {
      url = API_URL +"/empleado/listar-empleados-tipo/";
    } else if (selectedTipoEmpleado === "todas") {
      url = API_URL +`/empleado/listar-empleados-tipo/${selectedSucursal}/`;
    } else if (selectedSucursal === "todas") {
      url = API_URL +`/empleado/listar-empleados-tipo/todas/${selectedTipoEmpleado}/`;
    } else {
      url = API_URL +`/empleado/listar-empleados-tipo/${selectedSucursal}/${selectedTipoEmpleado}/`;
    }
    // Verificar si selectedTipoEmpleado es null antes de hacer la solicitud GET
    if (selectedTipoEmpleado !== null) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Empleados obtenidos:", data.empleados);
          setEmpleadosData(data.empleados); // Almacenamos los datos de empleados
          setModalVisible(false); // Cerrar el modal después de obtener los datos
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            fechaReporte: new Date().toLocaleDateString(),
            logoEmpresa: logoEmpresa,
            empleadosData: data.empleados,
            selectedSucursal: selectedSucursalName,
            selectedTipoEmpleado: selectedTipoEmpleadoName,
            selectedReport: "empleados",
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
        })
        .catch((error) =>
          console.error("Error al obtener los empleados:", error)
        );
    } else {
      // Aquí podrías mostrar un mensaje o realizar alguna acción en caso de que selectedTipoEmpleado sea null
      console.log("No se ha seleccionado un tipo de empleado");
    }
  };


  const handlePagos = () => {
    fetch(API_URL +"/pagos/ConsultarPagos/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de pagos:", data.pagos);
        GenerarReportePDF({
          empresaInfo: empresaInfo,
          logoEmpresa: logoEmpresa,
          selectedReport: "pagos",
          pagos: data.pagos,
          handleShowViewer: handleShowViewer,
          setPdfBlob: setPdfBlob
        });
      })
      .catch((error) =>
        console.error("Error al obtener las pagos", error)
      );
  };

  const handleGenerateFacturas = () => {
    fetch(API_URL +"/Mesero/validar_facturas/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de facturas emitidas:", data);
        setFacturasEmitidas(data.facturas_validadas);
        setSelectedReport("facturas");
        GenerarReportePDF({
          empresaInfo: empresaInfo,
          logoEmpresa: logoEmpresa,
          facturasEmitidas: data.facturas_validadas,
          selectedReport: "facturas",
          handleShowViewer: handleShowViewer,
          setPdfBlob: setPdfBlob
        });
      })
      .catch((error) =>
        console.error("Error al obtener las facturas emitidas:", error)
      );
  };

  const generateClientesReport = () => {
    setLoading(true);
    fetch(API_URL +"/cliente/ver_clientes/")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (Array.isArray(data.clientes)) {
          const clientes = data.clientes.sort((a, b) => {
            const nombreCompletoA = `${a.snombre || ''} ${a.capellido || ''}`.trim().toLowerCase();
            const nombreCompletoB = `${b.snombre || ''} ${b.capellido || ''}`.trim().toLowerCase();
            return nombreCompletoA.localeCompare(nombreCompletoB);
          });
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "clientes",
            clientes: clientes,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
        } else {
          console.error("Error: El campo clientes no es un array.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching clientes:", error);
      });
  };

  const HandleProductos = () => {
    console.log("Categoría seleccionada:", selectedOption);

    if (selectedOption != null) {
      let url;

      if (selectedOption === "todas") {
        url = API_URL +"/producto/listar-productos/";
      } else {
        url = API_URL +`/producto/listar-productos/categoria/${selectedOption}/`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Productos obtenidos:", data.productos);
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "productos",
            productos: data.productos,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
        })
        .catch((error) =>
          console.error("Error al obtener los productos:", error)
        );
    } else {
      console.log("No se ha seleccionado ninguna categoría");
    }
  };

  const HandleCombos = () => {
    console.log("Combo seleccionada:", selectedCombos);

    if (selectedCombos != null) {
      let url;

      if (selectedCombos === "todas") {
        url = API_URL +"/combos/ver_combost/";
      } else {
        url = API_URL +`/combos/ver_combosc/${selectedCombos}/`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Combos obtenidos:", data.combos);
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "combos",
            combos: data.combos,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
        })
        .catch((error) =>
          console.error("Error al obtener los combos:", error)
        );
    } else {
      console.log("No se ha seleccionado ninguna categoría");
    }
  }

  const handleVentas = () => {
    console.log("Tipo de Reporte Seleccionado:", selectedVenta);
    console.log("Mesero seleccionado:", selectedMesero);
    console.log("Sucursal seleccionada:", selectedSucursal);
    console.log("Tipo seleccionado:", selectedTipoProducto);

    if (dateRange && dateRange.length === 2) {
      let url;
      if (selectedVenta === "mesero") {
        if (selectedMesero === "todas") {
          url = API_URL +"/Mesero/listapedidospagados/";
        } else {
          url = API_URL +`/Mesero/listapedidospagado/${selectedMesero}/`;
        }
      } else if (selectedVenta === "sucursal") {
        if (selectedSucursal === "todas") {
          url = API_URL +"/Mesero/listapedidossucursal/";
        } else {
          url = API_URL +`/Mesero/listapedidossucursalid/${selectedSucursal}/`;
        }
      } else if (selectedVenta === "productos") {
        if (selectedProducto === "todas") {
          url = API_URL +"/Mesero/listapedidosproducto/";
        } else {
          url = API_URL +`/Mesero/listapedidosproductos/${selectedProducto}/`;
        }
      } else if (selectedVenta === "tipoproducto") {
        if (selectedTipoProducto === "todas") {
          url = API_URL +"/Mesero/listapedidostipoproducto/";
        } else {
          url = API_URL +`/Mesero/listapedidostipoproductos/${selectedTipoProducto}/`;
        }
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Datos de pedidos obtenidos:", data.pedidos);
          console.log("Rango fecha:", dateRange);
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "venta",
            selectedSucursal: selectedSucursalName,
            selectedMesero: selectedMeseroName,
            selectedProducto: selectedProductoName,
            selectedTipoProducto: selectedTipoProductoName,
            selectedVenta: selectedVenta,
            ventasmesero: data.pedidos,
            dateRange: dateRange,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
          setModalVisibleVentas(false);
        })
        .catch((error) => console.error("Error al obtener los datos de pedidos:", error));
    } else {
      console.error("Rango de fechas no válido:", dateRange);
    }
  };

  const handleReverso = () => {
    console.log("Reverso seleccionada:", selectedReverso);
    if (selectedReverso != null) {
      let url;
      if (selectedReverso === "todas") {
        url = API_URL +"/Mesero/lista_reverso_factura/";
      } else if (selectedReverso === "validas") {
        url = API_URL +`/Mesero/factura_v_report/`;
      } else {
        url = API_URL +`/Mesero/factura_n_report/`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Factura reverso obtenidos:", data.reverso);
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "reverso",
            reverso: data.reverso,
            dateRange: dateRange,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
        })
        .catch((error) =>
          console.error("Error al obtener los reversos:", error)
        );
    } else {
      console.log("No se ha seleccionado ningún reverso");
    }
  }

  const handleShowViewer = () => {
    setPdfViewerVisible(true);
  };

  return (
    <>
      <Table dataSource={data}>
        <Column
          title="Nombre del Reporte"
          dataIndex="reportName"
          key="reportName"
          {...getColumnSearchProps("reportName")}
        />
        <Column
          title="Acción"
          key="action"
          render={(text, record) => (
            <Button type="primary" onClick={() => {
              if (record.reportName === "Reporte de empleados") {
                setSelectedReport("empleados");
                setModalVisible(true);
              } else if (record.reportName === "Reporte de facturas emitidas") {
                setSelectedReport("facturas");
                handleGenerateFacturas();
              } else if (record.reportName === "Reporte de clientes") {
                setSelectedReport("clientes");
                generateClientesReport();
              } else if (record.reportName === "Reporte de productos") {
                setSelectedReport("productos");
                setModalVisibleProductos(true);
              } else if (record.reportName === "Reporte de combos") {
                setSelectedReport("combos");
                setModalVisibleCombos(true);
              } else if (record.reportName === "Reporte de sucursales") {
                setSelectedReport("sucursal");
                handleSucursal(true);
              } else if (record.reportName === "Reporte de ventas") {
                setSelectedReport("venta");
                setModalVisibleVentas(true);
              } else if (record.reportName === "Reporte de pagos") {
                setSelectedReport("pagos");
                handlePagos(true);
              } else if (record.reportName === "Reporte de reverso") {
                setSelectedReport("reverso");
                setModalVisibleReverso(true);
              }
            }}>
              GENERAR
            </Button>
          )}
        />
      </Table>

      <Modal
        title="Generar Reporte de Empleados"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "10px" }}>
            <p>Seleccione una sucursal:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione una sucursal"
              onChange={(value, option) => {
                setSelectedSucursal(value);
                setSelectedSucursalName(option.children);
              }}
              loading={loading}
            >
              <Option key="todas" value="todas">
                Todas las sucursales
              </Option>
              {sucursales.map((sucursal) => (
                <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                  {sucursal.snombre}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione un tipo de empleado:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione un tipo de empleado"
              onChange={(value, option) => {
                setSelectedTipoEmpleado(value);
                setSelectedTipoEmpleadoName(option.children);
              }}
            >
              <Option value="todas">Todos los tipos de empleados</Option>
              <Option value="jefe_cocina">Jefes de cocina</Option>
              <Option value="motorizado">Motorizados</Option>
              <Option value="mesero">Meseros</Option>
            </Select>
          </div>

          <div style={{ alignSelf: "flex-end" }}>
            <Button type="primary" onClick={handleGenerateReport}>
              Generar Reporte
            </Button>
          </div>
        </div>
      </Modal>
      {/* Nuevo modal para seleccionar todos los productos o categorías */}
      <Modal
        title="Seleccionar filtro"
        open={modalVisibleProductos}
        onCancel={() => setModalVisibleProductos(false)}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => setSelectedOption(value)}
          >
            <Option key="todas" value="todas">
              Todas los productos
            </Option>
            {categorias.map((categoria) => (
              <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.catnombre}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={HandleProductos}>
            Generar Reporte
          </Button>
        </div>
      </Modal>


      <Modal
        title="Seleccionar filtro"
        open={modalVisibleCombos}
        onCancel={() => setModalVisibleCombos(false)}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => setSelectedCombos(value)}
          >
            <Option key="todas" value="todas">
              Todas los combos
            </Option>
            {categoriasc.map((categorias_combos) => (
              <Option key={categorias_combos.id_catcombo} value={categorias_combos.id_catcombo}>
                {categorias_combos.catnombre}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={HandleCombos}>
            Generar Reporte
          </Button>
        </div>
      </Modal>


      <Modal
        title="Generar Reporte de Ventas"
        open={modalVisibleVentas}
        onCancel={() => setModalVisibleVentas(false)}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione un tipo de reporte:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione un tipo de reporte"
              onChange={(value, option) => {
                setSelectedVenta(value);
                setSelectedVentasName(option.children);
                setShowSucursalOptions(value === "sucursal");
                setShowMeseroOptions(value === "mesero");
                setShowProductoOptions(value === "productos");
                setShowTipoProductoOptions(value === "tipoproducto");
              }}
            >
              <Select.Option value="sucursal">Sucursal</Select.Option>
              <Select.Option value="mesero">Mesero</Select.Option>
              <Select.Option value="productos">Producto</Select.Option>
              <Select.Option value="tipoproducto">Tipo de producto</Select.Option>
            </Select>
          </div>

          {/* Opciones adicionales para "Mesero" */}
          {showMeseroOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione un mesero:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione un mesero"
                onChange={(value, option) => {
                  setSelectedMesero(value);
                  setSelectedMeseroName(option.children);
                }}
              >
                <Option key="todas" value="todas">
                  Todas los meseros
                </Option>
                {meseros.map((mesero) => (
                  <Option key={mesero.id_mesero} value={mesero.id_mesero}>
                    {mesero.nombre + ' ' + mesero.apellido}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showMeseroOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                disabledDate={(current) => current && current > moment().endOf('day')}
              />
            </div>
          )}

          {/* Opciones adicionales para "Sucursal" */}
          {showSucursalOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione una sucursal:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione una sucursal"
                onChange={(value, option) => {
                  setSelectedSucursal(value);
                  setSelectedSucursalName(option.children);
                }}
              >
                <Option key="todas" value="todas">
                  Todas las sucursales
                </Option>
                {sucursales.map((sucursal) => (
                  <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                    {sucursal.snombre}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showSucursalOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                disabledDate={(current) => current && current > moment().endOf('day')}
              />
            </div>
          )}

          {/* Opciones adicionales para "Producto" */}
          {showProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione un producto:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione un producto"
                onChange={(value, option) => {
                  setSelectedProducto(value);
                  setSelectedProductoName(option.children);
                }}
              >
                <Option key="todas" value="todas">
                  Todas los productos
                </Option>
                {productos.map((producto) => (
                  <Option key={producto.id_producto} value={producto.id_producto}>
                    {producto.nombreproducto}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                disabledDate={(current) => current && current > moment().endOf('day')}
              />
            </div>
          )}

          {/* Opciones adicionales para "Tipo producto" */}
          {showTipoProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione un tipo de producto:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione un tipo de producto"
                onChange={(value, option) => {
                  setSelectedTipoProducto(value);
                  setSelectedTipoProductoName(option.children);
                }}
              >
                <Option key="todas" value="todas">
                  Todos los tipos de producto
                </Option>
                {tipoproductos.map((tipoproducto) => (
                  <Option key={tipoproducto.id_tipoproducto} value={tipoproducto.id_tipoproducto}>
                    {tipoproducto.tpnombre}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showTipoProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                disabledDate={(current) => current && current > moment().endOf('day')}
              />
            </div>
          )}

          <div style={{ alignSelf: "flex-end" }}>
            <Button type="primary" onClick={handleVentas}>
              Generar Reporte
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Reporte de reverso"
        open={modalVisibleReverso}
        onCancel={() => setModalVisibleReverso(false)}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => setSelectedReverso(value)}
          >
            <Option value="todas">Todos los reversos de factura</Option>
            <Option value="validas">Facturas válidas</Option>
            <Option value="invalidas">Facturas no válidas</Option>
          </Select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione el rango de fechas:</p>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => setDateRange(dates)}
            disabledDate={(current) => current && current > moment().endOf('day')}
          />
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={handleReverso}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      {pdfViewerVisible && (
        <Modal
          title="Visor de PDF"
          open={pdfViewerVisible}
          onCancel={() => setPdfViewerVisible(false)}
          footer={null}
          style={{ minWidth: "800px", minHeight: "700px" }} // Personaliza el ancho y la altura del modal
        >
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              style={{ width: "100%", height: "600px" }}
              title="PDF Viewer"
            ></iframe>
          )}
        </Modal>
      )
      }
    </>
  );
};
export default ReportManagement;