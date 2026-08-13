import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS, Card } from '../../components/theme';

export default function StudentDashboard({ navigation }) {
    const { currentUser, getStudentIssuedBooks, logout } = useApp();
    const myBooks = getStudentIssuedBooks(currentUser.id);
    const overdueBooks = myBooks.filter(b => new Date(b.dueDate) < new Date());

    const stats = [
        { label: 'Books Issued', value: myBooks.length, icon: 'book', color: COLORS.primary },
        {
            label: 'Due Soon', value: myBooks.filter(b => {
                const diff = (new Date(b.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff <= 3;
            }).length, icon: 'time', color: COLORS.accent
        },
        { label: 'Overdue', value: overdueBooks.length, icon: 'alert-circle', color: COLORS.danger },
        { label: 'Books Left', value: 3 - myBooks.length, icon: 'add-circle', color: COLORS.success },
    ];

    const quickLinks = [
        { label: 'Browse Books', icon: 'search', screen: 'StudentBooks', color: COLORS.primary },
        { label: 'My Books', icon: 'bookmarks', screen: 'MyBooks', color: COLORS.secondary },
        { label: 'History', icon: 'time', screen: 'History', color: COLORS.accent },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {currentUser.name.split(' ')[0]} 👋</Text>
                    <Text style={styles.regNo}>{currentUser.regNo} • {currentUser.year}</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={22} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Overdue Alert */}
                {overdueBooks.length > 0 && (
                    <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate('MyBooks')}>
                        <Ionicons name="warning" size={18} color={COLORS.white} />
                        <Text style={styles.alertText}>
                            {overdueBooks.length} book{overdueBooks.length > 1 ? 's' : ''} overdue! Fine: ₹
                            {overdueBooks.reduce((s, b) => s + (b.fine || 0), 0)}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                )}

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((s, i) => (
                        <View key={i} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                                <Ionicons name={s.icon} size={22} color={s.color} />
                            </View>
                            <Text style={styles.statValue}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickRow}>
                    {quickLinks.map((q, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.quickCard, { borderTopColor: q.color }]}
                            onPress={() => navigation.navigate(q.screen)}
                        >
                            <Ionicons name={q.icon} size={24} color={q.color} />
                            <Text style={styles.quickLabel}>{q.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Currently Issued Books */}
                <Text style={styles.sectionTitle}>Currently Issued</Text>
                {myBooks.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Ionicons name="book-outline" size={40} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No books currently issued</Text>
                        <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('StudentBooks')}>
                            <Text style={styles.browseBtnText}>Browse Books</Text>
                        </TouchableOpacity>
                    </Card>
                ) : (
                    myBooks.map(book => {
                        const isOverdue = new Date(book.dueDate) < new Date();
                        return (
                            <Card key={book.id} style={isOverdue ? styles.overdueCard : {}}>
                                <View style={styles.bookRow}>
                                    <View style={[styles.bookBadge, { backgroundColor: isOverdue ? COLORS.danger + '15' : COLORS.primary + '15' }]}>
                                        <Ionicons name="book" size={22} color={isOverdue ? COLORS.danger : COLORS.primary} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.bookTitle} numberOfLines={1}>{book.bookTitle}</Text>
                                        <Text style={styles.bookAuthor}>{book.bookAuthor}</Text>
                                        <View style={styles.dueBadge}>
                                            <Ionicons name={isOverdue ? 'alert-circle' : 'calendar'} size={12} color={isOverdue ? COLORS.danger : COLORS.textSecondary} />
                                            <Text style={[styles.dueText, { color: isOverdue ? COLORS.danger : COLORS.textSecondary }]}>
                                                Due: {book.dueDate} {isOverdue ? `• Fine: ₹${book.fine}` : ''}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        );
                    })
                )}

                {/* Info Card */}
                <Card style={styles.infoCard}>
                    <Text style={styles.infoTitle}>📚 Library Policy</Text>
                    <Text style={styles.infoItem}>• Max 3 books at a time</Text>
                    <Text style={styles.infoItem}>• Return period: 14 days</Text>
                    <Text style={styles.infoItem}>• Fine: ₹5 per day (overdue)</Text>
                    <Text style={styles.infoItem}>• Library Hours: 9am – 5pm (Mon–Sat)</Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 16,
        paddingTop: 20,
    },
    greeting: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.white },
    regNo: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    logoutBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
    },

    scroll: { padding: 16, paddingBottom: 30 },

    alertBanner: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.danger,
        borderRadius: 10, padding: 12, marginBottom: 16, gap: 8,
    },
    alertText: { flex: 1, color: COLORS.white, fontWeight: '600', fontSize: SIZES.sm },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    statCard: {
        flex: 1, minWidth: '44%', backgroundColor: COLORS.white, borderRadius: 12,
        padding: 14, alignItems: 'center', ...SHADOWS.small,
        borderWidth: 1, borderColor: COLORS.border,
    },
    statIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statValue: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.textPrimary },
    statLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },

    sectionTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },

    quickRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    quickCard: {
        flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 14,
        alignItems: 'center', ...SHADOWS.small, borderTopWidth: 3,
        borderWidth: 1, borderColor: COLORS.border, gap: 6,
    },
    quickLabel: { fontSize: SIZES.xs, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },

    emptyCard: { alignItems: 'center', paddingVertical: 30, gap: 10 },
    emptyText: { fontSize: SIZES.md, color: COLORS.textSecondary },
    browseBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 8 },
    browseBtnText: { color: COLORS.white, fontWeight: '600' },

    bookRow: { flexDirection: 'row', alignItems: 'flex-start' },
    bookBadge: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    bookTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    bookAuthor: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    dueBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    dueText: { fontSize: SIZES.xs },
    overdueCard: { borderLeftWidth: 4, borderLeftColor: COLORS.danger },

    infoCard: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary + '40' },
    infoTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
    infoItem: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 4 },
});
