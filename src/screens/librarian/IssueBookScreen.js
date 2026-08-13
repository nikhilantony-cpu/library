import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, TextInput, Alert, FlatList, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS, Card } from '../../components/theme';

export default function IssueBookScreen({ navigation }) {
    const { books, users, issueBook, showNotification } = useApp();
    const [step, setStep] = useState(1); // 1=select student, 2=select book
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [bookSearch, setBookSearch] = useState('');
    const [issuing, setIssuing] = useState(false);

    const students = users.filter(u => u.role === 'student');
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.regNo.toLowerCase().includes(studentSearch.toLowerCase())
    );
    const filteredBooks = books.filter(b =>
        (b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
            b.author.toLowerCase().includes(bookSearch.toLowerCase())) &&
        b.availableCopies > 0
    );

    const handleIssue = () => {
        if (!selectedStudent || !selectedBook) {
            showNotification('Please select both a student and a book.', 'error');
            return;
        }

        setIssuing(true);
        setTimeout(() => {
            const result = issueBook(selectedBook.id, selectedStudent.id);
            setIssuing(false);
            if (result.success) {
                showNotification(result.message, 'success');
                navigation.goBack();
            } else {
                showNotification(result.message, 'error');
            }
        }, 300);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Progress Steps */}
            <View style={styles.steps}>
                {['Select Student', 'Select Book', 'Confirm'].map((s, i) => (
                    <View key={i} style={styles.stepItem}>
                        <View style={[styles.stepCircle, step > i + 1 && styles.stepDone, step === i + 1 && styles.stepActive]}>
                            {step > i + 1
                                ? <Ionicons name="checkmark" size={14} color={COLORS.white} />
                                : <Text style={[styles.stepNum, step === i + 1 && { color: COLORS.white }]}>{i + 1}</Text>}
                        </View>
                        <Text style={[styles.stepLabel, step === i + 1 && { color: COLORS.primary, fontWeight: '600' }]}>{s}</Text>
                        {i < 2 && <View style={[styles.stepLine, step > i + 1 && { backgroundColor: COLORS.primary }]} />}
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Step 1: Student */}
                {step === 1 && (
                    <>
                        <Text style={styles.heading}>Select Student</Text>
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={16} color={COLORS.textSecondary} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by name or reg. no."
                                placeholderTextColor={COLORS.textLight}
                                value={studentSearch}
                                onChangeText={setStudentSearch}
                            />
                        </View>
                        {filteredStudents.map(student => (
                            <TouchableOpacity
                                key={student.id}
                                style={[styles.itemCard, selectedStudent?.id === student.id && styles.selectedCard]}
                                onPress={() => { setSelectedStudent(student); setStep(2); }}
                            >
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.itemName}>{student.name}</Text>
                                    <Text style={styles.itemSub}>{student.regNo} • {student.year}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {/* Step 2: Book */}
                {step === 2 && (
                    <>
                        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                            <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
                            <Text style={styles.backText}>Back to Student</Text>
                        </TouchableOpacity>

                        {/* Selected Student Summary */}
                        <Card style={styles.selectedSummary}>
                            <Ionicons name="person-circle" size={20} color={COLORS.primary} />
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.summaryName}>{selectedStudent?.name}</Text>
                                <Text style={styles.summarySub}>{selectedStudent?.regNo} • {selectedStudent?.year}</Text>
                            </View>
                        </Card>

                        <Text style={styles.heading}>Select Book</Text>
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={16} color={COLORS.textSecondary} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search available books..."
                                placeholderTextColor={COLORS.textLight}
                                value={bookSearch}
                                onChangeText={setBookSearch}
                            />
                        </View>
                        {filteredBooks.length === 0 && (
                            <View style={styles.empty}>
                                <Ionicons name="book-outline" size={40} color={COLORS.textLight} />
                                <Text style={styles.emptyText}>No available books found</Text>
                            </View>
                        )}
                        {filteredBooks.map(book => (
                            <TouchableOpacity
                                key={book.id}
                                style={[styles.itemCard, selectedBook?.id === book.id && styles.selectedCard]}
                                onPress={() => { setSelectedBook(book); setStep(3); }}
                            >
                                <View style={[styles.bookIcon, { backgroundColor: COLORS.primary + '15' }]}>
                                    <Ionicons name="book" size={22} color={COLORS.primary} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.itemName} numberOfLines={1}>{book.title}</Text>
                                    <Text style={styles.itemSub}>{book.author}</Text>
                                    <Text style={styles.availText}>
                                        <Ionicons name="layers-outline" size={11} color={COLORS.success} /> {book.availableCopies} copies available
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                    <>
                        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
                            <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
                            <Text style={styles.backText}>Back to Books</Text>
                        </TouchableOpacity>

                        <Text style={styles.heading}>Confirm Issue</Text>
                        <Card>
                            <Text style={styles.confirmLabel}>Student</Text>
                            <View style={styles.confirmRow}>
                                <Ionicons name="person" size={16} color={COLORS.primary} />
                                <Text style={styles.confirmValue}>{selectedStudent?.name}</Text>
                            </View>
                            <Text style={styles.confirmSub}>{selectedStudent?.regNo} • {selectedStudent?.year}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.confirmLabel}>Book</Text>
                            <View style={styles.confirmRow}>
                                <Ionicons name="book" size={16} color={COLORS.primary} />
                                <Text style={styles.confirmValue}>{selectedBook?.title}</Text>
                            </View>
                            <Text style={styles.confirmSub}>{selectedBook?.author}</Text>
                            <View style={styles.divider} />
                            <View style={styles.policyBox}>
                                <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                                <Text style={styles.policyText}>Return period: 14 days • Fine: ₹5/day after due date</Text>
                            </View>
                        </Card>

                        <TouchableOpacity
                            style={[styles.issueBtn, issuing && { opacity: 0.7 }]}
                            onPress={handleIssue}
                            disabled={issuing}
                        >
                            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                            <Text style={styles.issueBtnText}>{issuing ? 'Processing...' : 'Issue Book'}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    steps: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    stepCircle: {
        width: 26, height: 26, borderRadius: 13, borderWidth: 2,
        borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
    },
    stepActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
    stepDone: { borderColor: COLORS.success, backgroundColor: COLORS.success },
    stepNum: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.textSecondary },
    stepLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginLeft: 5 },
    stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginHorizontal: 4 },

    scroll: { padding: 16, paddingBottom: 40 },
    heading: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.white, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10,
        borderWidth: 1, borderColor: COLORS.border, marginBottom: 14,
    },
    searchInput: { flex: 1, fontSize: SIZES.base, color: COLORS.textPrimary },

    itemCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        borderRadius: 12, padding: 14, marginBottom: 10,
        ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
    },
    selectedCard: { borderColor: COLORS.primary, borderWidth: 2 },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.primary },
    bookIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    itemName: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    itemSub: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    availText: { fontSize: SIZES.xs, color: COLORS.success, marginTop: 3, fontWeight: '600' },

    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
    backText: { color: COLORS.primary, fontWeight: '600', fontSize: SIZES.md },

    selectedSummary: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderColor: COLORS.primary + '40', backgroundColor: COLORS.primaryLight },
    summaryName: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.primary },
    summarySub: { fontSize: SIZES.sm, color: COLORS.textSecondary },

    confirmLabel: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
    confirmRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    confirmValue: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
    confirmSub: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginLeft: 22, marginTop: 2 },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
    policyBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLight, borderRadius: 8, padding: 10 },
    policyText: { fontSize: SIZES.xs, color: COLORS.primary, flex: 1 },

    issueBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 12,
        paddingVertical: 15, marginTop: 10, gap: 8,
    },
    issueBtnText: { color: COLORS.white, fontSize: SIZES.base, fontWeight: '700' },

    empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
    emptyText: { fontSize: SIZES.md, color: COLORS.textSecondary },
});
