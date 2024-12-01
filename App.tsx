import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MarkListPage from "./Pages/MarkListPage";
import CalendarPage from "./Pages/CalendarPage";
import { RootStyles } from "./assets/RootStyles";
import Icon from "react-native-vector-icons/Ionicons"; // Импорт иконок

const Tab = createBottomTabNavigator();

export default function App() {
  const [key, setKey] = useState(0);

  // Функция для обновления ключа, перезагружает экраны
  const reloadScreens = () => setKey((prevKey) => prevKey + 1);

  return (
    <SafeAreaView style={RootStyles.androidSafeArea}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false, // Отключаем верхний заголовок
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string = "";

              if (route.name === "Календарь") {
                iconName = focused ? "calendar" : "calendar-outline";
              } else if (route.name === "Список") {
                iconName = focused ? "list" : "list-outline";
              }

              // Возвращаем компонент иконки
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: RootStyles.primaryBackground, // Цвет активной вкладки
            tabBarInactiveTintColor: RootStyles.secondaryBackground, // Цвет неактивной вкладки
          })}
        >
          <Tab.Screen
            name="Календарь"
            children={() => <CalendarPage key={key} />}
            listeners={{
              focus: reloadScreens,
            }}
          />
          <Tab.Screen
            name="Список"
            children={() => <MarkListPage key={key} />}
            listeners={{
              focus: reloadScreens,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});