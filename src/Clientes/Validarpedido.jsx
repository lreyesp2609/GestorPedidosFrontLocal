import React , { useEffect, useState }from 'react';
import { Button, Space, Table, Tag } from 'antd';
const { Column, ColumnGroup } = Table;


const ValidarPedido =()=>{
    const [pedidos, setPedidos] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
  
    const id_cuenta = localStorage.getItem('id_cuenta');
    useEffect(() => {
      const obtenerPedidos = async () => {
        try {
 
          const response = await fetch(`http://127.0.0.1:8000/cliente/obtener_pedido2/`);
          
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
          }
  
          const data = await response.json();
          setPedidos(data.Pedidos);
        } catch (error) {
          console.error('Error al obtener pedidos:', error.message);
        }
      };
  
      obtenerPedidos();
    }, []); 
    const handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
      setFilteredInfo(filters);
      setSortedInfo(sorter);
    };
  
    const clearFilters = () => {
      setFilteredInfo({});
    };
  
    const clearAll = () => {
      setFilteredInfo({});
      setSortedInfo({});
    };
  
    const setAgeSort = () => {
      setSortedInfo({
        order: 'ascend',
        columnKey: 'nombre_usuario',
      });
    };
  
    const columns = [
      {
        title: 'Nombre',
      dataIndex: 'nombre_usuario',
      key: 'nombre_usuario',
      sorter: (a, b) => {
        const aName = a.nombre_usuario || ''; // Si a.nombre_usuario es null, asigna un string vacío
        const bName = b.nombre_usuario || ''; // Si b.nombre_usuario es null, asigna un string vacío
        return aName.localeCompare(bName);
      },
      sortOrder: sortedInfo.columnKey === 'nombre_usuario' ? sortedInfo.order : null,
      ellipsis: true,
      },
      {
        title: 'Estado del pedido',
        dataIndex: 'estado_del_pedido',
        key: 'estado_del_pedido',
        render: (estado) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tag color={estado === 'O' ? 'blue' : 'default'}>
              {estado === 'O' ? 'Ordenado' : estado}
            </Tag>
          </div>
        ),
        filters: [
          {
            text: 'Ordenado',
            value: 'Ordenado',
          },
          {
            text: 'Otro Estado',
            value: 'Otro Estado',
          },
        ],
        filteredValue: filteredInfo.estado_del_pedido || null,
        onFilter: (value, record) => record.estado_del_pedido.includes(value),
        sorter: (a, b) => a.estado_del_pedido.localeCompare(b.estado_del_pedido),
        sortOrder: sortedInfo.columnKey === 'estado_del_pedido' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Precio Total',
        dataIndex: 'precio_unitario',
        key: 'precio_unitario',
        sorter: (a, b) => a.precio_unitario - b.precio_unitario,
        sortOrder: sortedInfo.columnKey === 'precio_unitario' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Fecha de Pedido',
        dataIndex: 'fecha_pedido',
        key: 'fecha_pedido',
        sorter: (a, b) => new Date(a.fecha_pedido) - new Date(b.fecha_pedido),
        sortOrder: sortedInfo.columnKey === 'fecha_pedido' ? sortedInfo.order : null,
        ellipsis: true,
      },
    ];
  
    return (
      <>
        <Space
          style={{
            marginBottom: 16,
          }}
        >
          <Button onClick={setAgeSort}>Sort age</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
          <Button onClick={clearAll}>Clear filters and sorters</Button>
        </Space>
        <Table columns={columns} dataSource={pedidos} onChange={handleChange} pagination={{ pageSize: 5 }}/>
      </>
    )
}

export default ValidarPedido;