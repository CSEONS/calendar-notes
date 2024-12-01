import AsyncStorage from "@react-native-async-storage/async-storage";

// Ключ для хранения данных
const STORAGE_KEY = "markedDates";

export const DotsType = {
    fail: { key: "fail", color: "red" },
    complete: { key: "complete", color: "green" },
    marked: { key: "marked", color: "orange" },
};

export type MarkedDates = Record<
    string,
    { dots: { color: string }[]; markText?: string }
>;

/**
 * Получение всех заметок
 * @returns {Promise<MarkedDates>} Все данные с заметками
 */
export const getAllNotes = async (): Promise<MarkedDates> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        return {};
    }
};

/**
 * Получение списка заметок в формате:
 * { [date]: { dots: [{ color: string }] } }
 * @returns {Promise<Record<string, { dots: { color: string }[] }>>}
 */
export const getNotesFormatted = async (): Promise<Record<string, { dots: { color: string }[] }>> => {
    try {
        const allNotes = await getAllNotes();
        const formattedNotes: Record<string, { dots: { color: string }[] }> = {};

        for (const [date, note] of Object.entries(allNotes)) {
            if (note.dots.length > 0) {
                formattedNotes[date] = { dots: note.dots };
            }
        }

        return formattedNotes;
    } catch (error) {
        console.error("Ошибка при форматировании заметок:", error);
        return {};
    }
};

/**
 * Удаление всех заметок на определённый день
 * @param {string} date - Дата в формате "YYYY-MM-DD"
 */
export const removeNotesByDate = async (date: string): Promise<void> => {
    try {
        const allNotes = await getAllNotes();
        delete allNotes[date];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes));
    } catch (error) {
        console.error("Ошибка при удалении заметок:", error);
    }
};

/**
 * Добавление заметки с оранжевой точкой и текстом
 * @param {string} date - Дата в формате "YYYY-MM-DD"
 * @param {string} text - Текст заметки
 */
export const addOrangeNote = async (date: string, text: string): Promise<void> => {
    try {
        const allNotes = await getAllNotes();
        const existing = allNotes[date] || { dots: [] };

        // Добавляем оранжевую точку, если её нет
        if (!existing.dots.some(dot => dot.color === DotsType.marked.color)) {
            existing.dots.push({ color: DotsType.marked.color });
        }

        existing.markText = text;
        allNotes[date] = existing;

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes));
    } catch (error) {
        console.error("Ошибка при добавлении заметки:", error);
    }

    console.log(JSON.stringify(await getAllNotes()));
    
};

/**
 * Добавление заметки с красной или зелёной точкой
 * @param {string} date - Дата в формате "YYYY-MM-DD"
 * @param {"red" | "green"} color - Цвет точки ("red" или "green")
 */
export const addRedOrGreenNote = async (date: string, color: "success" | "failure"): Promise<void> => {
    try {
        const allNotes = await getAllNotes();
        const existing = allNotes[date] || { dots: [] };

        // Убираем красную или зелёную точку, если она есть
        existing.dots = existing.dots.filter(
            dot => dot.color !== DotsType.fail.color && dot.color !== DotsType.complete.color
        );

        // Добавляем новую точку
        existing.dots.push({ color: color === "failure" ? DotsType.fail.color : DotsType.complete.color });

        allNotes[date] = existing;

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes));
    } catch (error) {
        console.error("Ошибка при добавлении заметки:", error);
    }
};