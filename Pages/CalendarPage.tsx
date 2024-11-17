import { useState } from "react";
import { Calendar } from "react-native-calendars";
import PopUpMenu from "../Shared/PopUpMenu";
import { StyleSheet, View } from "react-native";
import { RootStyles } from "../assets/RootStyles";
import Day from "react-native-calendars/src/calendar/day";

export default function CalendarPage() {
    const [selected, setSelected] = useState<string>('');

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day: any) => {
                    setSelected(day.dateString);
                }}
                markedDates={{
                    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange'},

                }}
                theme={{
                    todayTextColor: 'red',
                    selectedDayTextColor: RootStyles.secondaryTextColor,
                    selectedDayBackgroundColor: RootStyles.primaryBackground,
                    dayTextColor: RootStyles.primaryTextColor,
                    arrowColor: RootStyles.primaryBackground
                }}
            />
            <PopUpMenu
                size={50}
                color="white"
                buttons={[
                    { iconName: 'home', color: RootStyles.primaryBackground, onPress: () => console.log('Selected day is' + selected) },
                    { iconName: 'settings', color: RootStyles.primaryBackground, onPress: () => console.log('Settings clicked') },
                ]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    }
})