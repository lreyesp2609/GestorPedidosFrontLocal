import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

import 'jspdf-autotable';
const GenerarReportePDF = ({ empresaInfo, logoEmpresa, empleadosData, selectedSucursal, selectedTipoEmpleado, selectedReport,
  facturasEmitidas, clientes, productos, combos, sucursal, ventasmesero, setPdfBlob, handleShowViewer, selectedVenta, dateRange,
  selectedMesero, selectedProducto, selectedTipoProducto }) => {
  console.log(dateRange);
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

    if (selectedReport === 'venta') {
      if (selectedVenta === 'mesero') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Meseros', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['CodCliente', 'Nombres', 'Fecha Pedido', 'Método de pago', 'Mesero', 'CodVenta', 'Precio',];
        const metodoPagoMap = {
          'E': 'Efectivo',
          'T': 'Transferencia',
          'F': 'Fraccionado',
        };

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas del empleado en el rango de fechas seleccionado.', 10, 48);
          } else {
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por el mesero "${selectedMesero}"`, 10, 48);
            const data = filteredData.map(venta => [
              venta.cliente.id_cliente,
              `${venta.cliente.snombre || ''} ${venta.cliente.capellido || ''}`,
              venta.fecha_pedido,
              metodoPagoMap[venta.metodo_de_pago],
              venta.nombre_mesero,
              venta.id_pedido,
              venta.precio,
            ]);

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 8, right: 8 },
            });
            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);

          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }

      if (selectedVenta === 'sucursal') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Sucursales', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['Cliente', 'Fecha Pedido', 'Método de pago', 'Mesero', 'Sucursal', 'CodVenta', 'Precio'];

        const metodoPagoMap = {
          'E': 'Efectivo',
          'T': 'Transferencia',
          'F': 'Fraccionado',
        };

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas de la sucursal en el rango de fechas seleccionado.', 10, 48);
          } else {
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por la sucursal "${selectedSucursal}"`, 10, 48);
            const data = filteredData.map(venta => [
              `${venta.cliente.snombre || ''} ${venta.cliente.capellido || ''}`,
              venta.fecha_pedido,
              metodoPagoMap[venta.metodo_de_pago],
              venta.mesero ? `${venta.mesero.nombre} ${venta.mesero.apellido}` : 'App',
              venta.nombre_sucursal,
              venta.id_pedido,
              venta.precio,
            ]);

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 8, right: 8 },
            });
            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);
          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }
      if (selectedVenta === 'productos') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Producto', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['CodVenta', 'Fecha Pedido', 'Detalle de Pedido', 'Empleado', 'Precio'];

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas del producto en el rango de fechas seleccionado.', 10, 48);
          } else {
            const data = [];
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por el producto "${selectedProducto}"`, 10, 48);
            filteredData.forEach(venta => {
              const detalle_pedido = venta.detalle_pedido.map(detalle => `${detalle.nombreproducto} (${detalle.cantidad})`).join('\n');
              data.push([
                venta.id_pedido,
                venta.fecha_pedido,
                detalle_pedido,
                venta.mesero ? `${venta.mesero.nombre} ${venta.mesero.apellido}` : 'App',
                venta.precio,
              ]);
            });

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 15, right: 15 },
            });

            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);
          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }
      if (selectedVenta === 'tipoproducto') {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text('Reporte de Ventas por Tipo de Producto', 10, 40);
        doc.setFont("helvetica");
        doc.setFontSize(10);

        const headers = ['CodVenta', 'Fecha Pedido', 'Tipo', 'Detalle de Pedido', 'Empleado', 'Precio'];

        if (dateRange && dateRange.length >= 2) {
          // Filtrar los datos por rango de fechas
          const filteredData = ventasmesero.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            // Ajustar la comparación para incluir el límite superior del rango
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });

          if (filteredData.length === 0) {
            doc.text('No hay ventas del tipo de producto en el rango de fechas seleccionado.', 10, 48);
          } else {
            const data = [];
            doc.setFontSize(10);
            doc.text(`Ventas filtradas por el tipo de producto "${selectedTipoProducto}"`, 10, 48);
            filteredData.forEach(venta => {
              const detalle_pedido = venta.detalle_pedido.map(detalle => `${detalle.nombreproducto} (${detalle.cantidad})`).join('\n');
              data.push([
                venta.id_pedido,
                venta.fecha_pedido,
                venta.nombretp,
                detalle_pedido,
                venta.mesero ? `${venta.mesero.nombre} ${venta.mesero.apellido}` : 'App',
                venta.precio,
              ]);
            });

            doc.autoTable({
              startY: 53,
              head: [headers],
              body: data,
              margin: { left: 8, right: 8 },
            });

            // Calcular la suma de los precios de las ventas
            const totalVenta = filteredData.reduce((total, venta) => total + parseFloat(venta.precio), 0);

            // Obtener el ancho del documento
            const docWidth = doc.internal.pageSize.width;

            // Obtener el ancho del texto
            const textWidth = doc.getStringUnitWidth(`Total de ventas: $ ${totalVenta.toFixed(2)}`) * doc.internal.getFontSize() / doc.internal.scaleFactor;

            // Colocar el texto a mano derecha
            doc.text(`Total de ventas: $${totalVenta.toFixed(2)}`, docWidth - textWidth - 10, doc.autoTable.previous.finalY + 10);
          }
        } else {
          console.error('dateRange no está definido o no tiene al menos dos elementos.');
        }
      }
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
    } else if (selectedReport === 'venta') {
      if (selectedVenta === 'mesero') {
        fileName = 'reporte_ventas_m.pdf';
      }
      if (selectedVenta === 'sucursal') {
        fileName = 'reporte_ventas_s.pdf';
      }
      if (selectedVenta === 'productos') {
        fileName = 'reporte_ventas_p.pdf';
      }
      if (selectedVenta === 'tipoproducto') {
        fileName = 'reporte_ventas_tp.pdf';
      }
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