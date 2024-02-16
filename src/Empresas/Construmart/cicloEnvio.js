import { getLocation } from "../../utils/getLocation.js"; // Importa tu función de obtención de datos
import Empresa from "../../models/empresa.js"; // Importa tu modelo de empresa
import enviarTracto from "./enviarTracto.js";

async function ejecutarCiclo() {
  // Ciclo eterno
  while (true) {

    // Obtener la empresa con todos los tractos
    const empresa = await Empresa.findOne({ nombre: "Construmart" }).populate(
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
        const datosUbicacion = [
          {
            fecha: fecha.getTime(),
            latitud: parseFloat(ubicacion.tracto.Lat),
            longitud: parseFloat(ubicacion.tracto.Lon),
            altitud: parseFloat(ubicacion.tracto.Alt),
            velocidad: parseFloat(ubicacion.tracto.Speed),
            cog: parseFloat(ubicacion.tracto.Direction),
            nsat: 8.0,
            realtime: true,
            input: [0, 0, 0, 0],
            adc: [-200, -200, -200, -200],
            patente: ubicacion.patente,
          },
        ];
        enviarTracto(datosUbicacion);
      }
    }
    
    // Esperar 1 minuto antes del próximo envío de datos
    await delay(60000);
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
