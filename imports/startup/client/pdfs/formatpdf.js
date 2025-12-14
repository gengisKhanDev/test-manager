import jsPDF from 'jspdf';

try {
	generateGuidePdf = () => {
		const doc = new jsPDF();

		const backgroundImage = '/logo.png';
		const imgProps = doc.getImageProperties(backgroundImage);

		const pdfWidth = doc.internal.pageSize.getWidth();
		const pdfHeight = doc.internal.pageSize.getHeight();
		const imgWidth = pdfWidth * 0.8; // 80% of page width
		const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
		const imgX = (pdfWidth - imgWidth) / 2; // Center horizontally
		const imgY = (pdfHeight - imgHeight) / 2; // Center vertically

		doc.setGState(new doc.GState({ opacity: 0.1 }));
		doc.addImage(backgroundImage, 'PNG', imgX, imgY, imgWidth, imgHeight);

		doc.setGState(new doc.GState({ opacity: 1 }));
		doc.setFontSize(16);
		doc.text('Guía para Llenar el Formulario de Pruebas de Software', 20, 20);

		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.text('Resumen', 20, 30);

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		const resumenText = [
			'En esta sección, se debe proporcionar una visión general del caso de prueba. Esto incluye:',
			'1. Nombre del Caso de Prueba: El título o nombre del caso de prueba que se está ejecutando.',
			'2. Descripción: Una breve descripción del objetivo del caso de prueba y lo que se espera verificar.',
			'3. Precondiciones: Cualquier requisito previo que deba cumplirse antes de ejecutar la prueba (configuración del sistema, datos iniciales, etc.).',
			'4. Pasos para la Ejecución: Los pasos detallados que se seguirán para ejecutar la prueba.'
		];
		doc.text(resumenText, 20, 40, { maxWidth: 170 });

		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.text('Resultados Exitosos', 20, 80);

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		const exitosText = [
			'En esta sección, se debe documentar los resultados exitosos del caso de prueba, es decir, aquellos resultados que coinciden con lo esperado. Esto incluye:',
			'1. Resultado Esperado: La salida esperada del sistema después de ejecutar cada paso.',
			'2. Resultado Real: La salida real del sistema después de ejecutar cada paso.',
			'3. Observaciones: Cualquier comentario adicional sobre la ejecución de la prueba.'
		];
		doc.text(exitosText, 20, 90, { maxWidth: 170 });

		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.text('Resultados Fallidos', 20, 120);

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		const fallidosText = [
			'En esta sección, se debe documentar cualquier falla o discrepancia encontrada durante la ejecución del caso de prueba. Esto incluye:',
			'1. Resultado Esperado: La salida esperada del sistema después de ejecutar cada paso.',
			'2. Resultado Real: La salida real del sistema después de ejecutar cada paso.',
			'3. Descripción del Error: Una descripción detallada del error encontrado.',
			'4. Pasos para Reproducir: Los pasos específicos que deben seguirse para reproducir el error.',
			'5. Impacto: El impacto que tiene este error en la funcionalidad del sistema.',
			'6. Capturas de Pantalla/Evidencias: Adjuntar cualquier captura de pantalla o evidencia que muestre el error.'
		];
		doc.text(fallidosText, 20, 130, { maxWidth: 170 });

		doc.save("Guia_Formulario_Pruebas_Software.pdf");

	}
}
catch (error) {
	console.log(error);
	yoloAlert("error");
	disableBtn("#downloadPDF", false, `<i class="fas fa-file-pdf"></i> Download PDF`);
}
