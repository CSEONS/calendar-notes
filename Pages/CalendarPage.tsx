import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import PopUpMenu from "../Shared/PopUpMenu";
import { StyleSheet, View } from "react-native";
import { RootStyles } from "../assets/RootStyles";
import { format } from 'date-fns';
import {DateType, loadMarkedDates, saveMarkedDates} from '../services/storageService'
import Day from "react-native-calendars/src/calendar/day";

export default function CalendarPage() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const [selected, setSelected] = useState<string>(today);
    const [markedDates, setMarkedDates] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            const dates = await loadMarkedDates();
            setMarkedDates(dates)
        }
        
        fetchData();
    }, []);
    
    

    return (
        <View style={styles.container}>
            <Calendar
                initialDate={today}
                onDayPress={(day: any) => {
                    setSelected(day.dateString);
                }}
                markedDates={{
                    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange'},
                    markedDates,
                    today
                }}
                theme={{
                    todayTextColor: RootStyles.primaryBackground,
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
                    { iconName: 'checkmark-outline', color: RootStyles.primaryBackground, onPress: () => saveMarkedDates(selected, DateType.Complete) },
                    { iconName: 'close-outline', color: RootStyles.primaryBackground, onPress: () => saveMarkedDates(selected, DateType.Fail) },
                    { iconName: 'list-outline', color: RootStyles.primaryBackground, onPress: () => saveMarkedDates(selected, DateType.Marked, 'Some text') },
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