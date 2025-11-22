import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

try {
	generateDynamicPdf = (test, titleProyect) => {
		const doc = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4'
		});

		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 10;
		const maxWidth = pageWidth - margin * 2;
		let yPosition = margin;

		// Encabezado
		doc.setDrawColor(0);
		doc.setFillColor(224, 91, 120);
		doc.rect(0, 0, 255, 21, "F");
		doc.addImage("/logo.png", "PNG", 6, 0, 48, 20);
		doc.setFontSize(12);
		doc.setFont(undefined, "bold");
		yPosition += 10;
		doc.text(120, yPosition, "Date of Creation: " + formatDateView(new Date()));
		doc.setFont(undefined, "normal");
		doc.setFontSize(20);
		doc.text(70, 10, titleProyect);
		yPosition += 20; // Incrementar la posición Y para el siguiente contenido
		doc.setFontSize(18);
		doc.setFont('helvetica', 'bold');
		doc.text('Encabezado del Documento', margin, yPosition);
		yPosition += 20;

		// Detalles del Test
		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.text('Tester:', margin, yPosition);
		doc.setFont('helvetica', 'normal');
		doc.text(test.createdBy.name, margin + 20, yPosition);

		yPosition += 10;

		doc.setFont('helvetica', 'bold');
		doc.text('Desarrollador:', margin, yPosition);
		doc.setFont('helvetica', 'normal');
		doc.text(test.assignedTo.name, margin + 30, yPosition);

		yPosition += 10;

		doc.setFont('helvetica', 'bold');
		doc.text('Tipo de Prueba:', margin, yPosition);
		doc.setFont('helvetica', 'normal');
		doc.text(test.testType, margin + 35, yPosition);

		yPosition += 20;

		// Crear un contenedor temporal para el contenido HTML
		const tempContainer = document.createElement('div');
		tempContainer.innerHTML = test.content;
		tempContainer.style.width = `${maxWidth}px`;
		tempContainer.style.fontSize = '6px'; // Ajusta el tamaño de la letra aquí
		document.body.appendChild(tempContainer);

		// Usar html2canvas para convertir el contenido HTML a un canvas
		html2canvas(tempContainer, { scale: 2 })
			.then((canvas) => {
				const imgData = canvas.toDataURL('image/png');
				const imgWidth = maxWidth;
				const imgHeight = (canvas.height * imgWidth) / canvas.width;
				let heightLeft = imgHeight;

				doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
				heightLeft -= pageHeight - yPosition - margin;

				while (heightLeft >= 0) {
					yPosition = heightLeft - imgHeight + margin;
					doc.addPage();
					doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
					heightLeft -= pageHeight - margin;
				}

				document.body.removeChild(tempContainer);

				addImagesToPDF(doc, test.images, pageWidth, pageHeight, margin, yPosition);

				doc.save('documento_formateado.pdf');
			})
			.catch((error) => {
				console.error(error);
				yoloAlert("error");
				disableBtn("#downloadPDF", false, `<i class="fas fa-file-pdf"></i> Download PDF`);
			});
	}

	function addImagesToPDF(doc, images, pageWidth, pageHeight, margin, startY) {
		const imageWidth = 40;
		const imageHeight = 40;
		const imagesPerRow = 4;
		let xPosition = margin;
		let yPosition = startY + 20; // Espacio después del contenido HTML
		let imageCount = 0;

		images.forEach((image, index) => {
			if (imageCount === imagesPerRow) {
				xPosition = margin;
				yPosition += imageHeight + 10;
				imageCount = 0;
			}

			if (yPosition + imageHeight > pageHeight - margin) {
				doc.addPage();
				yPosition = margin;
			}

			doc.addImage(image.base64, image.type, xPosition, yPosition, imageWidth, imageHeight);
			xPosition += imageWidth + 10;
			imageCount++;
		});
	}
}
catch (error) {
	console.log(error);
	yoloAlert("error");
	disableBtn("#downloadPDF", false, `<i class="fas fa-file-pdf"></i> Download PDF`);
}
