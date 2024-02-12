import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {type PropsWithChildren, useMemo, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BackgroundAnimation} from "../MainLayout/Main.tsx";
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';

export const Registration = (props: PropsWithChildren<{
    navigation: any,
    handleLogin: () => void
}>): React.JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: 'men', // acts as primary key, should be unique and non-empty string
            label: 'Men',
            value: 'men'
        },
        {
            id: 'woman',
            label: 'Woman',
            value: 'woman'
        }
    ]), []);
    const setSelectedIdHandler = (id:string) => {
        setSelectedId(id)
    }
    const onRegisterHandler = async () => {
        setError('')
        if (!email || !password||!selectedId) {
            setError('Enter email, password and gender')
            return
        }
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('gender', selectedId);
        await AsyncStorage.setItem('password', password);
        props.handleLogin()
    }


    return (
        <View style={styles.container}>
            <BackgroundAnimation/>
            <View style={{paddingTop: 150, paddingBottom: 5, justifyContent: 'flex-start', width: '70%'}}>
                <Text style={{textAlign: 'left', fontSize: 24, color: '#211E1E'}}>Regestration</Text>
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
            <View style={{ paddingBottom: 5, justifyContent: 'flex-start', width: '70%'}}>
                <Text style={{textAlign: 'left', fontSize: 15, color: '#211E1E'}}>Select your gender</Text>

            </View>
            <RadioGroup
                radioButtons={radioButtons}
                onPress={setSelectedIdHandler}
                selectedId={selectedId}
                layout='row'
            />
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
    forgot_button: {
        height: 30,
        marginBottom: 30,
    },
    registerBtn: {
        width: "70%",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,

        backgroundColor: "#C30F31",
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
    }
});
