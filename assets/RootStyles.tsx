import { StyleSheet, Platform, StatusBar } from "react-native";


export const RootStyles = {
    primaryTextColor: '#000000',
    secondaryTextColor: '#FFFFFF',
    primaryBackground: '#4267B2',
    secondaryBackground: '898F9C',
    completeDotColor: 'green',
    failDotColor: 'red',
    markDotColor: 'orange',
    androidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
}