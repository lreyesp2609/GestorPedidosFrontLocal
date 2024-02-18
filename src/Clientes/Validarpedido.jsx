import React , { useEffect, useState }from 'react';
import { Button, Space,Radio,Table, Tag,Tooltip, Modal, Select, Image  } from 'antd';
import {  Row,
  Col} from 'react-bootstrap';
const { Column, ColumnGroup } = Table;
const { Option } = Select;



const ValidarPedido =()=>{
    const [pedidos, setPedidos] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [selectedValue, setSelectedValue] = useState(null);
    const [filteredPagado, setFilteredPagado] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
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
      setFilteredPagado(true);

    };
  



    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);

    const handleTagClick = (estado, record) => {
      setModalVisible(true);
      setSelectedPedido(record);
    };
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [selectedPaymentState, setSelectedPaymentState] = useState(null);

  const handleTagClick2 = (estadoPago, recordPago) => {
    setSelectedRecord(recordPago);
    setSelectedPaymentState(estadoPago);
    setModalVisible(true);
  };
  const handleModalOk2 = async() => {
      try {
        if (!selectedRecord || selectedPaymentState === null || selectedPaymentState === undefined) {
          throw new Error('Error al cambiar estado del pago: Datos incompletos.');
        }
    
        const formData = new FormData();
        formData.append('estado_pago', selectedPaymentState);    
        // Realiza la solicitud POST
        const response = await fetch(`http://127.0.0.1:8000/cliente/actualizar_pago/${selectedRecord.id_pedido}/`, {
          method: 'POST',
          body: formData,
        });
    
        // Verifica si la solicitud fue exitosa
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    
        // Obtiene la respuesta JSON
        const responseData = await response.json();
    
        // Verifica si la respuesta indica éxito
        if (responseData.success) {
          // Actualiza el estado local de los pedidos si es necesario
          const updatedPedidos = pedidos.map((pedido) => {
            if (pedido.id_pedido === selectedRecord.id_pedido) {
              return {
                ...pedido,
                Pago: selectedPaymentState,
              };
            }
            return pedido;
          });
    
          setPedidos(updatedPedidos);
    
          // Cierra el modal y restablece los estados seleccionados
          setModalVisible(false);
          setSelectedRecord(null);
          setSelectedPaymentState(null);
    
          console.log('Pago actualizado con éxito.');
        } else {
          // Si la respuesta indica un error, imprime el mensaje de error
          throw new Error(responseData.message);
        }
      } catch (error) {
        console.error(error.message);
      }
      
  };
  const handleModalCancel2 = () => {
    // Cierra el modal y restablece los estados seleccionados
    setModalVisible(false);
    setSelectedRecord(null);
    setSelectedPaymentState(null);
  };

    const handleSelectChange = (value) => {
      setSelectedPedido((prevPedido) => ({
        ...prevPedido,
        estado_del_pedido: value,
      }));
    };
  
    const handleModalOk = async () => {
      try {
        if (selectedPedido.estado_del_pedido === null || selectedPedido.estado_del_pedido === undefined) {
          // Manejar el caso donde el estado_del_pedido es null o undefined
          throw new Error('El estado del pedido no está definido.');
        }
    
        const formData = new FormData();
        formData.append('estado_del_pedido', selectedPedido.estado_del_pedido);

    
        const response = await fetch(`http://127.0.0.1:8000/cliente/actualizar_pedido/${selectedPedido.id_pedido}/`, {
          method: 'POST',
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    
        // Actualiza el estado local de los pedidos si es necesario
        const updatedPedidos = [...pedidos];
        const index = updatedPedidos.findIndex((pedido) => pedido.id_pedido === selectedPedido.id_pedido);
        updatedPedidos[index].estado_del_pedido = selectedPedido.estado_del_pedido;
        setPedidos(updatedPedidos);
    
        setModalVisible(false);
        setSelectedPedido(null);
      } catch (error) {
        console.error('Error al cambiar estado del pedido:', error.message);
      }
    };
    
    
  
    const handleModalCancel = () => {
      setModalVisible(false);
    };

    
    const CambiarPago = (estadoPago, recordPago) => {
      Modal.info({
        title: 'Cambiar estado del pago',
        content: (
          <div>
            <span style={{ marginRight: '8px' }}>Estado del pago: {estadoPago}</span>
            <Select
              defaultValue={estadoPago}
              style={{ width: 120, marginTop: 16 }}
              onChange={(value) => handleSelectChangePago(value, recordPago)}
            >
              <Option value="Pagado">Pagado</Option>
              <Option value="En revisión">En revisión</Option>
              <Option value="Denegado">Denegado</Option>
            </Select>
            <Button onClick={() => CambiarEstado2(recordPago.id_pedido, value)} >Ok</Button>
          </div>
        ),
      });
    };
    const handleSelectChangePago = (value, recordPago) => {
      console.log('Cambiando estado del pago:', value);
      console.log('Registro asociado:', recordPago);

      recordPago.tagTextP = TextoTagPago(value);
      recordPago.tagColorP = ColorTagPago(value);
      setPedidos([...pedidos]);


    };
const CambiarEstado = (value, record) => {
  record.tagColor = ColorTag(value);
  record.tagText = TextoTag(value);

  
};
const ColorTag = (estado) => {
  switch (estado) {
    case 'O':
      return 'blue';
    case 'P':
      return 'purple';
    case 'C':
      return 'orange';

    default:
      return 'default';
  }
};



const TextoTag = (estado) => {
  switch (estado) {
    case 'O':
      return 'Ordenado';
    case 'P':
      return 'En proceso';
    case 'C':
      return 'En camino';
    default:
      return estado;
    }
  };

    const ColorTagPago = (estadoPago) => {
      switch (estadoPago) {
        case 'Pagado':
          return 'green';
        case 'En revisión':
          return 'orange';
        case 'Denegado':
          return 'red';
        default:
          return 'default';
      }
    };
    const TextoTagPago = (estadoPago) => {
      switch (estadoPago) {
        case 'Pagado':
          return 'Pagado';
        case 'En revisión':
          return 'En revisión';
        case 'Denegado':
          return 'Denegado';
        default:
          return estadoPago;
      }
    };
    
    const ColorTagMetodo = (metodoPago) => {
      switch (metodoPago) {
        case 'E':
          return 'green';
        case 'T':
          return 'cyan';
        case 'F':
          return 'geekblue';
        default:
          return 'default';
      }
    };
    const TextoTagMetodo = (metodoPago) => {
      switch (metodoPago) {
        case 'E':
          return 'Efectivo';
        case 'T':
          return 'Transferencia';
        case 'F':
          return 'Fraccionado';
        default:
          return metodoPago;
      }
    };

    const columns = [
      {
        title:'Nombre',
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
        render: (estado, record) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={`Cambiar estado del pedido`}>
              <Tag
                color={record.tagColor || ColorTag(estado)}
                onClick={() => handleTagClick(estado, record)}
                style={{ cursor: 'pointer' }}
              >
              {record.tagText || TextoTag(estado)}

              </Tag>
            </Tooltip>
          </div>
        ),
        filters: [
          {
            text: 'Ordenado',
            value: 'O',
          },
          {
            text: 'En camino',
            value: 'E',
          },
          {
            text: 'Entregado',
            value: 'D',
          },
        ],
        filteredValue: filteredInfo.estado_del_pedido || null,
        onFilter: (value, record) => record.estado_del_pedido.includes(value),
        sorter: (a, b) => a.estado_del_pedido.localeCompare(b.estado_del_pedido),
        sortOrder: sortedInfo.columnKey === 'estado_del_pedido' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'metodo de pago',
        dataIndex: 'metodo_de_pago',
        key: 'metodo_de_pago',
        render: (metodoPago, recordMetodo) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
       
              <Tag 
                color={recordMetodo.tagColorM || ColorTagMetodo(metodoPago)}
              >
                {recordMetodo.tagTextM || TextoTagMetodo(metodoPago)}
              </Tag>
          </div>
        ),
        filters: [
          {
            text: 'Efectivo',
            value: 'E',
          },
          {
            text: 'Transferencia',
            value: 'T',
          },
          {
            text: 'Fraccionado',
            value: 'F',
          },
        ],
        filteredValue: filteredInfo.metodo_de_pago || null,
        onFilter: (value, record) => record.metodo_de_pago.includes(value),
        sorter: (a, b) => a.metodo_de_pago.localeCompare(b.Pago),
        sortOrder: sortedInfo.columnKey === 'Pago' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Imagen',
        dataIndex: 'imagen',
        key: 'imagen',
        render: (imagen) => (
            imagen ? (
                <Image
                    src={`data:image/png;base64,${imagen}`}
                    alt="Imagen del pedido"
                    style={{ maxWidth: '50px', maxHeight: '50px' }}
                />
            ) : null
        ),
        ellipsis: true,
      },
      {
        title: 'Estado del pago',
        dataIndex: 'Pago',
        key: 'Pago',
        render: (estadoPago, recordPago) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={`Cambiar estado del pago`}>
              <Tag
                color={recordPago.tagColorP || ColorTagPago(estadoPago)}
                onClick={() => handleTagClick2(estadoPago, recordPago)}
                style={{ cursor: 'pointer' }}
              >
                {recordPago.tagTextP || TextoTagPago(estadoPago)}
              </Tag>
            </Tooltip>
          </div>
        ),
        filters: [
          {
            text: 'Pagado',
            value: 'Pagado',
          },
          {
            text: 'En revisión',
            value: 'En revisión',
          },
          {
            text: 'Denegado',
            value: 'Denegado',
          },
        ],
        filteredValue: filteredInfo.Pago || null,
        onFilter: (value, record) => record.Pago.includes(value),
        sorter: (a, b) => a.Pago.localeCompare(b.Pago),
        sortOrder: sortedInfo.columnKey === 'Pago' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Precio Total',
        dataIndex: 'Total',
        key: 'Total',
        sorter: (a, b) => a.precio_unitario - b.precio_unitario,
        sortOrder: sortedInfo.columnKey === 'Total' ? sortedInfo.order : null,
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
        <Modal
        title="Editar Estado del Pedido"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Select value={selectedPedido?.estado_del_pedido} onChange={handleSelectChange}>
          <Option value="O">Ordenado</Option>
          <Option value="P">En proceso</Option>
          <Option value="C">En camino</Option>
          <Option value="E">Pedido entregado</Option>
        </Select>
      </Modal>
      <Modal
        title="Cambiar Estado del Pago"
        visible={modalVisible}
        onOk={handleModalOk2}
        onCancel={handleModalCancel2}
      >
        <p>ID del pedido: {selectedRecord?.id_pedido}</p>
        <p>Selecciona el nuevo estado del pago:</p>
        <Select value={selectedPaymentState} onChange={(value) => setSelectedPaymentState(value)}>
          <Option value="Pagado">Pagado</Option>
          <Option value="En revisión">En revisión</Option>
          <Option value="Denegado">Denegado</Option>
        </Select>
      </Modal>
      </>
    )
    
}

export default ValidarPedido;