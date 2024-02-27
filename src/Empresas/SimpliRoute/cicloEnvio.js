import { getLocation } from "../../utils/getLocation.js"; // Importa tu función de obtención de datos
import Empresa from "../../models/empresa.js"; // Importa tu modelo de empresa
// import enviarTracto from "./enviarTracto.js";
import XlsxPopulate from "xlsx-populate";
import Tracto from "../../models/tracto.js";
import fs from "fs";
import enviarTracto from "./enviarTracto.js";

async function ejecutarCiclo() {
  // Ciclo eterno
  while (true) {
    // Obtener la empresa con todos los tractos
    const empresa = await Empresa.findOne({ nombre: "SimpliRoute" }).populate(
      "tractos"
    );

    // Iterar sobre cada tracto de la empresa
    for (const tractoInfo of empresa.tractos) {
      // Obtener datos de ubicación utilizando getLocation
      const ubicacion = await getLocation(tractoInfo);
      if (ubicacion) {
        let fechaUTC = ubicacion.tracto.LocalActualDate;
        let fecha = new Date(fechaUTC);

        // Construir objeto de datos de ubicación
        const datosUbicacion = {
          latitude: parseFloat(ubicacion.tracto.Lat),
          longitude: parseFloat(ubicacion.tracto.Lon),
          timestamp: ubicacion.tracto.LocalActualDate,
          vehicleId: tractoInfo.idSimpli,
          providerName: process.env.SIMPLIRROUTE_PROVIDER_NAME,
        };
        enviarTracto(datosUbicacion,tractoInfo.patente);
      }
    }
    console.log("Esperando 1 minuto antes del próximo envío de datos");
    // Esperar 1 minuto antes del próximo envío de datos
    await delay(60000);
  }
}

async function leerArchivoExcel() {
  try {
    // Ruta al archivo Excel
    const rutaArchivo =
      "/home/christian/Escritorio/appGPS/src/Empresas/SimpliRoute/tractos.xlsx";

    // Cargar el archivo Excel
    const workbook = await XlsxPopulate.fromFileAsync(rutaArchivo);

    // Obtener la hoja de trabajo (sheet) por su nombre
    const sheet = workbook.sheet("Vehículos en Simpli");

    // Obtener la región de celdas que contienen datos en la hoja
    const usedRange = sheet.usedRange();

    // Iterar sobre cada fila y mostrar los datos
    usedRange.eachRow((row) => {
      const rowData = row.toArray();
      console.log(`Fila ${row.rowNumber()}: `, rowData);
      // Puedes hacer algo con los datos de cada fila aquí
    });
  } catch (error) {
    console.error("Error al leer el archivo Excel:", error);
  }
}

function gradosEnteros(grados) {
  const angulo = parseFloat(grados);
  if (!isNaN(angulo)) {
    const radianes = Math.floor(angulo);
    return radianes;
  } else {
    return 0;
  }
}

// Función para retrasar la ejecución
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default { ejecutarCiclo };
