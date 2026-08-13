import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    SafeAreaView, TextInput, Alert, FlatList, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS, Card } from '../../components/theme';

export default function ReturnBookScreen({ navigation }) {
    const { issuedBooks, returnBook, showNotification } = useApp();
    const [search, setSearch] = useState('');

    const activeIssues = issuedBooks.filter(b => b.status !== 'returned');
    const filtered = activeIssues.filter(b =>
        b.studentName.toLowerCase().includes(search.toLowerCase()) ||
        b.regNo.toLowerCase().includes(search.toLowerCase()) ||
        b.bookTitle.toLowerCase().includes(search.toLowerCase())
    );

    const today = new Date();

    const handleReturn = (issue) => {
        const result = returnBook(issue.id);
        if (result.success) {
            showNotification(
                result.fine > 0 ? `Fine Collected: ${result.message}` : `Book Returned: ${result.message}`,
                'success'
            );
        } else {
            showNotification(`Error: ${result.message}`, 'error');
        }
    };

    const renderItem = ({ item }) => {
        const isOverdue = new Date(item.dueDate) < today;
        const daysLeft = Math.ceil((new Date(item.dueDate) - today) / (1000 * 60 * 60 * 24));
        const fine = isOverdue ? Math.abs(daysLeft) * 5 : 0;

        return (
            <View style={[styles.card, isOverdue && styles.overdueCard]}>
                <View style={styles.cardTop}>
                    <View style={[styles.bookIcon, { backgroundColor: isOverdue ? COLORS.danger + '15' : COLORS.primary + '15' }]}>
                        <Ionicons name="book" size={20} color={isOverdue ? COLORS.danger : COLORS.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
                        <Text style={styles.bookAuthor}>{item.bookAuthor}</Text>
                    </View>
                    {isOverdue && (
                        <View style={styles.fineBadge}>
                            <Text style={styles.fineText}>₹{fine}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.studentRow}>
                    <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.studentText}>{item.studentName} • {item.regNo}</Text>
                </View>
                <View style={styles.datesRow}>
                    <Text style={styles.dateText}>Issued: {item.issueDate}</Text>
                    <Text style={[styles.dateText, isOverdue && { color: COLORS.danger, fontWeight: '600' }]}>
                        Due: {item.dueDate}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.returnBtn, isOverdue && styles.returnBtnWarning]}
                    onPress={() => handleReturn(item)}
                >
                    <Ionicons name="return-up-back" size={16} color={COLORS.white} />
                    <Text style={styles.returnBtnText}>
                        {isOverdue ? `Return & Collect ₹${fine} Fine` : 'Mark as Returned'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color={COLORS.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by student, reg. no. or book..."
                    placeholderTextColor={COLORS.textLight}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.count}>{filtered.length} active issue{filtered.length !== 1 ? 's' : ''}</Text>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="checkmark-circle-outline" size={60} color={COLORS.textLight} />
                        <Text style={styles.emptyTitle}>No Active Issues</Text>
                        <Text style={styles.emptyText}>All books have been returned</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        margin: 16, backgroundColor: COLORS.white, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10,
        borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small,
    },
    searchInput: { flex: 1, fontSize: SIZES.base, color: COLORS.textPrimary },
    count: { fontSize: SIZES.sm, color: COLORS.textSecondary, paddingHorizontal: 16, marginBottom: 8 },

    list: { padding: 16, paddingTop: 0, paddingBottom: 30 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 12, padding: 14,
        marginBottom: 12, ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
    },
    overdueCard: { borderColor: COLORS.danger + '60', borderWidth: 1.5 },

    cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    bookIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    bookTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    bookAuthor: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    fineBadge: { backgroundColor: COLORS.danger, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    fineText: { color: COLORS.white, fontSize: SIZES.xs, fontWeight: '700' },

    studentRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
    studentText: { fontSize: SIZES.sm, color: COLORS.textSecondary },

    datesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    dateText: { fontSize: SIZES.xs, color: COLORS.textSecondary },

    returnBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.success, borderRadius: 8, paddingVertical: 10, gap: 6,
    },
    returnBtnWarning: { backgroundColor: COLORS.danger },
    returnBtnText: { color: COLORS.white, fontSize: SIZES.sm, fontWeight: '700' },

    empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
    emptyTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.textPrimary },
    emptyText: { fontSize: SIZES.md, color: COLORS.textSecondary },
});
