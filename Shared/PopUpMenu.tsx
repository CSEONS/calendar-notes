import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStyles } from '../assets/RootStyles';

interface ButtonConfig {
    iconName: string;
    color: string;
    onPress: () => void;
}

interface PopUpMenuProps {
    size: number;
    color: string;
    buttons?: ButtonConfig[];
}

export default function PopUpMenu({ size, color, buttons = [] }: PopUpMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [animationValue] = useState(new Animated.Value(0)); // для анимации открытия/закрытия

    const toggleMenu = () => {
        if (isOpen) {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsOpen(false));
        } else {
            setIsOpen(true);
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    // Генерация вложенных кнопок
    const renderButtons = () => {
        return buttons.map((button, index) => {
            const translateY = animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60 * (index + 1)], // Расстояние между кнопками
            });

            return (
                <Animated.View
                    key={index}
                    style={[
                        styles.subButton,
                        {
                            transform: [{ translateY }],
                            opacity: animationValue,
                        },
                    ]}
                >
                    <Pressable onPress={button.onPress} style={[styles.circleButton, { backgroundColor: button.color }]}>
                        <Icon name={button.iconName} size={size / 2} color="#FFF" />
                    </Pressable>
                </Animated.View>
            );
        });
    };

    // Анимация поворота
    const rotateAnimation = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container}>
            {isOpen && renderButtons()}
            <Pressable
                onPress={toggleMenu}
                style={[
                    styles.mainButton,
                    {
                        width: size,
                        height: size,
                        backgroundColor: isOpen
                            ? RootStyles.secondaryBackground
                            : RootStyles.primaryBackground,
                    },
                ]}
            >
                <Animated.View style={{ transform: [{ rotate: rotateAnimation }] }}>
                    <Icon name="add" size={size} color={color} />
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        alignItems: 'center',
    },
    mainButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100, // для круга
    },
    subButton: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
});
