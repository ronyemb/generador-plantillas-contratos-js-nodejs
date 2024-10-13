export async function submitForm(contractData, format) {
  // Verificar que los campos esenciales no estén vacíos
  if (
    !contractData.Cliente ||
    !contractData.Producto ||
    !contractData.FechaContrato ||
    !contractData.Precio
  ) {
    console.error(
      "Datos incompletos: Los campos Cliente, Producto, Fecha de Contrato y Precio son obligatorios."
    );
    return;
  }

  try {
    // Ajustamos la ruta de la API según el formato seleccionado
    const endpoint =
      format === "pdf"
        ? "/api/contratos/generate/pdf"
        : "/api/contratos/generate/word";

    console.log("Datos que se están enviando al servidor:", contractData); // Log para verificar los datos

    // Verificar si los datos esenciales están presentes
    if (!contractData || Object.keys(contractData).length === 0) {
      console.error("Datos del contrato incompletos o vacíos");
      return;
    }

    const response = await fetch(endpoint, {
      // URL completa para evitar problemas
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractData), // Enviar los datos del contrato
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contrato.${format}`; // Ajustamos la extensión según el formato
      document.body.appendChild(a);
      a.click();
      a.remove();
      console.log("Contrato generado y descargado con éxito");
    } else {
      const errorMessage = await response.text();
      console.error("Error al generar el contrato:", errorMessage); // Mostrar el error devuelto por el servidor
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}
