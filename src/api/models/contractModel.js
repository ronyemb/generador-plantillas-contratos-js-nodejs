import { sql } from '../../config/dbConfig.js';

// Obtener un contrato por ID
export async function getContractById(id) {
    const result = await sql.query`EXEC GetContractById @Id = ${id}`;
    return result.recordset[0];
}

// Crear un nuevo contrato
export async function createContract(contrato) {
    const { Cliente, Producto, FechaContrato, Precio, Descripcion } = contrato;
    // Ejecutar el procedimiento almacenado para crear el contrato
    const result = await sql.query`
        EXEC CreateContract 
            @Cliente = ${Cliente}, 
            @Producto = ${Producto}, 
            @FechaContrato = ${FechaContrato}, 
            @Precio = ${Precio}, 
            @Descripcion = ${Descripcion}
    `;

    // Devuelve el registro creado
    return result.recordset[0]; // Devolver el primer registro insertado
}

// Obtener todos los contratos
export async function getContracts() {
    try {
        const result = await sql.query`EXEC GetAllContracts`;
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener los contratos:', error);
        throw error;
    }
}

// Obtener todas las cláusulas de contratos
export async function getClausulasContratos() {
    try {
        const result = await sql.query`SELECT * FROM [dbo].[ClausulasContratos] ORDER BY Orden`;
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener las cláusulas de contratos:', error);
        throw error;
    }
}

