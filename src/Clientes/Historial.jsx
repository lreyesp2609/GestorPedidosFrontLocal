import React,  { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
const { Column, ColumnGroup } = Table;




const Historial =()=>{

    const [pedidos, setPedidos] = useState([]);
    const id_cuenta = localStorage.getItem('id_cuenta');
    useEffect(() => {
      const obtenerPedidos = async () => {
        try {
 
          const response = await fetch(`http://127.0.0.1:8000/cliente/obtener_pedido/${id_cuenta}/`);
          
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
  


return (
<div style={{marginLeft:'30px', marginRight:'50px'}}>
    <Table dataSource={pedidos} pagination={{ pageSize: 5 }}>
     <ColumnGroup title="Nombres">
        <Column title="Primer Nombre" dataIndex="nombre_usuario" key="nombre_usuario" />
        <Column title="Primer Apellido" dataIndex="apellido_usuario" key="nombre_usuario" />
      </ColumnGroup>
      <Column
        title="Estado del pedido"
        dataIndex="estado_del_pedido"
        key="estado_del_pedido"
        render={(estado) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tag color={estado === 'O' ? 'blue' : 'default'}>
              {estado === 'O' ? 'Ordenado' : estado}
            </Tag>
            </div>
        )}
      />
       <Column
        title="Estado del pago"
        dataIndex="Pago"
        key="Pago"
        render={(estado) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tag  color="blue">{estado}</Tag>
            </div>
        )}
      />
      <Column title="Total" dataIndex="Total" key="precio_unitario" />
      <Column title="Fecha de Pedido" dataIndex="fecha_pedido" key="fecha_pedido" />
    </Table>
    </div>
    );
}


export default Historial;