import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { Row, Col } from "react-bootstrap";
import { Tooltip, Avatar, Divider } from "antd";

const SRIAutorizacion = () => {
  const [visible, setVisible] = useState(false);
  const [codigoAutorizacion, setCodigoAutorizacion] = useState("");
  const [form] = Form.useForm(); // Agregar form aquí

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      // Verifica si el código de autorización tiene exactamente 49 dígitos
      if (codigoAutorizacion.length !== 49) {
        throw new Error("El código de autorización debe tener exactamente 49 dígitos");
      }
  
      const formData = new FormData();
      formData.append("codigo_autorizacion", codigoAutorizacion);
      formData.append("fecha_vencimiento", form.getFieldValue("fecha_vencimiento"));
      formData.append("fecha_autorizacion", form.getFieldValue("fecha_autorizacion"));
  
      const response = await fetch(
        `http://127.0.0.1:8000/CodigoFactura/crear_codigoautorizacion/1/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
        setVisible(false);
        message.success("Código de autorización creado exitosamente");
      } else {
        throw new Error("Error al crear el código de autorización");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message || "Hubo un error al crear el código de autorización");
    }
  };
  

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChangeCodigoAutorizacion = (e) => {
    const value = e.target.value;
    if (value.length <= 49) {
      setCodigoAutorizacion(value);
    }
  };

  return (
    <div>
      <Col md={12}>
        <Button
          type="primary"
          style={{ width: "100%", margin: "2%" }}
          onClick={showModal}
        >
          Crear Código de Autorización
        </Button>
      </Col>
      <Modal
        title="Crear Código de Autorización"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item
            label="Código de Autorización"
            name="codigo_autorizacion"
            rules={[
              { required: true, message: "Por favor ingresa el código de autorización" },
              { pattern: /^\d*$/, message: "Por favor ingresa solo números" },
              { max: 49, message: "El código de autorización debe tener 49 dígitos" }
            ]}
          >
            <Input value={codigoAutorizacion} onChange={handleChangeCodigoAutorizacion} />
          </Form.Item>
          <Form.Item label="Fecha de Vencimiento" name="fecha_vencimiento">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Fecha de Autorización" name="fecha_autorizacion">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SRIAutorizacion;