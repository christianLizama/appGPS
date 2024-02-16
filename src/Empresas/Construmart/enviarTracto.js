// EnviarDatos.js
import axios from 'axios';

async function enviarTracto(tracto) {
    try {
        const headers = {
            "Content-Type": "application/json",
        };
        const url = process.env.CONSTRUMART_URL;
        const response = await axios.post(url, tracto, { headers });
        
        if (response.status === 200) {
            console.log(`Tracto perteneciente a la patente: ${tracto[0].patente} enviado con éxito a Construmart a las ${new Date().toLocaleString()}`);   
        } else {
            console.log("Error al enviar los datos");
        }
    } catch (error) {
        console.error(`Error al realizar la solicitud: ${error.message}`);
    }
}

export default enviarTracto;
