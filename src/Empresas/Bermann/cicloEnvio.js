import { getLocation } from "../../utils/getLocation.js"; // Importa tu función de obtención de datos
import { login } from "./login.js"; // Importa tu función de inicio de sesión
import Empresa from "../../models/empresa.js"; // Importa tu modelo de empresa
import enviarTracto from "./enviarTracto.js";

async function ejecutarCiclo() {
  let tokenBermann = null;

  // Ciclo eterno
  while (true) {
    
    // Intenta iniciar sesión si no tienes un token válido
    if (!tokenBermann) {
      const clientID = process.env.CLIENTID;
      const username = process.env.BERMANN_USERNAME;
      const password = process.env.PASSWORD;
      tokenBermann = await login(clientID, username, password); 
      if (!tokenBermann) {
        console.error("No se pudo iniciar sesión");
        return;
      }
    }
    // Envía datos cada minuto durante una hora (60 minutos)
    for (let i = 0; i < 60; i++) {
      const empresa = await Empresa.findOne({ nombre: "Bermann" }).populate("tractos") ;

      //Enviamos los datos de cada tracto
      for (const tractoInfo of empresa.tractos) {
        const ubicacion = await getLocation(tractoInfo);
        if (!ubicacion) {
          continue;
        }
        let fechaUTC = ubicacion.tracto.LocalActualDate;
        let fecha = new Date(fechaUTC);

        const fechaFormateada = fecha
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        let datosUbicacion = {
          fecha: fechaFormateada,
          imei: ubicacion.imei,
          patente: ubicacion.patente,
          latitud: ubicacion.tracto.Lat,
          longitud: ubicacion.tracto.Lon,
          orientacion: gradosEnteros(ubicacion.tracto.Direction),
          velocidad: parseFloat(ubicacion.tracto.Speed),
          id_cliente_externo: process.env.CLIENTID,
        };
        enviarTracto(tokenBermann, datosUbicacion);
      }
      await delay(60000); // Espera 1 minuto antes del próximo envío
    }
    // Luego de una hora, vuelve a iniciar sesión para obtener un nuevo token
    tokenBermann = null;
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
