import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStyles } from "../assets/RootStyles";

// Ключ для хранения данных
const STORAGE_KEY = "markedDates";

/**
 * Загружает данные из AsyncStorage
 * @returns {Promise<any>} Объект с отмеченными датами или пустой объект
 */
export const loadMarkedDates = async (): Promise<any> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
        console.error("Ошибка при загрузке данных из AsyncStorage:", error);
        return {};
    }
};

/**
 * Сохраняет данные в AsyncStorage
 * @param {any} date - Объект с отмеченными датами
 * @returns {Promise<void>}
 */
export const saveMarkedDates = async (date: string, dateType: DateType, markText?: string): Promise<void> => {

    try {
        let dotColor: string = 'black'

        switch (dateType) {
            case DateType.Complete:
                markText = 'complete';
                dotColor = RootStyles.completeDotColor;
                break;
            case DateType.Fail:
                markText = 'fail'
                dotColor = RootStyles.failDotColor;
                break
            case DateType.Marked:
                dotColor = RootStyles.markDotColor;
                break;
            default:
                console.error("DateType selceted exception");
                break;
        }

        const mark = {
            [date]: {
                selected: false,
                dotColor: dotColor,
                markText: markText
            }
        }

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(markText));
        console.log(mark)
    } catch (error) {
        console.error("Ошибка при сохранении данных в AsyncStorage:", error);
    }
};

export enum DateType {
    Complete = 0,
    Fail = 1,
    Marked = 2
}
