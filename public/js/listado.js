document.addEventListener('DOMContentLoaded', () => {
  // Función para descargar un contrato en el formato especificado (Word o PDF)
  const downloadContract = async (id, format) => {
    const url = `/api/contratos/download-${format}/${id}`; // Ruta de la API

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al descargar el contrato');
        }

        const blob = await response.blob(); // Convertir la respuesta a un blob
        const link = document.createElement('a'); // Crear un enlace temporal
        link.href = window.URL.createObjectURL(blob); // Crear un URL para el blob
        link.download = `contract-${id}.${format}`; // Nombre del archivo que se descargará
        document.body.appendChild(link); // Añadir el enlace al DOM
        link.click(); // Hacer clic en el enlace para iniciar la descarga
        document.body.removeChild(link); // Eliminar el enlace del DOM
    } catch (error) {
        console.error('Error al descargar el contrato:', error);
    }
};

  // Función para obtener la lista de contratos desde el servidor
  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/contratos'); // Ruta para obtener los contratos
      if (!response.ok) {
        throw new Error('Error al obtener los contratos');
      }
      const contracts = await response.json(); // Convertir la respuesta a JSON

      renderContracts(contracts); // Renderizar los contratos en la tabla
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para renderizar la lista de contratos en la tabla
  const renderContracts = (contracts) => {
    const contractList = document.getElementById('contract-list');
    contractList.innerHTML = ''; // Limpiar el contenido previo

    contracts.forEach(contract => {
      const row = document.createElement('tr');

      // Crear las celdas para cada campo del contrato
      row.innerHTML = `
        <td>${contract.Id}</td>
        <td>${contract.Cliente}</td>
        <td>${contract.Producto}</td>
        <td>${contract.FechaContrato}</td>
        <td>${contract.Precio}</td>
        <td>${contract.Descripcion}</td>
        <td>
          <!-- Botones para descargar el contrato en formato Word y PDF -->
          <button class="download-btn" data-id="${contract.Id}" data-format="word">Word</button>
          <button class="download-btn" data-id="${contract.Id}" data-format="pdf">PDF</button>
        </td>
      `;

      contractList.appendChild(row); // Añadir la fila a la tabla
    });

    // Agregar evento a los botones de descarga
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.getAttribute('data-id');
        const format = event.target.getAttribute('data-format');
        downloadContract(id, format);
      });
    });
  };

  // Llamar a la función para obtener y mostrar los contratos al cargar la página
  fetchContracts();
});
