import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS, Card } from '../../components/theme';

const colorMap = {
    'Electronics': COLORS.primary,
    'Communication': '#8B5CF6',
    'VLSI': '#EC4899',
    'Control Systems': COLORS.success,
    'Electromagnetics': '#F97316',
    'Power Electronics': COLORS.accent,
};

export default function BookDetailScreen({ route, navigation }) {
    const { book } = route.params;
    const { currentUser, issueBook, getStudentIssuedBooks, showNotification } = useApp();
    const color = colorMap[book.category] || COLORS.primary;
    const myBooks = getStudentIssuedBooks(currentUser.id);
    const alreadyIssued = myBooks.find(b => b.bookId === book.id);
    const canIssue = !alreadyIssued && myBooks.length < 3 && book.availableCopies > 0;

    const handleIssueRequest = () => {
        if (!canIssue) {
            const msg = alreadyIssued ? 'You already have this book.'
                : myBooks.length >= 3 ? 'You can only issue 3 books at a time.'
                    : 'No copies available right now.';
            showNotification(msg, 'error');
            return;
        }

        // Just directly show notification since we've eliminated popups
        showNotification('Request sent to librarian. Please clear it at the counter.', 'success');
    };

    const infoRows = [
        { label: 'Author', value: book.author, icon: 'person' },
        { label: 'ISBN', value: book.isbn, icon: 'barcode' },
        { label: 'Publisher', value: book.publisher, icon: 'business' },
        { label: 'Year', value: String(book.year), icon: 'calendar' },
        { label: 'Shelf', value: book.shelf, icon: 'location' },
        { label: 'Category', value: book.category, icon: 'folder' },
        { label: 'Total Copies', value: String(book.totalCopies), icon: 'copy' },
        { label: 'Available', value: String(book.availableCopies), icon: 'checkmark-circle' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Book Header */}
                <View style={[styles.bookHeader, { backgroundColor: color + '15' }]}>
                    <View style={[styles.coverIcon, { backgroundColor: color + '20', borderColor: color + '30' }]}>
                        <Ionicons name="book" size={60} color={color} />
                    </View>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <View style={[styles.catBadge, { backgroundColor: color }]}>
                        <Text style={styles.catText}>{book.category}</Text>
                    </View>
                    {/* Availability */}
                    <View style={[styles.availRow, { backgroundColor: book.availableCopies > 0 ? COLORS.success + '15' : COLORS.danger + '15' }]}>
                        <Ionicons
                            name={book.availableCopies > 0 ? 'checkmark-circle' : 'close-circle'}
                            size={16}
                            color={book.availableCopies > 0 ? COLORS.success : COLORS.danger}
                        />
                        <Text style={[styles.availText, { color: book.availableCopies > 0 ? COLORS.success : COLORS.danger }]}>
                            {book.availableCopies > 0 ? `${book.availableCopies} copies available` : 'Currently unavailable'}
                        </Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Description */}
                    <Card>
                        <Text style={styles.sectionTitle}>About this book</Text>
                        <Text style={styles.description}>{book.description}</Text>
                    </Card>

                    {/* Book Info */}
                    <Card>
                        <Text style={styles.sectionTitle}>Book Details</Text>
                        {infoRows.map((row, i) => (
                            <View key={i} style={[styles.infoRow, i < infoRows.length - 1 && styles.infoRowBorder]}>
                                <View style={styles.infoLabelRow}>
                                    <Ionicons name={row.icon} size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.infoLabel}>{row.label}</Text>
                                </View>
                                <Text style={styles.infoValue}>{row.value}</Text>
                            </View>
                        ))}
                    </Card>

                    {alreadyIssued && (
                        <Card style={styles.issuedCard}>
                            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.issuedTitle}>Already Issued</Text>
                                <Text style={styles.issuedSub}>Due: {alreadyIssued.dueDate}</Text>
                            </View>
                        </Card>
                    )}
                </View>
            </ScrollView>

            {/* Issue Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.issueBtn, !canIssue && styles.issueBtnDisabled]}
                    onPress={handleIssueRequest}
                >
                    <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
                    <Text style={styles.issueBtnText}>
                        {alreadyIssued ? 'Already Issued' :
                            myBooks.length >= 3 ? 'Book Limit Reached' :
                                book.availableCopies === 0 ? 'Not Available' :
                                    'Request to Issue'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    bookHeader: { alignItems: 'center', padding: 24, paddingBottom: 30 },
    coverIcon: {
        width: 100, height: 100, borderRadius: 20, justifyContent: 'center',
        alignItems: 'center', marginBottom: 16, borderWidth: 2,
    },
    bookTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 4 },
    bookAuthor: { fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 10 },
    catBadge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 10 },
    catText: { color: COLORS.white, fontSize: SIZES.sm, fontWeight: '600' },
    availRow: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
    availText: { fontSize: SIZES.sm, fontWeight: '600' },

    content: { padding: 16 },
    sectionTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
    description: { fontSize: SIZES.md, color: COLORS.textSecondary, lineHeight: 22 },

    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
    infoRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
    infoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary },
    infoValue: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textPrimary, maxWidth: '55%', textAlign: 'right' },

    issuedCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.success + '10', borderColor: COLORS.success + '40' },
    issuedTitle: { fontWeight: '700', color: COLORS.success },
    issuedSub: { fontSize: SIZES.sm, color: COLORS.textSecondary },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white, padding: 16,
        borderTopWidth: 1, borderTopColor: COLORS.border,
    },
    issueBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 12,
        paddingVertical: 14, gap: 8,
    },
    issueBtnDisabled: { backgroundColor: COLORS.textLight },
    issueBtnText: { color: COLORS.white, fontSize: SIZES.base, fontWeight: '700' },
});
