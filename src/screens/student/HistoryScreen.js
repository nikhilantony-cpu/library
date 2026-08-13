import React from 'react';
import {
    View, Text, StyleSheet, FlatList, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../../components/theme';

export default function HistoryScreen() {
    const { currentUser, issuedBooks } = useApp();
    const history = issuedBooks.filter(b => b.studentId === currentUser.id).sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

    const renderItem = ({ item }) => {
        const isReturned = item.status === 'returned';
        const isOverdue = item.status === 'overdue';

        return (
            <View style={styles.card}>
                <View style={[styles.icon, { backgroundColor: isReturned ? COLORS.success + '15' : isOverdue ? COLORS.danger + '15' : COLORS.primary + '15' }]}>
                    <Ionicons
                        name={isReturned ? 'checkmark-done' : isOverdue ? 'alert-circle' : 'book'}
                        size={20}
                        color={isReturned ? COLORS.success : isOverdue ? COLORS.danger : COLORS.primary}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
                    <Text style={styles.authorText}>{item.bookAuthor}</Text>
                    <Text style={styles.dateText}>Issued: {item.issueDate}</Text>
                    {item.returnDate && <Text style={styles.dateText}>Returned: {item.returnDate}</Text>}
                    {item.fine > 0 && (
                        <Text style={styles.fineText}>Fine paid: ₹{item.fine}</Text>
                    )}
                </View>
                <View style={[styles.badge, {
                    backgroundColor: isReturned ? COLORS.success + '15' :
                        isOverdue ? COLORS.danger + '15' : COLORS.primary + '15',
                }]}>
                    <Text style={[styles.badgeText, {
                        color: isReturned ? COLORS.success : isOverdue ? COLORS.danger : COLORS.primary,
                    }]}>
                        {isReturned ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {history.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons name="time-outline" size={64} color={COLORS.textLight} />
                    <Text style={styles.emptyText}>No borrowing history yet</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: 16, paddingBottom: 30 },
    card: {
        flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.white,
        borderRadius: 12, padding: 14, marginBottom: 10,
        ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
    },
    icon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    bookTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
    authorText: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 4 },
    dateText: { fontSize: SIZES.xs, color: COLORS.textSecondary },
    fineText: { fontSize: SIZES.xs, color: COLORS.danger, fontWeight: '600', marginTop: 2 },
    badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginLeft: 4 },
    badgeText: { fontSize: SIZES.xs, fontWeight: '700' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
    emptyText: { fontSize: SIZES.md, color: COLORS.textSecondary },
});
