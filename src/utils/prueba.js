// En utils.js
import { EventEmitter } from 'events';
export const eventEmitter = new EventEmitter();

export function enviarDatosPeriodicamente() {
  setInterval(() => {
    const logMessage = 'Datos enviados periódicamente';
    //console.log(logMessage);
    eventEmitter.emit('log', logMessage);
  }, 1000); // Envía datos cada 5 segundos (puedes ajustar el intervalo según sea necesario)
}

export default { enviarDatosPeriodicamente, eventEmitter };
