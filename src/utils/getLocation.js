import axios from "axios";
import { parseString } from "xml2js";

export async function getLocation(tracto) {
  const securityToken = process.env.SECURITY_TOKEN;
  const gpsUrl = process.env.GPS_URL;

  const { imei, patente } = tracto;

  const url = `${gpsUrl}?SecurityToken=${securityToken}&IMEI=${imei}`;

  try {
    const response = await axios.get(url, { timeout: 2000 });
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
    };

    // console.log(newTracto);

    return newTracto;
  } catch (error) {
    return
  }
}

export default { getLocation };
