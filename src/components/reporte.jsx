import React, { useState, useEffect } from "react";
import { Input, Button, Table, Modal, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import GenerarReportePDF from "./generarReporte";

const { Column } = Table;
const { Option } = Select;

const ReportManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [selectedTipoEmpleado, setSelectedTipoEmpleado] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empleadosData, setEmpleadosData] = useState([]); // Estado para almacenar los datos de empleados
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [logoEmpresa, setLogoEmpresa] = useState(null);

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
    fetchEmpresaInfo();
  }, []);

  const fetchSucursales = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/sucursal/sucusarleslist/")
      .then((response) => response.json())
      .then((data) => {
        setSucursales(data.sucursales);
      })
      .catch((error) => console.error("Error fetching sucursales:", error))
      .finally(() => setLoading(false));
  };

  const fetchEmpresaInfo = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/empresa/infoEmpresa/", {
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

  const data = [{ key: 1, reportName: "Reporte de empleados" }];

  const handleGenerateReport = () => {
    console.log("Sucursal seleccionada:", selectedSucursal);
    let url;

    if (selectedTipoEmpleado === "todas" && selectedSucursal === "todas") {
      url = "http://127.0.0.1:8000/empleado/listar-empleados-tipo/";
    } else if (selectedTipoEmpleado === "todas") {
      url = `http://127.0.0.1:8000/empleado/listar-empleados-tipo/${selectedSucursal}/`;
    } else if (selectedSucursal === "todas") {
      url = `http://127.0.0.1:8000/empleado/listar-empleados-tipo/todas/${selectedTipoEmpleado}/`;
    } else {
      url = `http://127.0.0.1:8000/empleado/listar-empleados-tipo/${selectedSucursal}/${selectedTipoEmpleado}/`;
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
            <Button type="primary" onClick={() => setModalVisible(true)}>
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
        <>
          <p style={{ marginTop: "10px" }}>Seleccione una sucursal:</p>
          <Select
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Seleccione una sucursal"
            onChange={(value) => setSelectedSucursal(value)}
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

          <p>Seleccione un tipo de empleado:</p>
          <Select
            style={{ width: "100%", marginTop: "5px" }}
            placeholder="Seleccione un tipo de empleado"
            onChange={(value) => setSelectedTipoEmpleado(value)}
          >
            <Option value="todas">Todos los tipos de empleados</Option>
            <Option value="jefe_cocina">Jefes de cocina</Option>
            <Option value="motorizado">Motorizados</Option>
            <Option value="mesero">Meseros</Option>
          </Select>

          <Button type="primary" onClick={handleGenerateReport}>
            Generar Reporte
          </Button>
        </>
      </Modal>
    </>
  );
};

export default ReportManagement;
