import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MarkListPage() {
    const [markedDates, setMarkedDates] = useState<any>([]);
    
    // Загрузка данных
    useEffect(() => {
        const loadMarkedDates = async () => {
            const storedData = await AsyncStorage.getItem("markedDates");
            if (storedData) {
                const parsedData = JSON.parse(storedData);

                // Преобразуем объект в массив для сортировки
                const markedArray = Object.entries(parsedData).map(([date, data]: any) => ({
                    date,
                    dots: data.dots || []
                }));

                // Сортировка: сначала новые, потом старые
                markedArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setMarkedDates(markedArray);
            }
        };
        loadMarkedDates();

        console.log("ok")
    }, []);

    // Удаление даты
    const removeDate = async (date: string) => {
        setMarkedDates((prev: any) => {
            const updated = prev.filter((item: any) => item.date !== date);

            // Сохранение обновленных данных
            const updatedObject = Object.fromEntries(updated.map((item: any) => [item.date, { dots: item.dots }]));
            AsyncStorage.setItem("markedDates", JSON.stringify(updatedObject));

            return updated;
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={markedDates}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.dateText}>{item.date}</Text>
                        <Text style={styles.markerText}>
                            {item.dots.map((dot: any) => dot.color).join(", ")}
                        </Text>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => removeDate(item.date)}
                        >
                            <Text style={styles.deleteText}>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    dateText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    markerText: {
        fontSize: 14,
        color: "#555",
    },
    deleteButton: {
        padding: 8,
        backgroundColor: "red",
        borderRadius: 4,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
