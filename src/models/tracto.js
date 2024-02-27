import mongoose from "mongoose";
import { Schema } from "mongoose";

const tractoSchema = new Schema({
  imei: {
    type: String,
    required: [true, 'imei obligatorio'],
    unique: true,
  },
  patente: {
    type: String,
    required: [true, 'patente obligatoria'],
  },
  idSimpli: {
    type: String,
  },
  socioSimpli: {
    type: String,
  },
});

//convertir a modelo de mongoose
const Tracto = mongoose.model("Tracto", tractoSchema);

export default Tracto;