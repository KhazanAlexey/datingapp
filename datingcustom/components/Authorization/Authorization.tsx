import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";

import React, {type PropsWithChildren, useState} from "react";
import {BackgroundAnimation} from "../MainLayout/Main.tsx";

export const Authorization = (props: PropsWithChildren<{
    navigation: any,
    handleLogin: ({ username, password }: { username: string, password: string }) => Promise<any>
}>): React.JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onLogin = async () => {
        setError('')
        // const emailStore = await AsyncStorage.getItem('email');
        // const passwordStore = await AsyncStorage.getItem('password');
        if (email && password ) {
            props.handleLogin({ username:email, password }).catch(e=>setError(e))
        } else {
            setError('Empty email or password')
        }
    }
    const onRegister = () => {
        props.navigation.navigate('registration')
    }

    return (
        <View style={styles.container}>
            <BackgroundAnimation/>

            <View style={{paddingTop: 150,paddingBottom: 5, justifyContent: 'flex-start',width: '70%' }}>

                <Text style={{textAlign: 'left', fontSize: 24,color: '#211E1E'}}>Log In</Text>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email."
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <TouchableOpacity>
                <Text onPress={onRegister} style={styles.register_button}>Register now!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogin} style={styles.loginBtn}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <View style={[styles.container]}>
                {error && <Text style={{color: 'red'}}>{error}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginBottom: 40,
    },
    inputView: {
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#BAC3D5",
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        width: "100%",
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    register_button: {
        height: 30,
        marginBottom: 30,
        textDecorationLine: 'underline'
    },
    loginBtn: {
        width: "70%",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#C30F31",
    },
    loginText: {
        color: "black",
        fontWeight: "bold",
    }
});
