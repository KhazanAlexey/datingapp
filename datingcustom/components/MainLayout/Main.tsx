import React, {PropsWithChildren, useState} from 'react';
import {
    Animated,
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import {Colors,} from 'react-native/Libraries/NewAppScreen';
import {useRoute} from "@react-navigation/native";

export const Main = (props: PropsWithChildren<{
    photos: any[],
    navigation: any,
    handleLogout: () => void
}>): React.JSX.Element => {
    const route = useRoute();
    const isDarkMode = useColorScheme() === 'dark';
    const [count, setCount] = useState(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const onLogout = () => {
        props.handleLogout()
    }

    const handleLike = () => {
        // Logic to handle liking the current photo
        // Here you can implement functionality to store likes, update state, etc.
        // For now, let's just move to the next photo
        showNextPhoto();
    };

    const handleDislike = () => {
        // Logic to handle disliking the current photo
        // Here you can implement functionality to store dislikes, update state, etc.
        // For now, let's just move to the next photo
        showNextPhoto();
    };

    const showNextPhoto = () => {
        // Move to the next photo
        setCurrentPhotoIndex(currentPhotoIndex + 1);
    };
    return (
        <SafeAreaView style={[backgroundStyle]}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, styles.wrapper]}>
                {/*<View style={styles.inner}>*/}


                    {/*<BackgroundAnimation/>*/}

                    {props.photos.length > 0 && currentPhotoIndex < props.photos.length ? (
                        <View style={[styles.center, styles.mainPicture]}>
                            <Image source={props.photos[currentPhotoIndex].url} style={{width: 200, height: 200}}/>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Button title="Like" onPress={handleLike}/>
                                <Button title="Dislike" onPress={handleDislike}/>
                            </View>
                        </View>
                    ) : (
                        <Text>No more photos to show!</Text>
                    )}
                    <View style={[styles.center]}>
                        <Button
                            onPress={onLogout}
                            title="logout"
                        />
                    </View>
                    {/*<View style={styles.mainBackground}>*/}

                    {/*</View>*/}
                {/*</View>*/}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({


    wrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'red',
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
    containerButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10
    },
    mainPicture: {
        marginTop: 30,
        // height: 300,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});
// export const INPUT_RANGE_START = 0;
// export const INPUT_RANGE_END = 1;
// export const OUTPUT_RANGE_START = -281;
// export const OUTPUT_RANGE_END = 0;
// export const ANIMATION_TO_VALUE = 1;
// export const ANIMATION_DURATION = 25000;
//
// function BackgroundAnimation() {
//     const initialValue = 0;
//     const translateValue = useRef(new Animated.Value(initialValue)).current;
//
//     useEffect(() => {
//         const translate = () => {
//             translateValue.setValue(initialValue);
//             Animated.timing(translateValue, {
//                 toValue: ANIMATION_TO_VALUE,
//                 duration: ANIMATION_DURATION,
//                 easing: Easing.linear,
//                 useNativeDriver: true,
//             }).start(() => translate());
//         };
//
//         translate();
//     }, [translateValue]);
//
//     const translateAnimation = translateValue.interpolate({
//         inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
//         outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
//     });
//     const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);
//     return (
//
//         <AnimetedImage
//             resizeMode="repeat"
//             style={[stylesAnimBack.background, {
//                 transform: [
//                     {
//                         translateX: translateAnimation,
//                     },
//                     {
//                         translateY: translateAnimation,
//                     },
//                 ],
//             }]}
//             source={require("../../assets/image/pers1.png")}/>
//
//     )
// }
//
// const stylesAnimBack = StyleSheet.create({
//
//     background: {
//         position: 'absolute',
//         width: 1200,
//         height: 1200,
//         top: 0,
//         opacity: 0.2,
//         transform: [
//             {
//                 translateX: 0,
//             },
//             {
//                 translateY: 0,
//             },
//         ],
//     },
// })
