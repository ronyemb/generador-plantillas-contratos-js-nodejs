import fs from "fs";
import path from "path";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import docxToPdf from "docx-pdf";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Generar el documento Word usando una plantilla .dot
export async function generateWord(contract, clausulas) {
  try {
    const __dirname = path.resolve();
    const templatePath = path.join(
      __dirname,
      "templates",
      "contractTemplate.docx"
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    // Formato de cláusulas
    // const clausulasFormatted = clausulas.map(c => `${c.Orden}. ${c.Descripcion}`).join('\n');
    // Formato de cláusulas en formato de tabla
    const clausulasFormatted = clausulas.map(c => {
      return {
        Orden: c.Orden,
        Descripcion: c.Descripcion
      };
    });    


    // Reemplazar las variables en la plantilla con los datos del contrato
    doc.setData({
      Cliente: contract.Cliente,
      Producto: contract.Producto,
      FechaContrato: contract.FechaContrato,
      Precio: contract.Precio,
      Descripcion: contract.Descripcion,
      Clausulas: clausulasFormatted, // Incluir cláusulas

    });

    try {
      doc.render();
    } catch (error) {
      throw new Error("Error al generar el documento Word: " + error.message);
    }

    const buf = doc.getZip().generate({ type: "nodebuffer" });
    return buf;
  } catch (error) {
    console.error("Error en la función generateWord:", error);
    throw new Error("Error al generar el documento Word");
  }
}

// Convertir el documento Word en un archivo PDF
export async function generatePDF(contract, clausulas) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Primero generamos el documento Word
    const wordBuffer = await generateWord(contract, clausulas); // Genera el documento Word

    // Guardar el buffer como un archivo temporal
    const tempWordPath = path.join(__dirname, "tempContract.docx");
    fs.writeFileSync(tempWordPath, wordBuffer);

    // Convertir el archivo Word a PDF usando docx-pdf
    const tempPdfPath = path.join(__dirname, "tempContract.pdf");

    await new Promise((resolve, reject) => {
      docxToPdf(tempWordPath, tempPdfPath, (err, result) => {
        if (err) {
          reject(new Error("Error al convertir a PDF: " + err.message));
        } else {
          resolve(result);
        }
      });
    });

    // Leer el PDF generado
    const pdfBytes = fs.readFileSync(tempPdfPath);

    // Limpiar archivos temporales
    fs.unlinkSync(tempWordPath);
    fs.unlinkSync(tempPdfPath);

    return pdfBytes;
  } catch (error) {
    console.error("Error en la función generatePDF:", error);
    throw new Error("Error al generar el documento PDF");
  }
}
