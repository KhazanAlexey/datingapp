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
        setIsAuthenticated(token ? true : false);
    };

    const handleLogin = async () => {
        await AsyncStorage.setItem('token', 'your_token_here');
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('gender');
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
                // console.log(data);
            })

    }
    const getWebViewPath = async () => {
       return fetch('http://localhost:3000/string').then((response) => response.json())
    }


    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (deviceData?.country_code == 'BR') {
            getWebViewPath().then((data)=>{
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
                        {(props) => <Main {...props}  handleLogout={handleLogout}/>}
                    </Stack.Screen>
                    : <>
                        <Stack.Screen name="auth">
                            {(props) => <Authorization {...props} handleLogin={handleLogin}/>}
                        </Stack.Screen>
                        <Stack.Screen name="registration">
                            {(props) => <Registration {...props} handleLogin={handleLogin}/>}
                        </Stack.Screen>
                    </>}
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default App;
