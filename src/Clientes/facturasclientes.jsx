import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  DatePicker,
  Select,
  Space,
  Modal,
  Button,
  message,
} from "antd";

const { Option } = Select;

const HistorialPedidos = () => {
  const id_cuenta = localStorage.getItem("id_cuenta");

  const ObtenerUsuario = async () => {
    if (id_cuenta) {
      fetch(`http://127.0.0.1:8000/Login/obtener_usuario/${id_cuenta}/`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.usuario);

          setLocationData({
            latitud1: data.usuario?.ubicacion1?.latitud || 0,
            longitud1: data.usuario?.ubicacion1?.longitud || 0,
            latitud2: data.usuario?.ubicacion2?.latitud || 0,
            longitud2: data.usuario?.ubicacion2?.longitud || 0,
            latitud3: data.usuario?.ubicacion3?.latitud || 0,
            longitud3: data.usuario?.ubicacion3?.longitud || 0,
          });
        })
        .catch((error) =>
          console.error("Error al obtener datos del usuario:", error)
        );
    } else {
      console.error("Nombre de usuario no encontrado en localStorage");
    }
  };
  useEffect(() => {
    ObtenerUsuario();
  }, []);
};

export default HistorialPedidos;
