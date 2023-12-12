import mongoose from "mongoose";
import { Schema } from "mongoose";

const tractoSchema = new Schema({
  imei: {
    type: String,
    required: [true, 'imei obligatorio'],
  },
  patente: {
    type: String,
    required: [true, 'patente obligatoria'],
  },
});

//convertir a modelo de mongoose
const Tracto = mongoose.model("Tracto", tractoSchema);

export default Tracto;