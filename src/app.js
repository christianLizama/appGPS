import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // Importa 'http' para crear el servidor
import ejecutarCiclo from "./utils/cicloEnvioDatos.js";
import { Server as SocketServer } from "socket.io"; // Importa 'Server' de 'socket.io'

import { eventEmitter, enviarDatosPeriodicamente } from "./utils/prueba.js";

import router from "./routes/index.js";
import tractoRouter from "./routes/tracto.js";

dotenv.config({ path: "./src/.env" });

const app = express();
const port = process.env.PORT_SERVER || 3030;

const server = http.createServer(app); // Crea el servidor HTTP

// Crea el servidor de Socket.io utilizando el servidor HTTP existente
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Cambia esto por tu dominio o '*'
  },
});

app.use(cors());
app.use(express.json());

app.use("/", router);
app.use("/tracto", tractoRouter);

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");
  eventEmitter.on("log", (msg) => {
    console.log(msg);
  });
});

const appURL = `http://localhost:${port}/`;

server.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
  console.log(`Visita ${appURL} para ver la aplicación.`);
});

ejecutarCiclo().catch((error) => {
  console.error("Error en el ciclo principal:", error);
});

// Enviar datos cada 5 segundos
enviarDatosPeriodicamente();