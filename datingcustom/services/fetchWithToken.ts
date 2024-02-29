import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL} from "../constDating";


// Function to perform API requests with token authorization
export const fetchWithToken = async (
    endpoint: string,
    method: string = 'GET',
    body: any = null
): Promise<any> => {
    try {
        // Get token from AsyncStorage
        const token: string | null = await AsyncStorage.getItem('token');

        // Set up headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Add token to headers if available
        if (token) {
            headers['authorization'] = token;
        }

        // Set up fetch options
        const options: RequestInit = {
            method,
            headers,
        };

        // Add request body if present
        if (body) {
            options.body = JSON.stringify(body);
        }

        // Perform fetch
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        // const data = await response.json();
        const data = response;
        // Handle unauthorized response (e.g., token expired)
        if (response.status === 401) {
            // Handle token expiration or invalid token
            // Redirect to login screen or perform token refresh
            // Clear token from AsyncStorage
            await AsyncStorage.removeItem('token');
            // Handle redirection or refresh logic
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

