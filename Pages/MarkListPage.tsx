import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { getAllNotes, removeNotesByDate, DotsType } from "../services/storageService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ListItem {
    date: string;
    color: string; // Цвет точки
    text: string; // Текст события (если есть)
}

export default function MarkListPage() {
    const [items, setItems] = useState<ListItem[]>([]);

    // Загружаем данные из AsyncStorage при загрузке компонента
    useEffect(() => {
        const fetchData = async () => {
            const allNotes = await getAllNotes();
            const listItems: ListItem[] = Object.entries(allNotes)
                .flatMap(([date, data]) =>
                    data.dots.map((dot, index) => ({
                        date,
                        color: dot.color,
                        text: data.markText || `Событие ${index + 1}`,
                    }))
                )
                .filter((item) => item.color === "orange"); // Фильтруем только оранжевые метки
    
            setItems(listItems);
    
            console.log(listItems);
        };
    
        fetchData();
    }, []);
    

    // Удаление элемента
    const removeItem = async (itemToRemove: ListItem) => {
        try {
            // Удаляем точку из локального состояния
            setItems((prevItems) =>
                prevItems.filter((item) => !(item.date === itemToRemove.date && item.color === itemToRemove.color))
            );

            // Удаляем точку из AsyncStorage
            const allNotes = await getAllNotes();

            if (allNotes[itemToRemove.date]) {
                // Фильтруем точки, удаляя точку с совпадающим цветом
                allNotes[itemToRemove.date].dots = allNotes[itemToRemove.date].dots.filter(
                    (dot) => dot.color !== itemToRemove.color
                );

                // Если больше нет точек на эту дату, удаляем запись полностью
                if (allNotes[itemToRemove.date].dots.length === 0) {
                    await removeNotesByDate(itemToRemove.date);
                } else {
                    // Обновляем данные с оставшимися точками
                    await AsyncStorage.setItem("markedDates", JSON.stringify(allNotes));
                }
            }
        } catch (error) {
            console.error("Ошибка при удалении элемента:", error);
        }
    };

    // Группируем элементы по дате для рендера
    const groupedItems = items.reduce<Record<string, ListItem[]>>((acc, item) => {
        acc[item.date] = acc[item.date] || [];
        acc[item.date].push(item);
        return acc;
    }, {});

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {Object.keys(groupedItems).map((date) => (
                <View key={date} style={styles.dateSection}>
                    <Text style={styles.dateHeader}>{date}</Text>
                    {groupedItems[date].map((item, index) => (
                        <View key={index} style={styles.listItem}>
                            <View style={[styles.status, { backgroundColor: item.color }]} />
                            <Text style={styles.text}>{item.text}</Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => removeItem(item)}
                            >
                                <Text>Удалить</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f0f2f5",
    },
    dateSection: {
        marginBottom: 20,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dateHeader: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
        color: "#333",
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    status: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    text: {
        flexGrow: 1,
    },
    deleteButton: {
        backgroundColor: "#e9ecef",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
});
