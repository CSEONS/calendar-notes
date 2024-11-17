import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CalendarPage from './Pages/CalendarPage';
import { RootStyles } from './assets/RootStyles';

export default function App() {
    return (
        <SafeAreaView style={RootStyles.androidSafeArea}>
            <View style={styles.container}>
                <CalendarPage></CalendarPage>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
    },
});
