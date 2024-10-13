import { submitForm } from './submitHandler.js';

document.getElementById('contractForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Convertimos el FormData en un objeto simple para enviar como JSON
    const contractData = {
        Cliente: formData.get('cliente'),
        Producto: formData.get('producto'),
        FechaContrato: formData.get('fecha'),
        Precio: formData.get('precio'),
        Descripcion: formData.get('descripcion')
    };

    // Obtener el formato seleccionado
    const format = formData.get('format');

    // Llamamos a la función que manejará el envío
    await submitForm(contractData, format);
});
