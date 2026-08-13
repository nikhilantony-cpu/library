import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USERS, BOOKS, ISSUED_BOOKS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isRestoringSession, setIsRestoringSession] = useState(true);
    const [books, setBooks] = useState(BOOKS);
    const [issuedBooks, setIssuedBooks] = useState(ISSUED_BOOKS);
    const [users, setUsers] = useState(USERS);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const restoreData = async () => {
            try {
                // Restore Session
                const storedUserId = await AsyncStorage.getItem('ecc_library_session');

                // Restore Data
                const storedBooks = await AsyncStorage.getItem('ecc_library_books');
                const storedIssued = await AsyncStorage.getItem('ecc_library_issued');
                const storedUsers = await AsyncStorage.getItem('ecc_library_users');

                if (storedBooks) setBooks(JSON.parse(storedBooks));
                if (storedIssued) setIssuedBooks(JSON.parse(storedIssued));
                if (storedUsers) setUsers(JSON.parse(storedUsers));

                // Find user after possible user load
                const activeUsers = storedUsers ? JSON.parse(storedUsers) : USERS;
                if (storedUserId) {
                    const foundUser = activeUsers.find(u => u.id === storedUserId);
                    if (foundUser) {
                        setCurrentUser(foundUser);
                    }
                }
            } catch (error) {
                console.error("Error restoring data", error);
            } finally {
                setIsRestoringSession(false);
            }
        };
        restoreData();
    }, []);

    // Save Books to storage when they change
    useEffect(() => {
        if (!isRestoringSession) AsyncStorage.setItem('ecc_library_books', JSON.stringify(books));
    }, [books, isRestoringSession]);

    // Save IssuedBooks to storage when they change
    useEffect(() => {
        if (!isRestoringSession) AsyncStorage.setItem('ecc_library_issued', JSON.stringify(issuedBooks));
    }, [issuedBooks, isRestoringSession]);

    // Save Users to storage when they change
    useEffect(() => {
        if (!isRestoringSession) AsyncStorage.setItem('ecc_library_users', JSON.stringify(users));
    }, [users, isRestoringSession]);

    const login = async (email, password) => {
        const user = USERS.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            try {
                await AsyncStorage.setItem('ecc_library_session', user.id);
            } catch (error) {
                console.error("Error setting session", error);
            }
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const logout = async () => {
        setCurrentUser(null);
        try {
            await AsyncStorage.removeItem('ecc_library_session');
        } catch (error) {
            console.error("Error clearing session", error);
        }
    };

    const getStudentIssuedBooks = (studentId) => {
        return issuedBooks.filter(ib => ib.studentId === studentId && ib.status !== 'returned');
    };

    const issueBook = (bookId, studentId) => {
        const book = books.find(b => b.id === bookId);
        const student = users.find(u => u.id === studentId);
        if (!book || !student) return { success: false, message: 'Book or student not found' };
        if (book.availableCopies === 0) return { success: false, message: 'No copies available' };
        const studentActiveBooks = issuedBooks.filter(ib => ib.studentId === studentId && ib.status !== 'returned');
        if (studentActiveBooks.length >= 3) return { success: false, message: 'Student has reached max book limit (3)' };

        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 14);

        const newIssue = {
            id: 'ISS' + Date.now(),
            bookId: book.id,
            bookTitle: book.title,
            bookAuthor: book.author,
            studentId: student.id,
            studentName: student.name,
            regNo: student.regNo,
            issueDate: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            returnDate: null,
            fine: 0,
            status: 'issued',
        };

        setIssuedBooks(prev => [...prev, newIssue]);
        setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
        return { success: true, message: 'Book issued successfully' };
    };

    const returnBook = (issueId) => {
        const issue = issuedBooks.find(ib => ib.id === issueId);
        if (!issue) return { success: false, message: 'Issue record not found' };

        const today = new Date();
        const dueDate = new Date(issue.dueDate);
        let fine = 0;
        if (today > dueDate) {
            const diffDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
            fine = diffDays * 5;
        }

        setIssuedBooks(prev => prev.map(ib =>
            ib.id === issueId
                ? { ...ib, returnDate: today.toISOString().split('T')[0], fine, status: 'returned' }
                : ib
        ));
        setBooks(prev => prev.map(b => b.id === issue.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
        return { success: true, fine, message: fine > 0 ? `Book returned. Fine: ₹${fine}` : 'Book returned successfully' };
    };

    const addBook = (bookData) => {
        const newBook = { ...bookData, id: 'B' + Date.now(), availableCopies: bookData.totalCopies };
        setBooks(prev => [...prev, newBook]);
        return { success: true, message: 'Book added successfully' };
    };

    const getOverdueBooks = () => {
        const today = new Date();
        return issuedBooks.filter(ib => {
            if (ib.status === 'returned') return false;
            return new Date(ib.dueDate) < today;
        });
    };

    const getDashboardStats = () => {
        const today = new Date();
        const activeIssues = issuedBooks.filter(ib => ib.status !== 'returned');
        const overdueCount = issuedBooks.filter(ib => ib.status !== 'returned' && new Date(ib.dueDate) < today).length;
        const totalFine = issuedBooks.filter(ib => ib.status !== 'returned').reduce((sum, ib) => sum + (ib.fine || 0), 0);
        return {
            totalBooks: books.length,
            totalStudents: users.filter(u => u.role === 'student').length,
            activeIssues: activeIssues.length,
            overdueCount,
            totalFine,
            availableBooks: books.filter(b => b.availableCopies > 0).length,
        };
    };

    return (
        <AppContext.Provider value={{
            currentUser, isRestoringSession, login, logout,
            books, issuedBooks, users,
            getStudentIssuedBooks, issueBook, returnBook, addBook,
            getOverdueBooks, getDashboardStats,
            showNotification
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
