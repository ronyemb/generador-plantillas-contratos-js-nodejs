import express from 'express';
import { config } from 'dotenv';
import { connectDB } from './src/config/dbConfig.js';
import contractRoutes from './src/api/routes/contractRoutes.js';

// Cargar las variables de entorno
config(); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar JSON y formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar formularios URL-encoded

// Middleware para servir archivos estáticos
app.use(express.static('public')); // Cambia 'public' si tu carpeta tiene otro nombre

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api/contratos', contractRoutes); // Rutas de contratos

// Ruta de ejemplo para la página principal (opcional)
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Contratos');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
