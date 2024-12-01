import React, { useEffect, useReducer, useState } from "react";
import { Calendar } from "react-native-calendars";
import PopUpMenu from "../Shared/PopUpMenu";
import { StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import { RootStyles } from "../assets/RootStyles";
import { format } from "date-fns";
import { addOrangeNote, addRedOrGreenNote, removeNotesByDate, getNotesFormatted, MarkedDates } from "../services/storageService";
import { StatusBar } from "expo-status-bar";

export default function CalendarPage() {
    const today = format(new Date(), "yyyy-MM-dd");
    const [selected, setSelected] = useState<string>(today);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<"text" | "options" | "delete" | null>(null);
    const [textInputValue, setTextInputValue] = useState<string>("");
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    // Загружаем данные при монтировании и обновлении
    useEffect(() => {
        refreshMarkedDates();
    }, []);

    const refreshMarkedDates = async () => {
        const dates = await getNotesFormatted();
        setMarkedDates(dates);
    };

    const handleModalSave = async () => {
        await addOrangeNote(selected, textInputValue);
        await refreshMarkedDates();
        setModalVisible(false);
        setTextInputValue("");
    };

    const handleDeleteNote = async () => {
        await removeNotesByDate(selected);
        await refreshMarkedDates();
        setModalVisible(false);
    };

    const markSuccess = async () => {
        await addRedOrGreenNote(selected, "success");
        await refreshMarkedDates();
        setModalVisible(false);
    };

    const markFailure = async () => {
        await addRedOrGreenNote(selected, "failure");
        await refreshMarkedDates();
        setModalVisible(false);
    };

    const formattedMarkedDates = Object.entries(markedDates).reduce((acc, [date, data]) => {
        acc[date] = {
            dots: data.dots || [],
            selected: selected === date,
            selectedColor: selected === date ? RootStyles.primaryBackground : undefined,
        };
        return acc;
    }, {} as Record<string, any>);

    return (
        <View style={styles.container}>
            <Calendar
                initialDate={today}
                onDayPress={(day: any) => {
                    setSelected(day.dateString);
                }}
                markingType="multi-dot"
                markedDates={{
                    ...formattedMarkedDates,
                    [selected]: {
                        ...(formattedMarkedDates[selected] || {}),
                        selected: true,
                        selectedColor: RootStyles.primaryBackground,
                    },
                }}
                theme={{
                    todayTextColor: RootStyles.primaryBackground,
                    selectedDayTextColor: RootStyles.secondaryTextColor,
                    selectedDayBackgroundColor: RootStyles.primaryBackground,
                    dayTextColor: RootStyles.primaryTextColor,
                    arrowColor: RootStyles.primaryBackground,
                }}
            />

            <PopUpMenu
                size={50}
                color="white"
                buttons={[
                    {
                        iconName: "pencil",
                        color: RootStyles.primaryBackground,
                        onPress: () => {
                            setModalContent("text");
                            setModalVisible(true);
                        },
                    },
                    {
                        iconName: "bookmarks-outline",
                        color: RootStyles.primaryBackground,
                        onPress: () => {
                            setModalContent("options");
                            setModalVisible(true);
                        },
                    },
                    {
                        iconName: "trash-outline",
                        color: RootStyles.primaryBackground,
                        onPress: () => {
                            setModalContent("delete");
                            setModalVisible(true);
                        },
                    },
                ]}
            />

            <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.5)" />
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.overlayTouchContaner}
                        activeOpacity={1}
                        onPressOut={() => {
                            setModalVisible(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            {modalContent === "text" && (
                                <>
                                    <Text style={styles.modalTitle}>Введите текст</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={textInputValue}
                                        onChangeText={setTextInputValue}
                                        placeholder="Введите заметку..."
                                    />
                                    <View style={styles.horizontalButtons}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.saveButton]}
                                            onPress={handleModalSave}
                                        >
                                            <Text style={styles.buttonText}>Сохранить</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, styles.cancelButton]}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text style={styles.buttonText}>Отменить</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                            {modalContent === "options" && (
                                <>
                                    <Text style={styles.modalTitle}>Отметка</Text>
                                    <View style={styles.horizontalButtons}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.saveButton]}
                                            onPress={markSuccess}
                                        >
                                            <Text style={styles.buttonText}>Успех</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, styles.cancelButton]}
                                            onPress={markFailure}
                                        >
                                            <Text style={styles.buttonText}>Провал</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.horizontalButtons}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.cancelButton]}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text style={styles.buttonText}>Отмена</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                            {modalContent === "delete" && (
                                <>
                                    <Text style={styles.modalTitle}>Удалить метку</Text>
                                    <Text style={styles.modalTitle}>{selected}</Text>
                                    <View style={styles.horizontalButtons}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.saveButton]}
                                            onPress={handleDeleteNote}
                                        >
                                            <Text style={styles.buttonText}>Да</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, styles.cancelButton]}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text style={styles.buttonText}>Нет</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    overlayTouchContaner: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: "100%",
    },
    horizontalButtons: {
        marginVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: RootStyles.primaryBackground,
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
