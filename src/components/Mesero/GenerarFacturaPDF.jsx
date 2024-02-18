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

    // Función para agregar un nuevo elemento de factura con formato específico
    const agregarElementoConFormato = (texto, x, y, maxWidth) => {
      const splitText = doc.splitTextToSize(texto, maxWidth);
      doc.text(splitText, x, y);
    };

    // Función para agregar un divisor
    const agregarDivisor = (y) => {
      doc.setLineWidth(0.5);
      doc.line(marginLeft, y, designWidth - marginLeft, y);
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

    const detalles = [
      { texto: "Descripción", ancho: 60 },
      { texto: "Cantidad", ancho: 20 },
      { texto: "P.Unitario", ancho: 20 },
      { texto: "Descuento", ancho: 20 },
      { texto: "Valor", ancho: 20 },
    ];

    detalles.forEach((detalle, index) => {
      const x =
        marginLeft +
        detalles.slice(0, index).reduce((acc, item) => acc + item.ancho, 0);
      // Reducir el tamaño de fuente para los detalles
      doc.setFontSize(8); // Tamaño de fuente más pequeño
      agregarElementoConFormato(detalle.texto, x, yPos, detalle.ancho);
    });

    yPos += 10;

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
        const fila = [descripcion, cantidad, precioUnitario, descuento, valor];
        fila.forEach((item, index) => {
          const x =
            marginLeft +
            detalles.slice(0, index).reduce((acc, item) => acc + item.ancho, 0);
          agregarElementoConFormato(
            item.toString(),
            x,
            yPos,
            detalles[index].ancho
          );
        });
        yPos += 10;
      }
    });

    // Agregar totales y detalles adicionales
    doc.setFontSize(16); // Restaurar el tamaño de fuente original
    agregarElementoFactura(`Total`, marginLeft, yPos + 10);
    agregarElementoFactura(`${facturaData.total}`, marginLeft + 80, yPos + 10);
    agregarElementoFactura(`Descto`, marginLeft, yPos + 20);
    agregarElementoFactura(
      `${facturaData.descuento}`,
      marginLeft + 80,
      yPos + 20
    );
    agregarElementoFactura(`Sub-Total`, marginLeft, yPos + 30);
    agregarElementoFactura(
      `${facturaData.subtotal}`,
      marginLeft + 80,
      yPos + 30
    );
    agregarElementoFactura(`IVA 12%`, marginLeft, yPos + 40);
    agregarElementoFactura(`${facturaData.iva}`, marginLeft + 80, yPos + 40);
    agregarElementoFactura(`A pagar`, marginLeft, yPos + 50);
    agregarElementoFactura(
      `${facturaData.a_pagar}`,
      marginLeft + 80,
      yPos + 50
    );

    // Agregar tipo de pedido y método de pago
    agregarElementoFactura(
      `Tipo de Pedido: ${obtenerTipoDePedido(facturaData.tipo_de_pedido)}`,
      marginLeft,
      yPos + 70
    );
    agregarElementoFactura(
      `Método de Pago: ${obtenerMetodoDePago(facturaData.metodo_de_pago)}`,
      marginLeft,
      yPos + 80
    );

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
