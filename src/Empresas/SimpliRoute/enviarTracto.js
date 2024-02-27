// EnviarDatos.js
import axios from 'axios';

async function enviarTracto(datos,patente) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `ApiKey ${process.env.SIMPLIRROUTE_API_KEY}`
        };

        const url = process.env.SIMPLIROUTE_URL;
        const response = await axios.post(url, datos, { headers });
        // Imprimir la respuesta en ambos casos (éxito o error)

        if (response.status === 200) {
            console.log(`Tracto perteneciente a la patente: ${patente} enviado con éxito a SimpliRoute ${new Date().toLocaleString()}`);
        }
        //     console.log("Error al enviar los datos");
        // }
    } catch (error) {
        console.error(`Tracto perteneciente a la patente: ${patente}, Error en la respuesta: ${error.response.data.message}`);
    }
}

export default enviarTracto;
