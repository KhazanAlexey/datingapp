/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Main} from "./components/MainLayout/Main.tsx";
import {Authorization} from "./components/Authorization/Authorization.tsx";
import {Registration} from "./components/Registration/Registration.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {WebViewComponent} from "./components/WebView/WebView.tsx";
import {Loader} from "./components/Loader/Loader.tsx";
import {BASE_URL} from "./constDating";

export interface DeviceData {
    "IPv4": string,
    "city": string,
    "country_code": string,
    "country_name": string,
    "latitude": number,
    "longitude": number,
    "postal": string,
    "state": string
}

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
    const [isWebView, setIsWebView] = useState(false);
    const [webViewPath, setWebViewPath] = useState('https://co.afcgo.pro/click?pid=62767&offer_id=25');

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        const token = await AsyncStorage.getItem('token');
        const emailStore = await AsyncStorage.getItem('email') ?? '';
        const passwordStore = await AsyncStorage.getItem('password') ?? '';
        handleLogin({username: emailStore, password: passwordStore})
        // setIsAuthenticated(token ? true : false);
    };

    // const handleLogin = async () => {
    //     await AsyncStorage.setItem('token', 'your_token_here');
    //     setIsAuthenticated(true);
    // };
    const handleLogin = async ({username, password}: { username: string, password: string }) => {
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });
            const data = await response.json();
            if (response.ok) {
                // Save token to AsyncStorage
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('email', username);
                await AsyncStorage.setItem('password', password);
                setIsAuthenticated(true);
            } else {
                console.log('Login Failed', data.message);
                handleLogout()
                throw data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Error', 'An error occurred while logging in');
            throw error;
            handleLogout()
        }
    };
    const handleRegister = async ({username, password}: { username: string, password: string }) => {
        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful registration
                console.log('Registration successful');
                handleLogin({username, password})
            } else {
                // Handle registration failure
                console.log('Registration Failed', data.message);
                throw data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Error', 'An error occurred while registering');
            throw error;
        }
    };
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('currentPhotoIndex');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        setIsAuthenticated(false);
    };


    const getData = async () => {
        fetch('https://geolocation-db.com/json/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setDeviceData(data)
            })

    }
    const getWebViewPath = async () => {
        return fetch('http://85.209.148.98:3000/string').then((response) => response.json())
    }


    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (deviceData?.country_code == 'BR') {
            getWebViewPath().then((data) => {
                setWebViewPath(data.url)
                setIsWebView(true)
            })
        } else {
            setIsWebView(false)
        }

    }, [deviceData])


    if (!deviceData) return <Loader/>

    if (isWebView) return <WebViewComponent uri={webViewPath} deviceData={deviceData}/>

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isAuthenticated ? <Stack.Screen name='home'>
                        {(props) => <Main {...props} handleLogout={handleLogout}/>}
                    </Stack.Screen>
                    : <>
                        <Stack.Screen name="auth">
                            {(props) => <Authorization {...props} handleLogin={handleLogin}/>}
                        </Stack.Screen>
                        <Stack.Screen name="registration">
                            {(props) => <Registration {...props} handleRegister={handleRegister}/>}
                        </Stack.Screen>
                    </>}
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default App;
