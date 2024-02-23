import { jsPDF } from "jspdf";

const GenerarFacturaPDF = ({
  empresaInfo,
  logoEmpresa,
  clienteData,
  facturaData,
  productos,
  combos,
  obtenerTipoDePedido,
  obtenerMetodoDePago,
}) => {
  const generarPDF = () => {
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
        const offset = 38; // Valor adicional para ajustar la posición hacia la derecha
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

      doc.setFontSize(10); // Establecer el tamaño de fuente

      // Agregar texto "Contribuyente Negocio Popular" en una línea
      const textoContribuyente1 = "Contribuyente Negocio";
      const textoContribuyente1Width =
        (doc.getStringUnitWidth(textoContribuyente1) * fontSizeOriginal) /
        doc.internal.scaleFactor;
      const contribuyenteX1 =
        (doc.internal.pageSize.getWidth() - textoContribuyente1Width) / 2 + 55; // Ajustar la posición hacia la derecha
      const contribuyenteY1 = direccionY + (lineasDireccion.length + 1) * 4; // Colocar el texto debajo de la dirección
      agregarElementoFactura(
        textoContribuyente1,
        contribuyenteX1,
        contribuyenteY1
      );

      // Agregar texto "Régimen RIMPE" en una línea
      const textoContribuyente2 = " Popular Régimen RIMPE";
      const textoContribuyente2Width =
        (doc.getStringUnitWidth(textoContribuyente2) * fontSizeOriginal) /
        doc.internal.scaleFactor;
      const contribuyenteX2 =
        (doc.internal.pageSize.getWidth() - textoContribuyente2Width) / 2 + 56; // Ajustar la posición hacia la derecha
      const contribuyenteY2 = contribuyenteY1 + 5; // Ajustar la posición vertical
      agregarElementoFactura(
        textoContribuyente2,
        contribuyenteX2,
        contribuyenteY2
      );

      // No es necesario restablecer el tamaño de fuente aquí
    }

    // Agregar detalles de la factura
    let yPos = marginTop + 75;
    doc.setFontSize(10); // Tamaño de fuente más pequeño
    // Agregar fecha
    // Obtener el código de factura
    const codigoFactura = facturaData.codigo_factura;

    // Dividir el código de factura en partes
    const primeraParte = codigoFactura.substring(0, 3);
    const segundaParte = codigoFactura.substring(3, 6);
    const terceraParte = codigoFactura.substring(6);

    // Crear el código de factura con guiones
    const codigoFacturaFormateado = `${primeraParte}-${segundaParte}-${terceraParte}`;

    // Calcular la posición horizontal para "Aut. S.R.I #"
    const textoNotaVenta = `Nota de Venta: ${codigoFacturaFormateado}`;
    const textoNotaVentaWidth =
      (doc.getStringUnitWidth(textoNotaVenta) * 10) / doc.internal.scaleFactor;
    const codigoAutorizacionX = marginLeft + textoNotaVentaWidth + 20; // Ajusta el espacio entre "Nota de Venta" y "Aut. S.R.I #"

    // Agregar nota de venta
    const notaVentaY = marginTop + 40; // Establecer la posición vertical para la nota de venta
    agregarElementoFactura(textoNotaVenta, marginLeft, notaVentaY);

    // Agregar Aut. S.R.I #
    agregarElementoFactura(
      `Aut. S.R.I # ${facturaData.codigo_autorizacion_sri}`,
      codigoAutorizacionX,
      notaVentaY
    );

    // Agregar fecha
    const fechaEmisionY = marginTop + 45; // Establecer la posición vertical para la fecha de emisión
    agregarElementoFactura(
      `Fecha: ${facturaData.fecha_emision}`,
      marginLeft,
      fechaEmisionY
    );

    // Agregar nombre del cliente
    const clienteY = marginTop + 50; // Establecer la posición vertical para el cliente
    agregarElementoFactura(
      `Cliente: ${clienteData.razon_social}`,
      marginLeft,
      clienteY
    );

    // Agregar nombre de la direccion
    const direccionY = marginTop + 55; // Establecer la posición vertical para direccion
    agregarElementoFactura(
      `Direccion: ${clienteData.razon_social}`,
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
    const marginRight = 5; // Margen derecho

    // Calcular la posición horizontal para los totales y detalles adicionales
    const marginRightAdjusted = doc.internal.pageSize.getWidth() - marginRight;

    agregarElementoFactura(`Total`, marginRightAdjusted - 36, yPos + 10);
    agregarElementoFactura(
      `${facturaData.total}`,
      marginRightAdjusted - 15,
      yPos + 10
    );

    agregarElementoFactura(`Descto`, marginRightAdjusted - 37, yPos + 20);
    agregarElementoFactura(
      `${facturaData.descuento}`,
      marginRightAdjusted - 15,
      yPos + 20
    );

    agregarElementoFactura(`Sub-Total`, marginRightAdjusted - 39, yPos + 30);
    agregarElementoFactura(
      `${facturaData.subtotal}`,
      marginRightAdjusted - 15,
      yPos + 30
    );

    agregarElementoFactura(`IVA 12%`, marginRightAdjusted - 38, yPos + 40);
    agregarElementoFactura(
      `${facturaData.iva}`,
      marginRightAdjusted - 15,
      yPos + 40
    );

    agregarElementoFactura(`A pagar`, marginRightAdjusted - 38, yPos + 50);
    agregarElementoFactura(
      `${facturaData.a_pagar}`,
      marginRightAdjusted - 15,
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

    // Calcular la posición horizontal del rectángulo
    const rectX = marginRightAdjusted - rectWidth;

    // Agregar contorno cuadrado
    doc.rect(rectX, yPos + 5, rectWidth, rectHeight);

    // Calcular el tamaño de cada celda
    const cellHeight = rectHeight / 5; // El número 5 representa el número de celdas

    // Agregar líneas horizontales para dividir en celdas
    for (let i = 1; i < 5; i++) {
      doc.line(
        rectX,
        yPos + 5 + i * cellHeight,
        rectX + rectWidth,
        yPos + 5 + i * cellHeight
      );
    }

    // Agregar línea vertical para separar los nombres de los totales y los valores
    const separatorX = rectX + 20; // Ajusta este valor para mover la línea vertical
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

    // Definir la posición horizontal ajustada para el rectángulo de "Tipo de Pedido" y "Método de Pago"
    const marginLeftTotales =
      doc.internal.pageSize.getWidth() - rectWidthTotales - 10; // Ajuste la posición horizontal según sea necesario

    // Agregar contorno cuadrado
    doc.rect(marginLeftTotales, yPos + 65, rectWidthTotales, rectHeightTotales);

    // Calcular el tamaño de cada celda
    const cellHeightTotales = rectHeightTotales / 2; // El número 2 representa el número de celdas

    // Agregar texto para tipo de pedido y método de pago
    for (let i = 0; i < labels.length; i++) {
      const labelWidth =
        (doc.getStringUnitWidth(`${labels[i]}: ${values[i]}`) * 10) /
        doc.internal.scaleFactor; // Calcular el ancho del texto
      agregarElementoFactura(
        `${labels[i]}: ${values[i]}`,
        marginLeftTotales + rectWidthTotales / 2 - labelWidth / 2,
        yPos + 70 + i * 10
      ); // Centrar el texto en la celda
    }

    // Agregar línea horizontal para dividir en celdas
    for (let i = 1; i < 2; i++) {
      doc.line(
        marginLeftTotales,
        yPos + 65 + i * cellHeightTotales,
        marginLeftTotales + rectWidthTotales,
        yPos + 65 + i * cellHeightTotales
      );
    }

    /// Agregar firma cliente
    const firmaClienteX = marginLeft + 20; // Posición X para la firma autorizada
    const firmaClienteY = yPos + 20; // Posición Y para la firma autorizada
    const firmaClienteWidth = 80; // Ancho del área de la firma autorizada

    // Ancho deseado para la línea
    const lineaWidth2 = 35;

    // Calcular la posición X de la línea para que esté centrada con el texto
    const textoFirmaCliente = "Firma Cliente";
    const textofirmaClienteWidth =
      (doc.getStringUnitWidth(textoFirmaCliente) * 12) /
      doc.internal.scaleFactor; // Calcular el ancho del texto
    const lineaX3 =
      firmaClienteX +
      (firmaClienteWidth - textofirmaClienteWidth - lineaWidth2) +
      0.5; // Alinear la línea con el texto
    const lineaX4 = lineaX3 + lineaWidth2;

    // Agregar línea para firmar
    doc.line(lineaX3, firmaClienteY + 5, lineaX4, firmaClienteY + 5);

    // Agregar texto para la firma autorizada
    const textofirmaClienteX =
      firmaClienteX + firmaClienteWidth / 2 - textofirmaClienteWidth / 2;
    const textofirmaClienteY = firmaClienteY + 10; // Ajustar verticalmente el texto
    doc.text(textoFirmaCliente, textofirmaClienteX, textofirmaClienteY);

    // Agregar firma autorizada
    const firmaAutorizadaX = marginLeft - 20; // Posición X para la firma autorizada
    const firmaAutorizadaY = yPos + 20; // Posición Y para la firma autorizada
    const firmaAutorizadaWidth = 80; // Ancho del área de la firma autorizada

    // Ancho deseado para la línea
    const lineaWidth = 35;

    // Calcular la posición X de la línea para que esté centrada con el texto
    const textoFirmaAutorizada = "Firma Autorizada";
    const textoFirmaAutorizadaWidth =
      (doc.getStringUnitWidth(textoFirmaAutorizada) * 12) /
      doc.internal.scaleFactor; // Calcular el ancho del texto
    const lineaX1 =
      firmaAutorizadaX +
      (firmaAutorizadaWidth - textoFirmaAutorizadaWidth - lineaWidth) +
      7; // Alinear la línea con el texto
    const lineaX2 = lineaX1 + lineaWidth;

    // Agregar línea para firmar
    doc.line(lineaX1, firmaAutorizadaY + 5, lineaX2, firmaAutorizadaY + 5);

    // Agregar texto para la firma autorizada
    const textoFirmaAutorizadaX =
      firmaAutorizadaX +
      firmaAutorizadaWidth / 2 -
      textoFirmaAutorizadaWidth / 2;
    const textoFirmaAutorizadaY = firmaAutorizadaY + 10; // Ajustar verticalmente el texto
    doc.text(
      textoFirmaAutorizada,
      textoFirmaAutorizadaX,
      textoFirmaAutorizadaY
    );

    doc.setFontSize(8);
    // Agregar pie de página con autorización
    const autorizacionText = `Fecha Autorización: ${facturaData.autorizacion}\nNumeración: ${facturaData.numeracion}`;
    // Calcular la posición horizontal para el pie de página con autorización
    const marginLeftFooter = 10; // Margen izquierdo para el pie de página
    const autorizacionTextWidth =
      (doc.getStringUnitWidth(autorizacionText) * 10) /
      doc.internal.scaleFactor;
    const autorizacionX = marginLeftFooter; // Comenzar desde el margen izquierdo
    const autorizacionY = doc.internal.pageSize.getHeight() - 10; // Ajusta la posición vertical según sea necesario
    doc.text(autorizacionText, autorizacionX, autorizacionY);

    // Calcular el ancho del texto de vencimiento
    const vencimientoText = `Vencimiento: ${facturaData.vencimiento}`;
    const vencimientoTextWidth =
      (doc.getStringUnitWidth(vencimientoText) * 8) / doc.internal.scaleFactor; // Usar un tamaño de fuente de 8 para el texto de vencimiento

    // Calcular la posición horizontal para el texto de vencimiento
    const marginRightFooter = 10; // Margen derecho para el pie de página
    const vencimientoX =
      doc.internal.pageSize.getWidth() -
      marginRightFooter -
      vencimientoTextWidth;

    // Agregar el texto de vencimiento al documento
    doc.text(vencimientoText, vencimientoX, autorizacionY); // Utiliza la misma posición vertical que la autorización

    // Guardar el documento
    doc.save("factura.pdf");
  };

  // Llamar a la función de generación de PDF al renderizar este componente
  generarPDF();

  return null; // No renderiza ningún contenido en la interfaz
};

export default GenerarFacturaPDF;
