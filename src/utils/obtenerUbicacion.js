import axios from "axios";
import { parseString } from "xml2js";
import Tracto from "../models/tracto.js";
import enviarTracto from './enviarTracto.js';
import { EventEmitter } from 'events';
export const emitter = new EventEmitter();

export async function obtenerDatosYEnviar(tokenBermann) {
  try {
    const patentes = await Tracto.find();
    const securityToken = process.env.SECURITY_TOKEN;
    const gpsUrl = process.env.GPS_URL;

    if (patentes.length === 0) {
      console.log("No hay patentes registradas reintentando en 1 minuto");
      return;
    }

    for (const patenteData of patentes) {
      const { imei, patente } = patenteData;

      const url = `${gpsUrl}?SecurityToken=${securityToken}&IMEI=${imei}`;

      const response = await axios.get(url);
      const xmlData = response.data;
      // console.log(xmlData);


      let jsonData;
      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (!err) {
          jsonData = result.string._; // Acceder directamente a la propiedad _
        } else {
          console.error("Error al parsear XML:", err);
        }
      });

      let tracto;
      parseString(jsonData,{explicitArray:false} ,(err, result) => {
        if (err) {
          console.error('Error al convertir XML a JSON:', err);
          return;
        }
        tracto = result;
      });
     
      let fechaUTC = tracto.NewDataSet.Table.LocalActualDate;
      let fecha = new Date(fechaUTC);
      
      const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');
      let datosUbicacion = {
        "fecha" : fechaFormateada,
        "imei" : imei,
        "patente" : patente,
        "latitud" : tracto.NewDataSet.Table.Lat,
        "longitud" : tracto.NewDataSet.Table.Lon,
        "orientacion" : gradosEnteros(tracto.NewDataSet.Table.Direction),
        "velocidad" : parseFloat(tracto.NewDataSet.Table.Speed),
        "id_cliente_externo" : process.env.CLIENTID,
      } 

      console.log(datosUbicacion);
      await enviarTracto(tokenBermann, datosUbicacion);
    }
  } catch (error) {
    console.error(`Error al obtener y enviar los datos: ${error.message}`);
  }
}

function gradosEnteros(grados){
  const angulo = parseFloat(grados);
  if(!isNaN(angulo)){
    const radianes = Math.floor(angulo);
    return radianes;
  }
  else{
    return 0;
  }
}

export default {obtenerDatosYEnviar, emitter};
