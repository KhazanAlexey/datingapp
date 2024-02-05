import {Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {type PropsWithChildren, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const Registration = (props: PropsWithChildren<{
    navigation: any,
    handleLogin: () => void
}>): React.JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onRegisterHandler = async () => {
        setError('')
        if(!email || !password){
            setError('Enter email and password')
            return
        }
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        props.handleLogin()
        // props.navigation.navigate('auth')
    }


    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../../assets/image/povar.jpg")}/>
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
            {/*<TouchableOpacity>*/}
            {/*    <Text style={styles.forgot_button}>Forgot Password?</Text>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity onPress={onRegisterHandler} style={styles.registerBtn}>
                <Text style={styles.loginText}>Register</Text>
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
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginBottom: 40,
    },
    inputView: {
        backgroundColor: "#10c91a",
        borderRadius: 30,
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
    forgot_button: {
        height: 30,
        marginBottom: 30,
    },
    registerBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#FF1493",
    },
    loginText: {
        color: "black",
        fontWeight: "bold",
    }
});
