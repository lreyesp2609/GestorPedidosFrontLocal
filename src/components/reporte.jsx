import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Modal, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';

const { Column } = Table;
const { Option } = Select;

const ReportManagement = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [selectedTipoEmpleado, setSelectedTipoEmpleado] = useState(null);
    const [sucursales, setSucursales] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
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
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reiniciar
                </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => document.getElementById('searchInput').select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <span style={{ fontWeight: 'bold' }}>{text}</span>
            ) : (
                text
            ),
    });

    const handleGenerateReport = () => {
        console.log('Sucursal seleccionada:', selectedSucursal);
        let url;
        if (selectedTipoEmpleado === null && selectedSucursal === 'todas') {
            url = 'http://127.0.0.1:8000/empleado/listar-empleados-tipo/';
        } else if (selectedTipoEmpleado === null) {
            url = `http://127.0.0.1:8000/empleado/listar-empleados-tipo/${selectedSucursal}/`;
        } else {
            url = `http://127.0.0.1:8000/empleado/listar-empleados-tipo/${selectedSucursal}/${selectedTipoEmpleado}/`;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Empleados obtenidos:', data.empleados);
    
                const doc = new jsPDF();
    
                doc.setFontSize(16);
                doc.text('Reporte de Empleados', 15, 15);
    
                let y = 20;
                if (Array.isArray(data.empleados)) {
                    data.empleados.forEach(empleado => {
                        doc.setFontSize(12);
                        doc.text(`${empleado.nombre}  ${empleado.apellido} ${empleado.telefono} ${empleado.fecha}`, 20, y += 13);
                    });
                } else {
                    console.error('Los datos de empleados no son un array.');
                }
    
                doc.save('reporte_empleados.pdf');
                console.log(jsPDF);
            })
            .catch(error => console.error('Error al obtener los empleados:', error));
            
        setModalVisible(false);
    };
    

    useEffect(() => {
        fetchSucursales();
    }, []);

    const fetchSucursales = () => {
        setLoading(true);
        fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/')
            .then(response => response.json())
            .then(data => {
                setSucursales(data.sucursales);
            })
            .catch(error => console.error('Error fetching sucursales:', error))
            .finally(() => setLoading(false));
    };

    const data = [
        { key: 1, reportName: 'Reporte de empleados' },
    ];

    return (
        <>
            <Table dataSource={data}>
                <Column
                    title="Nombre del Reporte"
                    dataIndex="reportName"
                    key="reportName"
                    {...getColumnSearchProps('reportName')}
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
                visible={modalVisible}
                onOk={handleGenerateReport}
                onCancel={() => setModalVisible(false)}
            >
                <>
                    <p style={{ marginTop: '10px' }}>Seleccione una sucursal:</p>
                    <Select
                        style={{ width: '100%', marginBottom: '10px' }}
                        placeholder="Seleccione una sucursal"
                        onChange={value => setSelectedSucursal(value)}
                        loading={loading}
                    >
                        <Option key="todas" value="todas">
                            Todas las sucursales
                        </Option>
                        {sucursales.map(sucursal => (
                            <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                {sucursal.snombre}
                            </Option>
                        ))}
                    </Select>

                    <p>Seleccione un tipo de empleado:</p>
                    <Select
                        style={{ width: '100%', marginTop: '5px' }}
                        placeholder="Seleccione un tipo de empleado"
                        onChange={value => setSelectedTipoEmpleado(value)}
                    >
                        <Option value={null}>Todos los tipos de empleados</Option>
                        <Option value="jefe_cocina">Jefes de cocina</Option>
                        <Option value="motorizado">Motorizados</Option>
                        <Option value="mesero">Meseros</Option>
                    </Select>
                </>

            </Modal>
        </>
    );
};

export default ReportManagement;
