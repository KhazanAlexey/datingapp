import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {
    Animated,
    Button,
    Easing,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    useColorScheme,
    View,
} from 'react-native';
import {Colors,} from 'react-native/Libraries/NewAppScreen';
import {useRoute} from "@react-navigation/native";
import Svg, {Path} from "react-native-svg";
import {Loader} from "../Loader/Loader.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {fetchData} from "../../utils/fetchData.ts";

interface AllData {
    men: string[],
    woman: string[],
    menData: { name: string, description: string }[],
    womanData: { name: string, description: string }[],
}

export const Main = (props: PropsWithChildren<{
    navigation: any,
    handleLogout: () => void
}>): React.JSX.Element => {

    const route = useRoute();
    const isDarkMode = useColorScheme() === 'dark';
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [gender, setGender] = useState<'men' | 'woman'>('men');

    const [currentPhoto, setCurrentPhoto] = useState('');
    const [allData, setAllData] = useState<AllData | null>(null);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const getAllData = async () => {
        try {
            const data = await fetchData(`http://localhost:3000/photos/`);
            setAllData(data);
        } catch (error) {
            console.log(error)
        }
    }

    const getPhotoByName = async (name: string) => {
        fetch(`http://localhost:3000/photos/${gender}/${name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.url;
            })
            .then(data => {
                setCurrentPhoto(data)
            }).catch(e => {
            console.log(e)
        })

    }

    useEffect(() => {
        AsyncStorage.getItem('gender').then(data => {

            if (data) {
                const showGenderForUser = data === 'woman' ? 'men' : 'woman'
                setGender(showGenderForUser)
            }
        });
        AsyncStorage.getItem('currentPhotoIndex').then(data => {

            if (data) {
                setCurrentPhotoIndex(parseFloat(data))
            }
        });
        getAllData()

    }, [])

    const onLogout = () => {
        props.handleLogout()
    }

    useEffect(() => {
        if (allData && gender) {

            const currentPhotoName = allData[gender][currentPhotoIndex]

            currentPhotoName && getPhotoByName(currentPhotoName)

        }
    }, [currentPhotoIndex, allData, gender])

    const handleLike = () => {
        showNextPhoto();
    };

    const handleDislike = () => {
        showNextPhoto();
    };

    const showNextPhoto = async () => {
        setCurrentPhotoIndex(prevIndex => prevIndex + 1);
        try {
            await AsyncStorage.setItem('currentPhotoIndex', (currentPhotoIndex + 1).toString());
        } catch (e) {

        }
    };
    if (!allData || !allData[gender]) return <Loader/>

    return (
        <SafeAreaView style={[backgroundStyle]}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, styles.wrapper]}>
                <View style={styles.topBackground}>
                    <Text style={styles.textTop}>Like it or not</Text>
                </View>


                {allData[gender]?.length > 0 && currentPhotoIndex < allData[gender].length ? (
                    <View style={[styles.center, styles.mainPicture]}>
                        {currentPhoto && <Image source={{uri: currentPhoto}}
                                                style={{width: 250, height: 400, borderRadius: 20}}/>}
                        <View style={[styles.imageDescription, styles.transforms]}>
                            <View style={{
                                width: '100%',
                                borderRadius: 10,
                                overflow: 'hidden',
                                transform: [{scale: 0.9}]
                            }}>
                                <Text
                                    style={styles.imageDescriptionHeader}>{allData[`${gender}Data`][currentPhotoIndex].name}</Text>
                                <Text
                                    style={{display: 'flex'}}>{allData[`${gender}Data`][currentPhotoIndex].description}</Text>
                            </View>

                        </View>

                        <View style={styles.footerControlsWrapper}>
                            <TouchableHighlight style={styles.footerButton} onPress={handleLike}>
                                <Svg height="20" width="20"
                                     viewBox="0 0 512 512">
                                    <Path fill="#FD0E42"
                                          d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                                </Svg>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.footerButton} onPress={handleDislike}>
                                <Svg height="20" width="20"
                                     viewBox="0 0 512 512">
                                    <Path fill="#74C0FC"
                                          d="M119.4 44.1c23.3-3.9 46.8-1.9 68.6 5.3l49.8 77.5-75.4 75.4c-1.5 1.5-2.4 3.6-2.3 5.8s1 4.2 2.6 5.7l112 104c2.9 2.7 7.4 2.9 10.5 .3s3.8-7 1.7-10.4l-60.4-98.1 90.7-75.6c2.6-2.1 3.5-5.7 2.4-8.8L296.8 61.8c28.5-16.7 62.4-23.2 95.7-17.6C461.5 55.6 512 115.2 512 185.1v5.8c0 41.5-17.2 81.2-47.6 109.5L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9L47.6 300.4C17.2 272.1 0 232.4 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141z"/>
                                </Svg>
                            </TouchableHighlight>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.emptyPageWrapper]}>
                        <BackgroundAnimation/>
                        <View style={[styles.center, {paddingTop: 150}]}>
                            <Text style={styles.emptyPageMessage}>Wait for matches!!!
                            </Text>
                        </View>
                        <View style={[styles.center]}>
                            <Button
                                onPress={onLogout}
                                title="logout"
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    emptyPageWrapper: {
        height: 1000,
    },
    emptyPageMessage: {
        fontSize: 40,
        fontWeight: 'bold',

    },
    transforms: {
        transform: [
            {translateY: -50},
        ]
    },
    imageDescriptionHeader: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },

    imageDescription: {
        zIndex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: 250,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.17,
        shadowRadius: 2.54,
        elevation: 3
    },
    textTop: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        padding: 10
    },
    topBackground: {
        position: 'absolute',
        width: '100%',
        height: 300,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        backgroundColor: '#C30F31',
    },
    wrapper: {
        position: 'relative',
    },
    mainBackground: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: -1
    },
    animationLike: {},
    center: {
        alignItems: 'center',
    },

    mainPicture: {
        marginTop: 70,

    },
    footerControlsWrapper: {flexDirection: 'row', gap: 70,},
    footerButton: {
        padding: 20,
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 1,
    }
});
export const INPUT_RANGE_START = 0;
export const INPUT_RANGE_END = 1;
export const OUTPUT_RANGE_START = -281;
export const OUTPUT_RANGE_END = 0;
export const ANIMATION_TO_VALUE = 1;
export const ANIMATION_DURATION = 25000;

export function BackgroundAnimation() {
    const initialValue = 0;
    const translateValue = useRef(new Animated.Value(initialValue)).current;

    useEffect(() => {
        const translate = () => {
            translateValue.setValue(initialValue);
            Animated.timing(translateValue, {
                toValue: ANIMATION_TO_VALUE,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => translate());
        };

        translate();
    }, [translateValue]);

    const translateAnimation = translateValue.interpolate({
        inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
        outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
    });
    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);
    return (

        <AnimetedImage
            resizeMode="repeat"
            style={[stylesAnimBack.background, {
                transform: [
                    {
                        translateX: translateAnimation,
                    },
                    {
                        translateY: translateAnimation,
                    },
                ],
            }]}
            // source={require("https://pin.it/pqKUqjBFk")}
            source={{uri: 'data:image/png;base64,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'}}
            // src={'https://pin.it/pqKUqjBFk'}
        />

    )
}

const stylesAnimBack = StyleSheet.create({

    background: {
        position: 'absolute',
        width: 1200,
        height: 1200,
        top: 0,
        opacity: 0.2,
        transform: [
            {
                translateX: 0,
            },
            {
                translateY: 0,
            },
        ],
    },
})
