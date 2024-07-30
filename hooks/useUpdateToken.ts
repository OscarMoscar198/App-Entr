// hook para obtener el token de autorización almacenado en AsyncStorage
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const useUpdateToken = () => {
    const [token, setToken] = useState<string | null>(null);
    
    const updateToken = async () => {
        try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            const token = parsedUser.data.token;
            setToken(token);
        }
        } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        }
    };
    
    return { token, updateToken };
}