import { getLocation } from "../../utils/getLocation.js"; // Importa tu función de obtención de datos
import Empresa from "../../models/empresa.js"; // Importa tu modelo de empresa
import enviarTracto from "./enviarTracto.js";

async function ejecutarCiclo() {

  // Ciclo eterno
  while (true) {
    
    console.log("-------------Construmart-------------")
    // Envía datos cada minuto durante una hora (60 minutos)
    for (let i = 0; i < 60; i++) {
      const empresa = await Empresa.findOne({ nombre: "Construmart" });
      const data = await getLocation(empresa);
      //Enviamos los datos de cada tracto
      for (const tractoInfo of data) {
        let fechaUTC = tractoInfo.tracto.LocalActualDate;
        let fecha = new Date(fechaUTC);

        const fechaFormateada = fecha
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        let datosUbicacion = {
          latitud: tractoInfo.tracto.Lat,
          longitud: tractoInfo.tracto.Lon,
          altitud: tractoInfo.tracto.Alt,
          velocidad: tractoInfo.tracto.Speed,
          cog: tractoInfo.tracto.Direction,
          input: [0,0,0,0],
          adc: [0,0,0,0],
          patente: tractoInfo.patente,
        };
        // console.log(datosUbicacion);
        await enviarTracto(datosUbicacion);
      }
      console.log("-------------------------------------------------");
      await delay(60000); // Espera 1 minuto antes del próximo envío
    }
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

export default {ejecutarCiclo};
