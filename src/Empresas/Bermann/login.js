import axios from 'axios';
import { EventEmitter } from 'events';
export const emitter = new EventEmitter();

export async function login(clientID, username, password) {
    try {
        const body = {
            "id_cliente_externo": clientID,
            "nombre_usuario": username,
            "password_usuario": password
        };

        const url = process.env.BERMANN_URL + "/auth";
        const response = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.status === 201) {
            console.log("Inicio de sesión en Bermann exitoso obteniendo token");
            const { access_token } = response.data;
            return access_token;
        } else {
            console.log("Inicio de sesión fallido");
            return null;
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error.message);
        return null;
    }
}

export default {login, emitter};
