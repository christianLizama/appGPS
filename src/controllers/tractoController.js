import Tracto from "../models/tracto.js";
import xlsxPopulate from "xlsx-populate";

// Agregar un nuevo tracto
export const addTracto = async (req, res) => {
  try {
    console.log(req.body);
    const { imei, patente } = req.body;
    const tracto = new Tracto({ imei, patente });
    const tractoNuevo = await tracto.save();
    res
      .status(201)
      .json({ message: "Tracto agregado exitosamente", tracto: tractoNuevo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMultipleTractos = async (req, res) => {
  try {
    const tractos = req.body;

    // Filtrar tractores que no existen en la base de datos
    const tractosNoexistentes = [];
    for (const tracto of tractos) {
      const existingTractor = await Tracto.findOne({ imei: tracto.imei });
      if (!existingTractor) {
        tractosNoexistentes.push(tracto);
      }
    }

    // Insertar solo los tractores que no existen
    const tractosNuevos = await Tracto.insertMany(tractosNoexistentes);

    res.status(201).json({ message: "Tractos agregados exitosamente", tractos: tractosNuevos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Obtener todos los tractos
export const getTractos = async (req, res) => {
  try {
    const tractos = await Tracto.find();
    res.status(200).json(tractos);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Agregar los tractos desde un archivo excel
export const addTractosFromExcel = async (req, res) => {
  try {
    console.log(req.file);
    // Lee el archivo Excel sin guardarlo
    const workbook = XLSX.readFile(req.file.path);
    const empresa = req.empresa;

    // Puedes hacer operaciones adicionales con el archivo aquí

    // Envía una respuesta al cliente
    res.send("Archivo recibido y procesado");
    console.log(tractosData);
    //const tractosNuevos = await Tracto.insertMany(tractosData);
    //res.status(201).json({ message: 'Tractos agregados exitosamente', tractos: tractosNuevos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
