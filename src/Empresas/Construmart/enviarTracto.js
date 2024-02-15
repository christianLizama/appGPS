// EnviarDatos.js
import axios from 'axios';

async function enviarTracto(lote) {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        const url = process.env.CONSTRUMART_URL;
        const response = await axios.post(url, lote, { headers });
        console.log(response.data);
        if (response.status === 200) {
            lote.forEach(tracto => {
                console.log(`Tracto perteneciente a la patente: ${tracto.patente} enviado con éxito a Construmart`);   
            });
            console.log("Tractos enviados con éxito a Construmart con fecha " + new Date().toLocaleString());
        } else {
            console.log("Error al enviar los datos");
        }
    } catch (error) {
        console.error(`Error al realizar la solicitud: ${error.message}`);
    }
}

export default enviarTracto;
