import mongoose from "mongoose";
import { Schema } from "mongoose";

const empresaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'nombre obligatorio'],
    },
    rut: {
        type: String,
        required: [true, 'rut obligatorio'],
        unique: true,
    },
    tractos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tracto',
        }
    ],
});

//convertir a modelo de mongoose
const empresa = mongoose.model("Empresa", empresaSchema);

export default empresa;

