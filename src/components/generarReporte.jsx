import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GenerarReportePDF = ({ empresaInfo, logoEmpresa, empleadosData }) => {

    // Función para generar el reporte PDF
    const generarReportePDF = () => {
        // Crear un nuevo documento PDF
        const doc = new jsPDF();

        // Definir coordenadas y dimensiones de las franjas
        const topRectY = 0; // Coordenada Y de la franja superior
        const bottomRectY = doc.internal.pageSize.getHeight() - 20; // Coordenada Y de la franja inferior
        const rectWidth = doc.internal.pageSize.getWidth(); // Ancho de la franja es igual al ancho de la página
        const rectHeight = 30; // Altura de las franjas
        const rectHeighty = 20; // Altura de las franjas

        doc.setFillColor(194, 18, 18); // Rojo: RGB(255, 0, 0)

        // Dibujar franja superior
        doc.rect(0, topRectY, rectWidth, rectHeight, 'F');

        // Dibujar franja inferior
        doc.rect(0, bottomRectY, rectWidth, rectHeighty, 'F');

        // Agregar logo de la empresa al PDF si está disponible
        if (logoEmpresa) {
            
            const logo = new Image();
            logo.src = logoEmpresa;
            const logoWidth = 30; // Ancho del logo
            const logoX = 5; // Coordenada X del logo
            const logoY = 0; // Coordenada Y del logo
            doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoWidth); // Colocar el logo en el lado izquierdo
        }
        
        doc.setTextColor(255, 255, 255); // Blanco: RGB(255, 255, 255)
        doc.setFontSize(15);
        doc.text(`${empresaInfo.enombre}`, 32, 12); // Información de la empresa al lado del logo
        doc.setFontSize(12);
        doc.text(`${empresaInfo.direccion}`, 32, 17);
        doc.setFontSize(11);
        doc.text(`${empresaInfo.etelefono}`, 32, 22);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); 

        // Agregar título y encabezados de la tabla de empleados
        doc.text('Reporte de Empleados', 10, 40);
        
        const headers = [['Nombre', 'Apellido', 'Teléfono', 'Ciudad', 'Fecha']];

        // Extraer datos de los empleados para la tabla
        const data = empleadosData.map(empleado => [
            empleado.nombre,
            empleado.apellido,
            empleado.telefono,
            empleado.ciudad,
            empleado.fecha,
        ]);

        // Agregar la tabla de empleados al PDF
        doc.autoTable({
            startY: 48,
            head: headers,
            body: data,
        });

        // Obtener la fecha actual
        const fechaEmision = new Date().toLocaleDateString();

        // Agregar la fecha de emisión al PDF
        const fechaHoraEmision = new Date().toLocaleString();

        // Agregar la fecha y hora de emisión al PDF
        // Obtener el ancho de la página
        const pageWidth = doc.internal.pageSize.getWidth();

        // Obtener el ancho del texto
        const fontSize = 10;
        const fechaTextWidth = doc.getStringUnitWidth(`Fecha y hora de emisión: ${fechaHoraEmision}`) * fontSize / doc.internal.scaleFactor;

        // Calcular la posición del texto
        const xPosition = pageWidth - fechaTextWidth - 10; // 10 es el margen derecho
        const yPosition = doc.internal.pageSize.getHeight() - 10; // 10 es el margen inferior

        // Establecer el tamaño de fuente y renderizar el texto
        doc.setFontSize(fontSize);
        doc.setTextColor(255, 255, 255);
        doc.text(`Fecha y hora de emisión: ${fechaHoraEmision}`, xPosition, yPosition);


        // Guardar el documento PDF
        doc.save('reporte_empleados.pdf');
    };

    // Llamamos a la función para generar el reporte PDF
    generarReportePDF();

    return null; // No necesitamos renderizar ningún elemento visible en el DOM
};

export default GenerarReportePDF;
