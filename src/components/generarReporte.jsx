import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const GenerarReportePDF = ({ empresaInfo, logoEmpresa, empleadosData, selectedSucursal, selectedTipoEmpleado, selectedReport,
  facturasEmitidas, clientes, productos, combos, sucursal, setPdfBlob, handleShowViewer }) => {

  const generarReportePDF = () => {
    const doc = new jsPDF();

    const topRectY = 0;
    const bottomRectY = doc.internal.pageSize.getHeight() - 20;
    const rectWidth = doc.internal.pageSize.getWidth();
    const rectHeight = 30;
    const rectHeighty = 20;

    doc.setFillColor(194, 18, 18);

    doc.rect(0, topRectY, rectWidth, rectHeight, 'F');
    doc.rect(0, bottomRectY, rectWidth, rectHeighty, 'F');

    if (logoEmpresa) {
      const logo = new Image();
      logo.src = logoEmpresa;
      const logoWidth = 30;
      const logoX = 5;
      const logoY = 0;
      doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoWidth);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.text(`${empresaInfo.enombre}`, 32, 12);
    doc.setFontSize(12);
    doc.text(`${empresaInfo.direccion}`, 32, 17);
    doc.setFontSize(11);
    doc.text(`${empresaInfo.etelefono}`, 32, 22);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    if (selectedReport === 'empleados') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Empleados', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);
      doc.text(`Datos filtrados por sucursal "${selectedSucursal}" y tipos de empleados "${selectedTipoEmpleado}"`, 10, 47);

      const headers = ['Nombre', 'Apellido', 'Teléfono', 'Ciudad', 'Fecha'];
      const data = empleadosData.map(empleado => [
        empleado.nombre,
        empleado.apellido,
        empleado.telefono,
        empleado.ciudad,
        empleado.fecha,
      ]);

      // Calcular el total de empleados
      const totalEmpleados = data.length;

      doc.autoTable({
        startY: 53,
        head: [headers],
        body: data,
        margin: { left: 20, right: 20 },
      });

      doc.setFont("helvetica", "bold");
      doc.text('Total de Empleados:', 20, doc.lastAutoTable.finalY + 10);
      doc.text(totalEmpleados.toString(), 60, doc.lastAutoTable.finalY + 10);
    }


    if (selectedReport === 'facturas') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Facturas Emitidas', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      const headers = ['Código', 'Cliente', 'Fecha Emisión', 'Mesero', 'Total', 'IVA', 'Descuento', 'Subtotal', 'Pagar'];
      const data = facturasEmitidas.map(factura => [
        factura.codigo_factura,
        factura.cliente_completo,
        factura.fecha_emision,
        factura.mesero_completo,
        factura.total,
        factura.iva,
        factura.descuento,
        factura.subtotal,
        factura.a_pagar,
      ]);
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 10, right: 10 },
      });
    }

    if (selectedReport === 'clientes') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Clientes', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombres', 'RUC/Cédula', 'Teléfono', 'Puntos', 'Registro'];

      // Transformar los datos de clientes en un array bidimensional para la tabla
      const data = clientes.map(cliente => [
        cliente.id_cliente,
        `${cliente.snombre || ''} ${cliente.capellido || ''}`,
        cliente.ruc_cedula,
        cliente.ctelefono,
        cliente.cpuntos,
        cliente.cregistro,
      ]);

      // Añadir la tabla de clientes al PDF
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 10, right: 10 },
      });
    }

    if (selectedReport === 'productos') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Productos', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);


      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombre', 'Categoría', 'Precio', 'Puntos'];

      // Transformar los datos de clientes en un array bidimensional para la tabla
      const data = productos.map(productos => [
        productos.id_producto,
        productos.nombreproducto,
        productos.catnombre,
        productos.preciounitario,
        productos.puntosp,
      ]);

      // Añadir la tabla de clientes al PDF
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 10, right: 10 },
      });
    }

    if (selectedReport === 'combos') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Combos', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);


      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombre', 'Categoría', 'Precio', 'Puntos'];

      // Transformar los datos de clientes en un array bidimensional para la tabla
      const data = combos.map(combos => [
        combos.id_combo,
        combos.nombrecb,
        combos.nombrecat,
        combos.preciounitario,
        combos.puntos,
      ]);
      // Añadir la tabla de clientes al PDF
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 10, right: 10 },
      });
    }

    if (selectedReport === 'sucursal') {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text('Reporte de Sucursales', 10, 40);
      doc.setFont("helvetica");
      doc.setFontSize(10);

      // Cabeceras para la tabla de clientes
      const headers = ['Código', 'Nombre', 'Apertura', 'Estado', 'Teléfono', 'Empleados'];

      // Transformar los datos de clientes en un array bidimensional para la tabla
      const data = sucursal.map(sucursal => [
        sucursal.id_sucursal,
        sucursal.snombre,
        sucursal.fsapertura,
        sucursal.sestado === '1' ? 'Activo' : 'No Activo',
        sucursal.sdireccion,
        sucursal.cantidadempleados,
      ]);

      // Calcular el total de empleados de todas las sucursales
      const totalEmpleados = data.reduce((total, current) => total + current[5], 0);

      // Añadir la tabla de clientes al PDF
      doc.autoTable({
        startY: 48,
        head: [headers],
        body: data,
        margin: { left: 18, right: 18 },
      });

      const finalY = doc.lastAutoTable.finalY || 48;

      doc.setFont("helvetica", "bold");
      doc.text('Total de empleados:', 150, finalY + 10); // Alineado a la derecha
      doc.text(totalEmpleados.toString(), 187, finalY + 10); // Alineado a la derecha
    }

    let fileName = '';
    if (selectedReport === 'empleados') {
      fileName = 'reporte_empleados.pdf';
    } else if (selectedReport === 'facturas') {
      fileName = 'reporte_facturas_emitidas.pdf';
    } else if (selectedReport === 'clientes') {
      fileName = 'reporte_clientes.pdf';
    } else if (selectedReport === 'productos') {
      fileName = 'reporte_productos.pdf';
    } else if (selectedReport === 'combos') {
      fileName = 'reporte_combos.pdf';
    } else if (selectedReport === 'sucursal') {
      fileName = 'reporte_sucursal.pdf';
    }

    const fechaHoraEmision = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const fontSize = 10;
    const fechaTextWidth = doc.getStringUnitWidth(`Fecha y hora de emisión: ${fechaHoraEmision}`) * fontSize / doc.internal.scaleFactor;
    const xPosition = pageWidth - fechaTextWidth - 10;
    const yPosition = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(fontSize);
    doc.setTextColor(255, 255, 255);
    doc.text(`Fecha y hora de emisión: ${fechaHoraEmision}`, xPosition, yPosition);


    doc.save(fileName);
    setPdfBlob(doc.output('blob'));
    handleShowViewer();
  };
  generarReportePDF();
  return null;
};
export default GenerarReportePDF;