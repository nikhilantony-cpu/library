import React from 'react';
import {
    View, Text, StyleSheet, FlatList, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../../components/theme';

export default function OverdueListScreen() {
    const { getOverdueBooks } = useApp();
    const overdueBooks = getOverdueBooks();
    const today = new Date();

    const renderItem = ({ item }) => {
        const daysOver = Math.ceil((today - new Date(item.dueDate)) / (1000 * 60 * 60 * 24));
        const fine = daysOver * 5;

        return (
            <View style={styles.card}>
                <View style={styles.topRow}>
                    <View style={styles.bookIcon}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
                        <Text style={styles.bookAuthor}>{item.bookAuthor}</Text>
                    </View>
                    <View style={styles.fineBadge}>
                        <Text style={styles.fineAmount}>₹{fine}</Text>
                        <Text style={styles.fineLabel}>fine</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="person-outline" size={13} color={COLORS.textSecondary} />
                        <Text style={styles.infoText}>{item.studentName}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="card-outline" size={13} color={COLORS.textSecondary} />
                        <Text style={styles.infoText}>{item.regNo}</Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} />
                        <Text style={styles.infoText}>Due: {item.dueDate}</Text>
                    </View>
                    <View style={[styles.daysBadge]}>
                        <Text style={styles.daysText}>{daysOver} day{daysOver !== 1 ? 's' : ''} overdue</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {overdueBooks.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
                    <Text style={styles.emptyTitle}>No Overdue Books!</Text>
                    <Text style={styles.emptyText}>All books are within their return period.</Text>
                </View>
            ) : (
                <>
                    <View style={styles.summaryBanner}>
                        <Ionicons name="warning" size={16} color={COLORS.white} />
                        <Text style={styles.summaryText}>
                            {overdueBooks.length} overdue books • Total fine: ₹{overdueBooks.reduce((s, b) => s + (Math.ceil((today - new Date(b.dueDate)) / (1000 * 60 * 60 * 24)) * 5), 0)}
                        </Text>
                    </View>
                    <FlatList
                        data={overdueBooks}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    summaryBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.danger, padding: 12, paddingHorizontal: 16,
    },
    summaryText: { color: COLORS.white, fontWeight: '600', fontSize: SIZES.sm },

    list: { padding: 16, paddingBottom: 30 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 12, padding: 14,
        marginBottom: 12, ...SHADOWS.small,
        borderWidth: 1.5, borderColor: COLORS.danger + '40',
        borderLeftWidth: 4, borderLeftColor: COLORS.danger,
    },
    topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    bookIcon: {
        width: 40, height: 40, borderRadius: 10,
        backgroundColor: COLORS.danger + '15', justifyContent: 'center', alignItems: 'center',
    },
    bookTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    bookAuthor: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    fineBadge: { alignItems: 'center', backgroundColor: COLORS.danger + '12', borderRadius: 8, padding: 8 },
    fineAmount: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.danger },
    fineLabel: { fontSize: SIZES.xs, color: COLORS.danger },

    divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    infoText: { fontSize: SIZES.sm, color: COLORS.textSecondary },
    daysBadge: { backgroundColor: COLORS.danger + '15', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    daysText: { fontSize: SIZES.xs, color: COLORS.danger, fontWeight: '700' },

    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, padding: 30 },
    emptyTitle: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.textPrimary },
    emptyText: { fontSize: SIZES.md, color: COLORS.textSecondary, textAlign: 'center' },
});
