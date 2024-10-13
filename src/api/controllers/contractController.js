import {
  getContractById,
  createContract,
  getContracts as fetchContracts,
  getClausulasContratos, // Nueva importación para obtener cláusulas
} from "../models/contractModel.js";
import { generateWord, generatePDF } from "../../services/documentService.js";

export async function downloadWord(req, res) {
  try {
    const contractId = req.params.id;
    const contract = await getContractById(contractId); //Obtener contrato por Id
    const clausulas = await getClausulasContratos(); // Obtener cláusulas

    const wordBuffer = await generateWord(contract, clausulas);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contract-${contractId}.docx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(wordBuffer);
  } catch (error) {
    console.error("Error al descargar el Word:", error); // Añadir un log para depurar
    res.status(500).send("Error al generar el documento Word");
  }
}

// Ruta para descargar el documento PDF
export async function downloadPDF(req, res) {
  try {
    const contractId = req.params.id;
    const contract = await getContractById(contractId); // Verifica que devuelva el contrato correctamente
    const clausulas = await getClausulasContratos(); // Obtener cláusulas

    const pdfBuffer = await generatePDF(contract, clausulas);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contract-${contractId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al descargar el PDF:", error); // Añadir un log para depurar
    res.status(500).send("Error al generar el documento PDF");
  }
}

// Generar un contrato (en formato Word)
export async function generateContractWord(req, res) {
  try {
    console.log(
      "Datos recibidos para la generación del contrato Word:",
      req.body
    ); // Log de los datos recibidos
    const contractData = req.body;
    const createdContract = await createContract(contractData); // Log para el contrato creado en la BD
    const clausulas = await getClausulasContratos(); // Obtener cláusulas


    // Generar documento Word para el contrato recién creado
    const wordBuffer = await generateWord(createdContract, clausulas); // Log para el buffer del archivo Word

    // Configurar la respuesta para enviar el archivo Word
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=contrato.docx");
    res.send(wordBuffer);
  } catch (error) {
    console.error("Error al generar el contrato en Word:", error); // Log del error
    res.status(500).send("Error al generar el contrato");
  }
}

// Generar un contrato (en formato PDF)
export async function generateContractPDF(req, res) {
  try {
    const contractData = req.body; // Obtiene los datos del contrato del cuerpo de la solicitud
    const createdContract = await createContract(contractData); // Crea el contrato en la base de datos
    const clausulas = await getClausulasContratos(); // Obtener cláusulas

    // Generar documento PDF para el contrato recién creado
    const pdfBuffer = await generatePDF(createdContract, clausulas); // Cambiado a generatePDF

    // Responder con el PDF generado
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=contrato.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar el contrato en PDF:", error); // Agregar un log para ayudar en la depuración
    res.status(500).send("Error al generar el contrato");
  }
}

// Obtener un contrato por ID
export async function getContract(req, res) {
  try {
    const contract = await getContractById(req.params.id);
    if (!contract) {
      return res.status(404).send("Contrato no encontrado");
    }
    res.json(contract);
  } catch (error) {
    res.status(500).send("Error al obtener el contrato");
  }
}

// Crear un contrato
export async function createNewContract(req, res) {
  try {
    const newContract = req.body;
    await createContract(newContract);
    res.status(201).send("Contrato creado");
  } catch (error) {
    res.status(500).send("Error al crear el contrato");
  }
}

// Obtener todos los contratos
export async function getContracts(req, res) {
  try {
    const contracts = await fetchContracts(); // Asegúrate de que fetchContracts sea la función correcta
    res.json(contracts);
  } catch (error) {
    console.error("Error al obtener los contratos:", error); // Muestra el error en la consola
    res.status(500).send("Error al obtener los contratos");
  }
}
