import express from 'express';
import { createNewContract, getContracts, getContract, generateContractWord, generateContractPDF, downloadWord, downloadPDF } from '../controllers/contractController.js';

const router = express.Router();

// Ruta para crear un contrato
router.post('/', createNewContract); // Crear un nuevo contrato

// Ruta para obtener todos los contratos
router.get('/', getContracts);

// Ruta para obtener un contrato por ID
router.get('/:id', getContract);

// app.post('/generate-contract-word', generateContractWord);
// app.post('/generate-contract-pdf', generateContractPDF);
// Configuración de rutas en tu archivo de rutas
router.post('/generate/word', generateContractWord);
router.post('/generate/pdf', generateContractPDF);


// Ruta para descargar el documento Word
router.get('/download-word/:id', downloadWord);
router.get('/download-pdf/:id', downloadPDF);



export default router;
