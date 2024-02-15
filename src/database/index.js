import mongoose from "mongoose";
import dotenv from "dotenv";
import xlsxPopulate from "xlsx-populate";
import Tracto from "../models/tracto.js";
import Empresa from "../models/empresa.js";
// Configura dotenv para cargar las variables de entorno desde el archivo .env
dotenv.config({ path: "./.env" });

// URL de conexión a la base de datos
const dbUrl = process.env.DB_URL;

// Opciones de configuración de la conexión (opcional)
const dbOptions = {
  // Otras opciones de configuración aquí...
};

// Función para conectarse a la base de datos
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, dbOptions);
    console.log("Conexión a la base de datos exitosa");
    //leer el archivo Listado Gps Transportes Ruiz.xlsx y guardar los datos en la base de datos
    const workbook = await xlsxPopulate.fromFileAsync(
      "/home/christian/Escritorio/appGPS/src/database/lista.xlsx"
    );
    const sheet = workbook.sheet("Listado");
    const rows = sheet.usedRange().value();

    const tractos = [];
    rows.forEach((tracto) => {
      //obviar la primera fila
      if (tracto[0] === "Patente") {
        return;
      }
      tractos.push({
        patente: tracto[0],
        imei: tracto[2],
      });
    });

    //Buscar los tractos que existen en la base de datos pertenecientes al imei
    let tractosAgregadosEmpresa = [];
    for (const tracto of tractos) {
      const tractoEncontrado = await Tracto.findOne({ imei: tracto.imei });
      //Si el tracto existe se agrega a la lista de tractos existentes
      if (tractoEncontrado) {
        tractosAgregadosEmpresa.push(tractoEncontrado);
      }
    }

    //Agregar la referencia del id de los tractos a la empresa
    const empresa = await Empresa.findOne({ nombre: "Construmart" });
    
    // Obtener los IDs de los tractos encontrados
    const tractosIds = tractosAgregadosEmpresa.map(tracto => tracto._id);

    // Actualizar la empresa para agregar los tractos a la lista
    await Empresa.updateOne(
      { _id: empresa._id },
      { $addToSet: { tractos: { $each: tractosIds } } }
    );

    //La posicion 0 la patente y la 2 el imei
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

// Exportar la instancia de Mongoose para su uso en otros archivos
export default {
  connectToDatabase,
};
