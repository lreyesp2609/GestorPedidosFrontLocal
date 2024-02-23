import React from 'react';
import { jsPDF } from "jspdf";

const GenerarReportePDF = ({
  empresaInfo,
  logoEmpresa,
  fechaReporte,
  contenidoReporte,
}) => {
  const generarReportePDF = () => {
    if (empresaInfo) {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11],
      });
      const fontSize = 12;

      doc.setFontSize(fontSize);

      if (empresaInfo && empresaInfo.nombre && logoEmpresa) {
        const logoWidth = 30;
        const logoHeight = 30;
        const logoPositionX = 0.5;
        const logoPositionY = 0.25;
        doc.addImage(
          logoEmpresa,
          "JPEG",
          logoPositionX,
          logoPositionY,
          logoWidth,
          logoHeight
        );

        const nombreEmpresaX = logoPositionX + logoWidth + 0.1;
        const nombreEmpresaY = logoPositionY + logoHeight / 3;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(empresaInfo.nombre, nombreEmpresaX, nombreEmpresaY);

        const direccionEmpresaX = nombreEmpresaX;
        const direccionEmpresaY = nombreEmpresaY + fontSize / 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(empresaInfo.direccion, direccionEmpresaX, direccionEmpresaY);

        const fechaX = direccionEmpresaX;
        const fechaY = direccionEmpresaY + fontSize / 2;
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha de Emisión: ${fechaReporte}`, fechaX, fechaY);

        const lineY = fechaY + 0.25;
        doc.setLineWidth(0.01);
        doc.line(0.5, lineY, 8, lineY);

        let yPos = lineY + 0.25;
        contenidoReporte.forEach((item) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(fontSize);
          doc.text(item, 0.5, yPos);
          yPos += 0.2;
        });
      }

      doc.save("reporte.pdf");
    }
  };

  return generarReportePDF();
};

export default GenerarReportePDF;
