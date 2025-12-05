// imports/client/testpdf.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Carga del logo desde /public/logo.png
function loadLogo() {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = '/logo.png';        // Asegúrate que el archivo está en /public/logo.png
		img.crossOrigin = 'Anonymous';

		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
	});
}

// (Opcional) Imágenes adjuntas del test
function addImagesToPDF(doc, images, pageWidth, pageHeight, margin, startY) {
	if (!images || !images.length) return;

	console.log('[addImagesToPDF] images =>', images);

	const imageWidth = 40;
	const imageHeight = 40;
	const imagesPerRow = 4;
	let xPosition = margin;
	let yPosition = startY;
	let imageCount = 0;

	images.forEach((image) => {
		if (!image) return;

		// Tus datos vienen así:
		// { base64: "data:image/jpeg;base64,....", type: "image/jpeg" }
		let data = image.base64 || image.dataUrl || image.url;
		let mime = image.type || 'image/png';

		if (!data) return;

		// Si YA viene como dataURL (empieza con "data:") lo dejamos tal cual
		if (!data.startsWith('data:')) {
			// Si solo fuese base64 sin prefijo, le añadimos uno razonable
			data = `data:${mime};base64,${data}`;
		}

		const format = mime.toLowerCase().includes('png') ? 'PNG' : 'JPEG';

		if (imageCount === imagesPerRow) {
			xPosition = margin;
			yPosition += imageHeight + 10;
			imageCount = 0;
		}

		if (yPosition + imageHeight > pageHeight - margin) {
			doc.addPage();
			yPosition = margin;
		}

		try {
			doc.addImage(data, format, xPosition, yPosition, imageWidth, imageHeight);
		} catch (e) {
			console.error('Error añadiendo imagen al PDF:', e, image);
		}

		xPosition += imageWidth + 10;
		imageCount++;
	});
}

// Función global para generar el PDF
generateDynamicPdf = (test, titleProyect) => {
	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4',
	});

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 10;
	const maxWidth = pageWidth - margin * 2;
	let yPosition = margin;

	// 1️⃣ Cargar el logo y generar el PDF
	loadLogo()
		.then((logoImg) => {
			// 🔹 Encabezado
			doc.setDrawColor(0);
			doc.setFillColor(224, 91, 120);
			doc.rect(0, 0, pageWidth, 21, 'F');

			// Intentar añadir el logo (si falla, seguimos sin logo)
			try {
				doc.addImage(logoImg, 'PNG', 6, 0, 48, 20);
			} catch (e) {
				console.warn('Error añadiendo logo al PDF:', e);
			}

			// Fecha y título
			doc.setFontSize(12);
			doc.setFont(undefined, 'bold');
			yPosition += 10;
			doc.text(
				120,
				yPosition,
				'Date of Creation: ' + formatDateView(new Date()),
			);

			doc.setFont(undefined, 'normal');
			doc.setFontSize(20);
			doc.text(70, 10, titleProyect);

			yPosition += 20;
			doc.setFontSize(18);
			doc.setFont('helvetica', 'bold');
			doc.text('Encabezado del Documento', margin, yPosition);
			yPosition += 20;

			// 2️⃣ Datos básicos del test
			doc.setFontSize(12);
			doc.setFont('helvetica', 'bold');
			doc.text('Tester:', margin, yPosition);
			doc.setFont('helvetica', 'normal');
			doc.text(test?.createdBy?.name || '', margin + 20, yPosition);

			yPosition += 10;

			doc.setFont('helvetica', 'bold');
			doc.text('Desarrollador:', margin, yPosition);
			doc.setFont('helvetica', 'normal');
			doc.text(test?.assignedTo?.name || '', margin + 30, yPosition);

			yPosition += 10;

			doc.setFont('helvetica', 'bold');
			doc.text('Tipo de Prueba:', margin, yPosition);
			doc.setFont('helvetica', 'normal');
			doc.text(String(test?.testType || ''), margin + 35, yPosition);

			yPosition += 20;

			// 3️⃣ Crear contenedor temporal para el contenido HTML del test
			const tempContainer = document.createElement('div');
			tempContainer.innerHTML = test?.content || '';
			tempContainer.style.position = 'absolute';
			tempContainer.style.left = '-10000px';
			tempContainer.style.top = '0';
			tempContainer.style.width = `${maxWidth * 4}px`; // ancho en px
			tempContainer.style.fontSize = '10px';
			tempContainer.style.lineHeight = '1.4';
			document.body.appendChild(tempContainer);

			return html2canvas(tempContainer, { scale: 2 }).then((canvas) => {
				console.log('canvas size =>', canvas.width, canvas.height);

				const imgWidth = maxWidth;

				// ⚠️ Si el canvas viene sin alto, evitamos petar jsPDF y usamos texto plano
				if (!canvas.width || !canvas.height) {
					console.warn(
						'Canvas sin contenido (height = 0), usando texto plano en vez de imagen.',
					);

					const plainText = (tempContainer.textContent || '').trim();
					document.body.removeChild(tempContainer);

					if (plainText) {
						const lines = doc.splitTextToSize(plainText, maxWidth);
						lines.forEach((line) => {
							if (yPosition > pageHeight - margin) {
								doc.addPage();
								yPosition = margin;
							}
							doc.text(margin, yPosition, line);
							yPosition += 6; // espacio por línea
						});
					}

					// Nueva página para imágenes (si existen)
					if (test.images && test.images.length) {
						doc.addPage();
						addImagesToPDF(
							doc,
							test.images,
							pageWidth,
							pageHeight,
							margin,
							margin,
						);
					}

					doc.save('documento_formateado.pdf');
					return;
				}

				// ✅ Canvas válido, lo convertimos a imagen JPEG y lo añadimos
				const imgData = canvas.toDataURL('image/jpeg', 0.95);
				const imgHeight = (canvas.height * imgWidth) / canvas.width;
				let heightLeft = imgHeight;

				doc.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, imgHeight);
				heightLeft -= pageHeight - yPosition - margin;

				while (heightLeft > 0) {
					doc.addPage();
					const newY = margin;
					doc.addImage(imgData, 'JPEG', margin, newY, imgWidth, imgHeight);
					heightLeft -= pageHeight - margin;
				}

				document.body.removeChild(tempContainer);

				// 4️⃣ Nueva página para las imágenes adjuntas (si existen)
				if (test.images && test.images.length) {
					doc.addPage();
					addImagesToPDF(
						doc,
						test.images,
						pageWidth,
						pageHeight,
						margin,
						margin,
					);
				}

				doc.save('documento_formateado.pdf');
			});
		})
		.catch((error) => {
			console.error('Error generando PDF:', error);
			yoloAlert('error');
			disableBtn(
				'#downloadPDF',
				false,
				`<i class="fas fa-file-pdf"></i> Download PDF`,
			);
		});
};
