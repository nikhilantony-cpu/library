import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Animated, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { COLORS } from '../components/theme';
import { Ionicons } from '@expo/vector-icons';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';

// Student Screens
import StudentDashboard from '../screens/student/StudentDashboard';
import StudentBooksScreen from '../screens/student/StudentBooksScreen';
import BookDetailScreen from '../screens/student/BookDetailScreen';
import MyBooksScreen from '../screens/student/MyBooksScreen';
import HistoryScreen from '../screens/student/HistoryScreen';

// Librarian Screens
import LibrarianDashboard from '../screens/librarian/LibrarianDashboard';
import IssueBookScreen from '../screens/librarian/IssueBookScreen';
import ReturnBookScreen from '../screens/librarian/ReturnBookScreen';
import AddBookScreen from '../screens/librarian/AddBookScreen';
import AddStudentScreen from '../screens/librarian/AddStudentScreen';
import ResetPasswordScreen from '../screens/librarian/ResetPasswordScreen';
import OverdueListScreen from '../screens/librarian/OverdueListScreen';
import LibrarianBooksScreen from '../screens/librarian/LibrarianBooksScreen';
import StudentsScreen from '../screens/librarian/StudentsScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: COLORS.primary },
    headerTintColor: COLORS.white,
    headerTitleStyle: { fontWeight: '700', fontSize: 18 },
    headerBackTitleVisible: false,
};

const GlobalNotification = () => {
    const { notification } = useApp();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [translateY] = useState(new Animated.Value(-50));

    useEffect(() => {
        if (notification) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, friction: 8, useNativeDriver: true })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: -50, duration: 300, useNativeDriver: true })
            ]).start();
        }
    }, [notification]);

    if (!notification && fadeAnim._value === 0) return null;

    const isError = notification?.type === 'error';

    return (
        <Animated.View style={[
            styles.toastContainer,
            { opacity: fadeAnim, transform: [{ translateY }] },
            { backgroundColor: isError ? COLORS.danger : COLORS.success }
        ]}>
            <Ionicons name={isError ? "alert-circle" : "checkmark-circle"} size={22} color={COLORS.white} />
            <Text style={styles.toastText}>{notification?.message}</Text>
        </Animated.View>
    );
};

export default function AppNavigator() {
    const { currentUser, isRestoringSession } = useApp();

    if (isRestoringSession) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!currentUser) {
        return (
            <View style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
                <GlobalNotification />
            </View>
        );
    }

    if (currentUser.role === 'student') {
        return (
            <View style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={screenOptions}>
                        <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ headerShown: false }} />
                        <Stack.Screen name="StudentBooks" component={StudentBooksScreen} options={{ title: 'Browse Books' }} />
                        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
                        <Stack.Screen name="MyBooks" component={MyBooksScreen} options={{ title: 'My Issued Books' }} />
                        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Borrowing History' }} />
                    </Stack.Navigator>
                </NavigationContainer>
                <GlobalNotification />
            </View>
        );
    }

    // Librarian
    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ ...screenOptions, headerStyle: { backgroundColor: '#1139A0' } }}>
                    <Stack.Screen name="LibrarianDashboard" component={LibrarianDashboard} options={{ headerShown: false }} />
                    <Stack.Screen name="IssueBook" component={IssueBookScreen} options={{ title: 'Issue Book' }} />
                    <Stack.Screen name="ReturnBook" component={ReturnBookScreen} options={{ title: 'Return Book' }} />
                    <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Add New Book' }} />
                    <Stack.Screen name="AddStudent" component={AddStudentScreen} options={{ title: 'Add New Student' }} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />
                    <Stack.Screen name="OverdueList" component={OverdueListScreen} options={{ title: 'Overdue Books' }} />
                    <Stack.Screen name="LibrarianBooks" component={LibrarianBooksScreen} options={{ title: 'All Books' }} />
                    <Stack.Screen name="Students" component={StudentsScreen} options={{ title: 'Students' }} />
                </Stack.Navigator>
            </NavigationContainer>
            <GlobalNotification />
        </View>
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute', top: 50, left: 20, right: 20,
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 14, borderRadius: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 10, elevation: 6, zIndex: 9999
    },
    toastText: { color: COLORS.white, fontSize: 14, fontWeight: '600', flex: 1 },
});
