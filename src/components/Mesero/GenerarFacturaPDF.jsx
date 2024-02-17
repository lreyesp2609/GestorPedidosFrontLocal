import React from "react";
import { Button } from "antd";
import { jsPDF } from "jspdf";
import diseño from "./res/diseño.png";
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
  const generarFacturaPDF = () => {
    const doc = new jsPDF();
    const fontSize = 12; // Establece el tamaño de fuente deseado

    // Establece el tamaño de fuente para todo el documento
    doc.setFontSize(fontSize);
    doc.addImage(
      diseño,
      "PNG",
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    );

    const columnWidths = [80, 30, 30, 30, 30];
    if (empresaInfo && empresaInfo.enombre && logoEmpresa) {
      const logoWidth = 30; // Ancho del logo
      const logoHeight = 30; // Alto del logo
      const logoPositionX = 10; // Posición X del logo
      const logoPositionY = 4; // Posición Y del logo
      doc.addImage(
        logoEmpresa,
        "JPEG",
        logoPositionX,
        logoPositionY,
        logoWidth,
        logoHeight
      );
      // Establece la posición del texto del nombre de la empresa al lado del logo
      const nombreEmpresaX = logoPositionX + logoWidth + 2; // Ajusta la distancia del texto al logo
      const nombreEmpresaY = logoPositionY + logoHeight / 3; // Centra verticalmente el texto con respecto al logo
      doc.setFont("helvetica", "bold"); // Establece el texto en negrita
      doc.setFontSize(16); // Tamaño de fuente más grande para el nombre de la empresa
      doc.text(empresaInfo.enombre, nombreEmpresaX, nombreEmpresaY);

      // Calcular la altura del texto del nombre de la empresa
      const nombreEmpresaHeight = fontSize / 2; // Suponiendo que la mitad del tamaño de la fuente es la altura del texto

      // Ajustar la posición de la dirección para que esté alineada verticalmente con el nombre de la empresa
      const direccionEmpresaX = nombreEmpresaX; // Misma posición X que el nombre de la empresa
      const direccionEmpresaY = nombreEmpresaY + nombreEmpresaHeight; // Alineado verticalmente con el nombre de la empresa
      doc.setFont("helvetica", "normal"); // Establece el texto en normal
      doc.setFontSize(12); // Tamaño de fuente más pequeño para la dirección
      doc.text(empresaInfo.direccion, direccionEmpresaX, direccionEmpresaY);

      // Ajustar la posición del número de teléfono debajo de la dirección
      const telefonoEmpresaX = direccionEmpresaX; // Misma posición X que la dirección
      const telefonoEmpresaY = direccionEmpresaY + fontSize / 2; // Alineado verticalmente debajo de la dirección
      doc.setFont("helvetica", "normal"); // Establece el texto en normal
      doc.text(
        `Teléfono: ${empresaInfo.etelefono}`,
        telefonoEmpresaX,
        telefonoEmpresaY
      );

      // Agregar una línea divisoria debajo del número de teléfono
      const lineY = telefonoEmpresaY + 5; // Ajusta la posición de la línea debajo del texto del teléfono
      doc.setLineWidth(0.5); // Establece el ancho de la línea
      doc.line(telefonoEmpresaX, lineY, telefonoEmpresaX + 50, lineY); // Dibuja la línea
      doc.setFontSize(12); // Restaura el tamaño de fuente

      // Agregar el nombre del cliente debajo del logo de la empresa
      if (clienteData) {
        const clienteNombreY = lineY + 10; // Ajustar la posición verticalmente debajo de la línea
        doc.setFont("helvetica", "bold"); // Establece el texto en negrita
        doc.text(
          `Cliente: ${clienteData.crazon_social}`,
          logoPositionX,
          clienteNombreY
        );
      }
    }
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha de Emisión: ${facturaData.fecha_emision}`, 10, 70);
    // Mostrar los detalles de la factura
    let yPos = 80;
    const headers = [
      "Descripción",
      "Cantidad",
      "P.Unitario",
      "Descuento", // Incluir el campo de descuento en los encabezados
      "Valor",
    ];
    headers.forEach((header, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(
        header,
        10 +
          columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0),
        yPos
      );
    });
    yPos += 10;
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
        const fila = [
          descripcion.length > 30
            ? descripcion.substring(0, 30) + "..."
            : descripcion,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.descuento, // Mostrar el descuento en la fila
          detalle.valor,
        ];
        fila.forEach((item, index) => {
          doc.setFont("helvetica", "normal");
          if (index === 0 && descripcion.length > 30) {
            doc.setFontSize(8);
          } else {
            doc.setFontSize(fontSize); // Establece el mismo tamaño de fuente
          }
          doc.text(
            item.toString(),
            10 +
              columnWidths
                .slice(0, index)
                .reduce((acc, width) => acc + width, 0),
            yPos
          );
        });
        yPos += 10;
      }
    });

    // Después de agregar los detalles de la factura, mostrar los datos en fila
    doc.setFont("helvetica", "bold");
    doc.text(`Total`, 10, yPos + 10);
    doc.text(`${facturaData.total}`, 10, yPos + 15);
    doc.text(`Descto`, 27, yPos + 10);
    doc.text(`${facturaData.descuento}`, 27, yPos + 15);
    doc.text(`Sub-Total`, 47, yPos + 10);
    doc.text(`${facturaData.subtotal}`, 47, yPos + 15);
    doc.text(`IVA 12%`, 76, yPos + 10);
    doc.text(`${facturaData.iva}`, 76, yPos + 15);
    doc.text(`A pagar`, 100, yPos + 10);
    doc.text(`${facturaData.a_pagar}`, 100, yPos + 15);

    // Agregar el tipo de pedido y el método de pago debajo del total
    doc.text(
      `Tipo de Pedido: ${obtenerTipoDePedido(facturaData.tipo_de_pedido)}`,
      10,
      yPos + 30
    );
    doc.text(
      `Método de Pago: ${obtenerMetodoDePago(facturaData.metodo_de_pago)}`,
      10,
      yPos + 40
    );

    doc.save("factura.pdf");
  };
  return (
    <Button type="primary" onClick={generarFacturaPDF}>
      Generar Factura
    </Button>
  );
};

export default GenerarFacturaPDF;
