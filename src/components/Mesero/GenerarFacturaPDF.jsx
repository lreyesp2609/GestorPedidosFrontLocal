import React from "react";
import { Button } from "antd";
import { jsPDF } from "jspdf";

const GenerarFacturaPDF = ({
  empresaInfo,
  logoEmpresa,
  facturaData,
  clienteData,
  productos,
  combos,
  obtenerTipoDePedido,
  obtenerMetodoDePago,
}) => {
  const generarFacturaPDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: [215, 150], // Ancho: 21.5 cm, Alto: 15 cm
    });

    // Definir diseño para el rollo de factura
    const designWidth = 210; // Ancho del diseño
    const designHeight = 297; // Alto del diseño
    const marginLeft = 10; // Margen izquierdo
    const marginTop = 10; // Margen superior

    // Función para agregar un nuevo elemento de factura al documento
    const agregarElementoFactura = (texto, x, y) => {
      doc.text(texto, x, y);
    };

    // Agregar logo y nombre de la empresa
    if (empresaInfo && empresaInfo.enombre && logoEmpresa) {
      const logoWidth = 30; // Ajusta este valor para cambiar el ancho del logo
      const logoHeight = 30; // Ajusta este valor para cambiar la altura del logo
      const logoX = 7; // Nueva coordenada X para el logo (ajusta según sea necesario)
      const logoY = marginTop + logoHeight / 2;
      doc.addImage(
        logoEmpresa,
        "JPEG",
        logoX,
        marginTop,
        logoWidth,
        logoHeight
      );

      // Establecer un tamaño de fuente más grande para el logo y el nombre de la empresa
      const fontSizeLogoEmpresa = 20; // Tamaño de fuente para el logo y el nombre de la empresa
      doc.setFontSize(fontSizeLogoEmpresa);

      // Dividir el nombre de la empresa en dos partes
      const nombreEmpresa = empresaInfo.enombre.split(" ");
      const nombreEmpresaParte1 = nombreEmpresa
        .slice(0, Math.ceil(nombreEmpresa.length / 2))
        .join(" ");
      const nombreEmpresaParte2 = nombreEmpresa
        .slice(Math.ceil(nombreEmpresa.length / 2))
        .join(" ");

      // Calcular la posición para centrar verticalmente las dos líneas
      const totalLineHeight = 12; // Altura total del texto en dos líneas
      const startY = logoY - totalLineHeight / 2;

      // Calcular la posición horizontal para centrar cada parte del nombre
      const nombreEmpresaParte1Width =
        (doc.getStringUnitWidth(nombreEmpresaParte1) * 16) /
        doc.internal.scaleFactor; // Ancho de la primera parte del nombre
      const nombreEmpresaParte2Width =
        (doc.getStringUnitWidth(nombreEmpresaParte2) * 16) /
        doc.internal.scaleFactor; // Ancho de la segunda parte del nombre
      const nombreEmpresaXParte1 =
        logoX + logoWidth + 20 - nombreEmpresaParte1Width / 2;
      const nombreEmpresaXParte2 =
        logoX + logoWidth + 20 - nombreEmpresaParte2Width / 2;

      doc.text(nombreEmpresaParte1, nombreEmpresaXParte1, startY);
      doc.text(
        nombreEmpresaParte2,
        nombreEmpresaXParte2,
        startY + totalLineHeight / 2
      );

      // Calcular el ancho y la altura del rectángulo
      const rectWidth =
        Math.max(nombreEmpresaParte1Width, nombreEmpresaParte2Width) + 45; // Reducir el margen añadido al ancho
      const rectHeight = totalLineHeight + logoHeight - 10; // Reducir el margen añadido a la altura

      // Agregar contorno cuadrado
      doc.rect(logoX, marginTop, rectWidth, rectHeight);

      // Restaurar el tamaño de fuente para el resto del documento
      doc.setFontSize(16); // Tamaño de fuente para el resto del documento
    }

    // Agregar dirección de la empresa
    if (empresaInfo && empresaInfo.direccion) {
      const direccion = empresaInfo.direccion;
      const lineasDireccion = direccion.split(/ y |(?=Quevedo)/); // Dividir la dirección en líneas por " y " o "Quevedo" (usando un lookahead)
      const direccionY = marginTop + 9; // Ajusta la posición vertical según sea necesario
      const fontSizeOriginal = doc.internal.getFontSize(); // Guardar el tamaño de fuente original
      const fontSizeDireccion = 10; // Tamaño de fuente para la dirección

      lineasDireccion.forEach((linea, index) => {
        const width =
          (doc.getStringUnitWidth(linea.trim()) * fontSizeDireccion) /
          doc.internal.scaleFactor;
        const nombreEmpresaParte2Width =
          (doc.getStringUnitWidth(lineasDireccion[1]) * 16) /
          doc.internal.scaleFactor; // Ancho de la segunda parte del nombre de la empresa
        const offset = 35; // Valor adicional para ajustar la posición hacia la derecha
        const x =
          (doc.internal.pageSize.getWidth() +
            nombreEmpresaParte2Width -
            width +
            offset) /
          2; // Calcular la posición horizontal centrada respecto a la segunda parte del nombre de la empresa, con un ajuste hacia la derecha
        const y = direccionY + index * 5; // Incrementar la posición vertical para cada línea
        doc.setFontSize(fontSizeDireccion); // Establecer el tamaño de fuente para la dirección
        agregarElementoFactura(linea.trim(), x, y); // Eliminar espacios en blanco al principio y al final de cada línea
      });

      doc.setFontSize(fontSizeOriginal); // Restaurar el tamaño de fuente original
    }

    // Agregar detalles de la factura
    let yPos = marginTop + 75;

    // Agregar fecha
    const fechaEmisionY = marginTop + 40; // Establecer la posición vertical para la fecha de emisión
    agregarElementoFactura(
      `Fecha: ${facturaData.fecha_emision}`,
      marginLeft,
      fechaEmisionY
    );

    // Agregar nombre del cliente
    const clienteY = marginTop + 50; // Establecer la posición vertical para el cliente
    agregarElementoFactura(
      `Cliente: ${clienteData.crazon_social}`,
      marginLeft,
      clienteY
    );

    // Agregar nombre de la direccion
    const direccionY = marginTop + 60; // Establecer la posición vertical para direccion
    agregarElementoFactura(
      `Direccion: ${clienteData.crazon_social}`,
      marginLeft,
      direccionY
    );

    // Agregar encabezados de la tabla
    const encabezadosTabla = [
      "Descripción",
      "Cantidad",
      "P.Unitario",
      "Descuento",
      "Valor",
    ];
    doc.setFontSize(8); // Tamaño de fuente más pequeño

    const encabezadosWidths = [60, 20, 20, 20, 20];

    yPos += -7; // Incrementar la posición vertical para las filas de detalles

    /// Calcular la posición inicial en X para centrar la tabla
    const tableWidth = encabezadosWidths.reduce((acc, width) => acc + width, 0);
    const startX = (doc.internal.pageSize.getWidth() - tableWidth) / 2;

    // Agregar encabezados de la tabla
    let currentX = startX;
    encabezadosTabla.forEach((encabezado, index) => {
      // Dibujar contorno
      doc.rect(currentX, yPos, encabezadosWidths[index], 5);

      // Agregar texto centrado en la celda
      const textWidth =
        (doc.getStringUnitWidth(encabezado) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textX = currentX + (encabezadosWidths[index] - textWidth) / 2;
      doc.text(encabezado, textX, yPos + 3);

      currentX += encabezadosWidths[index]; // Actualizar la posición X para la siguiente celda
    });

    yPos += 5; // Incrementar la posición vertical para las filas de detalles

    // Calcular la posición inicial en X para las filas de detalles
    const detallesStartX = (doc.internal.pageSize.getWidth() - tableWidth) / 2;

    // Agregar cada fila de productos/combos
    facturaData.detalles_factura.forEach((detalle) => {
      const producto = productos.find(
        (producto) => producto.id_producto === detalle.id_producto_id
      );
      const combo = combos.find(
        (combo) => combo.id_combo === detalle.id_combo_id
      );
      if (producto || combo) {
        const descripcion =
          producto?.nombreproducto ||
          combo?.nombrecb ||
          "Descripción no disponible";
        const cantidad = detalle.cantidad;
        const precioUnitario = detalle.precio_unitario;
        const descuento = detalle.descuento;
        const valor = detalle.valor;

        // Detalles en celdas
        const filaDetalles = [
          [descripcion, 60], // Descripción
          [cantidad, 20], // Cantidad
          [precioUnitario, 20], // P.Unitario
          [descuento, 20], // Descuento
          [valor, 20], // Valor
        ];

        // Calcular la posición de inicio de la fila
        let currentX = detallesStartX;
        const cellHeight = 5; // Altura de la celda

        // Agregar detalles como celdas y dibujar contorno
        filaDetalles.forEach(([detalle, width]) => {
          // Dibujar contorno
          doc.rect(currentX, yPos, width, cellHeight);

          // Agregar texto centrado
          const textWidth =
            (doc.getStringUnitWidth(detalle) * doc.internal.getFontSize()) /
            doc.internal.scaleFactor;
          const textX = currentX + (width - textWidth) / 2;
          doc.text(detalle, textX, yPos + 3);

          currentX += width; // Actualizar la posición X para la siguiente celda
        });

        yPos += cellHeight; // Incrementar la posición vertical para la siguiente fila
      }
    });

    // Agregar totales y detalles adicionales
    doc.setFontSize(10); // Restaurar el tamaño de fuente original
    agregarElementoFactura(`Total`, marginLeft + 5, yPos + 10);
    agregarElementoFactura(`${facturaData.total}`, marginLeft + 25, yPos + 10);

    agregarElementoFactura(`Descto`, marginLeft + 5, yPos + 20);
    agregarElementoFactura(
      `${facturaData.descuento}`,
      marginLeft + 25,
      yPos + 20
    );
    agregarElementoFactura(`Sub-Total`, marginLeft + 3, yPos + 30);
    agregarElementoFactura(
      `${facturaData.subtotal}`,
      marginLeft + 25,
      yPos + 30
    );
    agregarElementoFactura(`IVA 12%`, marginLeft + 5, yPos + 40);
    agregarElementoFactura(`${facturaData.iva}`, marginLeft + 25, yPos + 40);

    agregarElementoFactura(`A pagar`, marginLeft + 5, yPos + 50);
    agregarElementoFactura(
      `${facturaData.a_pagar}`,
      marginLeft + 25,
      yPos + 50
    );

    // Calcular el ancho y la altura del rectángulo
    const rectWidth =
      (Math.max(
        doc.getStringUnitWidth(`Total: ${facturaData.total}`),
        doc.getStringUnitWidth(`Descto: ${facturaData.descuento}`),
        doc.getStringUnitWidth(`Sub-Total: ${facturaData.subtotal}`),
        doc.getStringUnitWidth(`IVA 12%: ${facturaData.iva}`),
        doc.getStringUnitWidth(`A pagar: ${facturaData.a_pagar}`)
      ) *
        16) /
        doc.internal.scaleFactor +
      1; // El ancho del rectángulo será el ancho máximo del texto más un margen
    const rectHeight = yPos + 50 - (yPos + 4); // La altura del rectángulo será la altura total del texto

    // Agregar contorno cuadrado
    doc.rect(marginLeft, yPos + 5, rectWidth, rectHeight);

    // Calcular el tamaño de cada celda
    const cellHeight = rectHeight / 5; // El número 5 representa el número de celdas

    // Agregar líneas horizontales para dividir en celdas
    for (let i = 1; i < 5; i++) {
      doc.line(
        marginLeft,
        yPos + 5 + i * cellHeight,
        marginLeft + rectWidth,
        yPos + 5 + i * cellHeight
      );
    }

    // Agregar línea vertical para separar los nombres de los totales y los valores
    const separatorX = marginLeft + 20; // Ajusta este valor para mover la línea vertical
    doc.line(separatorX, yPos + 5, separatorX, yPos + 5 + rectHeight);

    // Agregar tipo de pedido y método de pago
    const labels = ["Tipo de Pedido", "Método de Pago"];
    const values = [
      obtenerTipoDePedido(facturaData.tipo_de_pedido),
      obtenerMetodoDePago(facturaData.metodo_de_pago),
    ];

    // Calcular el ancho y la altura del rectángulo
    const rectWidthTotales =
      (Math.max(
        doc.getStringUnitWidth(`${labels[0]}: ${values[0]}`),
        doc.getStringUnitWidth(`${labels[1]}: ${values[1]}`)
      ) *
        10) /
        doc.internal.scaleFactor +
      1; // El ancho del rectángulo será el ancho máximo del texto más un margen
    const rectHeightTotales = 20; // Altura del rectángulo

    // Agregar contorno cuadrado
    doc.rect(marginLeft, yPos + 65, rectWidthTotales, rectHeightTotales);

    // Calcular el tamaño de cada celda
    const cellHeightTotales = rectHeightTotales / 2; // El número 2 representa el número de celdas

    /*const separatorX2 = marginLeft + rectWidthTotales / 2; // La posición x del separador será el margen izquierdo más la mitad del ancho del rectángulo
    doc.line(
      separatorX2,
      yPos + 65,
      separatorX2,
      yPos + 65 + rectHeightTotales
    ); // Dibujar la línea desde el inicio hasta el final del rectángulo*/

    // Agregar texto para tipo de pedido y método de pago
    for (let i = 0; i < labels.length; i++) {
      const labelWidth =
        (doc.getStringUnitWidth(`${labels[i]}: ${values[i]}`) * 10) /
        doc.internal.scaleFactor; // Calcular el ancho del texto
      agregarElementoFactura(
        `${labels[i]}: ${values[i]}`,
        marginLeft + rectWidthTotales / 2 - labelWidth / 2,
        yPos + 70 + i * 10
      ); // Centrar el texto en la celda
    }

    // Agregar línea horizontal para dividir en celdas
    for (let i = 1; i < 2; i++) {
      doc.line(
        marginLeft,
        yPos + 65 + i * cellHeightTotales,
        marginLeft + rectWidthTotales,
        yPos + 65 + i * cellHeightTotales
      );
    }

    // Guardar el documento
    doc.save("factura.pdf");
  };

  return (
    <Button type="primary" onClick={generarFacturaPDF}>
      Generar Factura
    </Button>
  );
};

export default GenerarFacturaPDF;
