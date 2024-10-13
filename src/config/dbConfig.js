import { config } from 'dotenv';
import sql from 'mssql'; // Importa el paquete mssql

config(); // Cargar las variables de entorno

if (!process.env.DB_SERVER || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    throw new Error('Una o más variables de entorno de la base de datos no están definidas.');
}


const dbConfig = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Si usas Azure, por ejemplo
        trustServerCertificate: true // Para desarrollo
    }
};

export async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

export { sql }; // Exportar sql para que se pueda usar en otros archivos
