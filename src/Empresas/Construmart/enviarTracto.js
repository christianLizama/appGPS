// EnviarDatos.js
import axios from 'axios';

async function enviarTracto(datos) {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        const url = process.env.CONSTRUMART_URL;
        const response = await axios.post(url, datos, { headers });

        if (response.status === 200) {
            const patente = datos.patente;
            console.log(`Tracto perteneciente a la patente: ${patente} enviado con éxito a Construmart`); 
        } else {
            console.log("Error al enviar los datos");
        }
    } catch (error) {
        console.error(`Error al realizar la solicitud: ${error.message}`);
    }
}

export default enviarTracto;
