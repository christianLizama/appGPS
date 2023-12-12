import Tracto from "../models/tracto.js";
import mongoose from '../database/index.js';


// Agregar un nuevo tracto
export const addTracto = async (req, res) => {
    try {
        console.log(req.body);
        const { imei, patente } = req.body;
        const tracto = new Tracto({ imei, patente });
        const tractoNuevo = await tracto.save();
        res.status(201).json({ message: 'Tracto agregado exitosamente', tracto: tractoNuevo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los tractos
export const getTractos = async (req, res) => {
    try {
        const tractos = await Tracto.find();
        res.status(200).json(tractos);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
