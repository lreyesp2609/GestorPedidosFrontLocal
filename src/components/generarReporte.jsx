import React, { useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerarReportePDF = ({ empresaInfo, logoEmpresa, empleadosData }) => {
  // Función para generar el reporte PDF
  const generarReportePDF = () => {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Agregar información de la empresa al PDF
    doc.setFontSize(12);
    doc.text(`Nombre de la empresa: ${empresaInfo.enombre}`, 10, 10);
    doc.text(`Dirección: ${empresaInfo.direccion}`, 10, 20);
    doc.text(`Teléfono: ${empresaInfo.etelefono}`, 10, 30);

    // Agregar logo de la empresa al PDF si está disponible
    if (logoEmpresa) {
      const logo = new Image();
      logo.src = logoEmpresa;
      doc.addImage(logo, "PNG", 150, 5, 40, 40);
    }

    // Agregar título y encabezados de la tabla de empleados
    doc.text("Reporte de Empleados", 10, 50);
    const headers = [["Nombre", "Apellido", "Teléfono", "Ciudad", "Fecha"]];

    // Extraer datos de los empleados para la tabla
    const data = empleadosData.map((empleado) => [
      empleado.nombre,
      empleado.apellido,
      empleado.telefono,
      empleado.ciudad,
      empleado.fecha,
    ]);

    // Agregar la tabla de empleados al PDF
    doc.autoTable({
      startY: 60,
      head: headers,
      body: data,
    });

    // Obtener la fecha actual
    const fechaEmision = new Date().toLocaleDateString();

    // Agregar la fecha de emisión al PDF
    const fechaHoraEmision = new Date().toLocaleString();

    // Agregar la fecha y hora de emisión al PDF
    doc.text(
      `Fecha y hora de emisión: ${fechaHoraEmision}`,
      10,
      doc.autoTable.previous.finalY + 10
    );

    // Guardar el documento PDF
    doc.save("reporte_empleados.pdf");
  };

  // Llamamos a la función para generar el reporte PDF
  generarReportePDF();

  return null; // No necesitamos renderizar ningún elemento visible en el DOM
};

export default GenerarReportePDF;
