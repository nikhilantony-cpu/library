import React from 'react';
import {
    View, Text, StyleSheet, FlatList, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../../components/theme';

export default function MyBooksScreen() {
    const { currentUser, issuedBooks } = useApp();
    const myBooks = issuedBooks.filter(b => b.studentId === currentUser.id && b.status !== 'returned');

    const today = new Date();

    const getDaysLeft = (dueDate) => {
        const diff = Math.ceil((new Date(dueDate) - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const renderItem = ({ item }) => {
        const daysLeft = getDaysLeft(item.dueDate);
        const isOverdue = daysLeft < 0;
        const isDueSoon = daysLeft >= 0 && daysLeft <= 3;

        const statusColor = isOverdue ? COLORS.danger : isDueSoon ? COLORS.accent : COLORS.success;
        const statusText = isOverdue
            ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}`
            : isDueSoon
                ? `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`
                : `${daysLeft} days left`;

        return (
            <View style={[styles.card, isOverdue && styles.overdueCard]}>
                <View style={[styles.indicator, { backgroundColor: statusColor }]} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
                    <Text style={styles.bookAuthor}>{item.bookAuthor}</Text>
                    <View style={styles.dateRow}>
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.dateText}>Issued: {item.issueDate}</Text>
                        </View>
                        <View style={styles.dateItem}>
                            <Ionicons name="flag-outline" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.dateText}>Due: {item.dueDate}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                        <Ionicons
                            name={isOverdue ? 'alert-circle' : isDueSoon ? 'time' : 'checkmark-circle'}
                            size={12} color={statusColor}
                        />
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                        {isOverdue && item.fine > 0 && (
                            <Text style={[styles.fineText, { color: statusColor }]}>• Fine: ₹{item.fine}</Text>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {myBooks.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons name="bookmarks-outline" size={64} color={COLORS.textLight} />
                    <Text style={styles.emptyTitle}>No Active Books</Text>
                    <Text style={styles.emptySubtitle}>You have no books currently issued.</Text>
                </View>
            ) : (
                <FlatList
                    data={myBooks}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.summary}>
                            <Text style={styles.summaryText}>
                                {myBooks.length} book{myBooks.length !== 1 ? 's' : ''} issued • {3 - myBooks.length} remaining
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: 16, paddingBottom: 30 },
    summary: {
        backgroundColor: COLORS.primaryLight, borderRadius: 10,
        padding: 12, marginBottom: 14, alignItems: 'center',
    },
    summaryText: { color: COLORS.primary, fontWeight: '600', fontSize: SIZES.sm },

    card: {
        flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12,
        marginBottom: 10, ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
        overflow: 'hidden',
    },
    overdueCard: { borderColor: COLORS.danger + '50' },
    indicator: { width: 5 },
    bookTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary, padding: 12, paddingBottom: 2 },
    bookAuthor: { fontSize: SIZES.sm, color: COLORS.textSecondary, paddingHorizontal: 12, marginBottom: 8 },
    dateRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 12, marginBottom: 8 },
    dateItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dateText: { fontSize: SIZES.xs, color: COLORS.textSecondary },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        marginHorizontal: 12, marginBottom: 12, borderRadius: 6,
        paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start',
    },
    statusText: { fontSize: SIZES.xs, fontWeight: '600' },
    fineText: { fontSize: SIZES.xs, fontWeight: '600' },

    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, padding: 30 },
    emptyTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.textPrimary },
    emptySubtitle: { fontSize: SIZES.md, color: COLORS.textSecondary, textAlign: 'center' },
});
