// EnviarDatos.js
import axios from 'axios';

async function enviarTracto(token, datos) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        const url = process.env.BERMANN_URL + '/data/insert';
        const response = await axios.post(url, datos, { headers });

        if (response.status === 200) {
            const patente = datos.patente;
            console.log(`Tracto perteneciente a la patente: ${patente} enviado con éxito a Bermann`);
        } else {
            console.log("Error al enviar los datos");
        }
    } catch (error) {
        console.error(`Error al realizar la solicitud: ${error.message}`);
    }
}

export default enviarTracto;
