import {obtenerDatosYEnviar} from './obtenerUbicacion.js'; // Importa tu función para obtener y enviar datos
import {login} from './login.js'; // Importa tu función de inicio de sesión

async function ejecutarCiclo() {
    let tokenBermann = null;

    // Ciclo eterno
    while (true) {
        // Intenta iniciar sesión si no tienes un token válido
        if (!tokenBermann) {

            const clientID = process.env.CLIENTID;
            const username = process.env.BERMANN_USERNAME;
            const password = process.env.PASSWORD;

            tokenBermann = await login(clientID, username, password); // Proporciona tus credenciales aquí
            if (!tokenBermann) {
                console.error('No se pudo iniciar sesión');
                return;
            }
        }

        // Envía datos cada minuto durante una hora (60 minutos)
        for (let i = 0; i < 60; i++) {
            await obtenerDatosYEnviar(tokenBermann);
            await delay(60000); // Espera 1 minuto antes del próximo envío
        }

        // Luego de una hora, vuelve a iniciar sesión para obtener un nuevo token
        tokenBermann = null;
    }
}

// Función para retrasar la ejecución
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default ejecutarCiclo;