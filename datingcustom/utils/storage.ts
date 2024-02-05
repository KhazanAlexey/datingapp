import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // saving error
    }
};
export const setValue = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
    }
};
export const getData = async <T>(key: string): Promise<T | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        return null; // Need to return a value to match the function's return type
    }
};
export const getValue = async (key:string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
           return value// value previously stored
        }
    } catch (e) {
        // error reading value
    }
};
export const removeValue = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        // remove error
    }

};
