import axios from "axios";
import { parseString } from "xml2js";
import Tracto from "../models/tracto.js";
import { EventEmitter } from 'events';

export const emitter = new EventEmitter();

export async function getLocation(empresa) {
  try {
    const patentes = await Tracto.find({ _id: { $in: empresa.tractos } });
    const securityToken = process.env.SECURITY_TOKEN;
    const gpsUrl = process.env.GPS_URL;

    if (patentes.length === 0) {
      console.log("No hay patentes registradas reintentando en 1 minuto");
      return;
    }

    const listaTractos = [];

    for (const patenteData of patentes) {
      const { imei, patente } = patenteData;

      const url = `${gpsUrl}?SecurityToken=${securityToken}&IMEI=${imei}`;

      try {
        const response = await axios.get(url);
        const xmlData = response.data;

        let jsonData;
        parseString(xmlData, { explicitArray: false }, (err, result) => {
          if (!err) {
            jsonData = result.string._; // Acceder directamente a la propiedad _
          } else {
            console.error("Error al parsear XML:", err);
          }
        });

        
        let tracto;
        parseString(jsonData, { explicitArray: false }, (err, result) => {
          if (err) {
            // console.error('Error al convertir XML a JSON:', err);
            return;
          }
          tracto = result;
        });

        const newTracto = {
            tracto: tracto.NewDataSet.Table,
            imei: imei,
            patente: patente,
        }
    
        listaTractos.push(newTracto);
      } catch (error) {
        console.error(`Error al obtener datos del tracto con IMEI ${imei}: ${error.message}`);
        // Puedes manejar el error de manera específica o simplemente seguir con el siguiente tracto
      }
    }

    return listaTractos;
  } catch (error) {
    console.error(`Error al obtener y enviar los datos: ${error.message}`);
    return []; // Retorna un array vacío en caso de error
  }
}

export default { getLocation, emitter };
