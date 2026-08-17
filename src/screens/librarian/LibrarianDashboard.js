import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS, Card } from '../../components/theme';

export default function LibrarianDashboard({ navigation }) {
    const { currentUser, getDashboardStats, getOverdueBooks, issuedBooks, logout } = useApp();
    const stats = getDashboardStats();
    const overdueBooks = getOverdueBooks();
    const recentActivity = issuedBooks.slice(-4).reverse();

    const statCards = [
        { label: 'Total Books', value: stats.totalBooks, icon: 'library', color: COLORS.primary },
        { label: 'Students', value: stats.totalStudents, icon: 'people', color: '#8B5CF6' },
        { label: 'Active Issues', value: stats.activeIssues, icon: 'bookmarks', color: COLORS.secondary },
        { label: 'Overdue', value: stats.overdueCount, icon: 'alert-circle', color: COLORS.danger },
        { label: 'Available', value: stats.availableBooks, icon: 'checkmark-circle', color: COLORS.success },
        { label: 'Fine Pending', value: `₹${stats.totalFine}`, icon: 'cash', color: COLORS.accent },
    ];

    const quickActions = [
        { label: 'Issue Book', icon: 'add-circle', screen: 'IssueBook', color: COLORS.primary },
        { label: 'Add Student', icon: 'person-add', screen: 'AddStudent', color: COLORS.secondary },
        { label: 'Reset Pass', icon: 'key', screen: 'ResetPassword', color: COLORS.danger },
        { label: 'Return Book', icon: 'return-up-back', screen: 'ReturnBook', color: COLORS.success },
        { label: 'All Books', icon: 'library', screen: 'LibrarianBooks', color: '#8B5CF6' },
        { label: 'All Students', icon: 'people', screen: 'Students', color: '#F97316' },
        { label: 'Add Book', icon: 'book', screen: 'AddBook', color: COLORS.accent },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {currentUser.name.split(' ')[1] || currentUser.name} 👋</Text>
                    <Text style={styles.roleText}>Librarian • ECC Department</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={22} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Overdue Alert */}
                {overdueBooks.length > 0 && (
                    <TouchableOpacity
                        style={styles.alertBanner}
                        onPress={() => navigation.navigate('OverdueList')}
                    >
                        <Ionicons name="warning" size={18} color={COLORS.white} />
                        <Text style={styles.alertText}>
                            {overdueBooks.length} overdue book{overdueBooks.length > 1 ? 's' : ''} • Total fine: ₹{stats.totalFine}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                )}

                {/* Stats Grid */}
                <Text style={styles.sectionTitle}>Overview</Text>
                <View style={styles.statsGrid}>
                    {statCards.map((s, i) => (
                        <View key={i} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                                <Ionicons name={s.icon} size={20} color={s.color} />
                            </View>
                            <Text style={styles.statValue}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>MAin Options</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((a, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.actionCard, { borderTopColor: a.color }]}
                            onPress={() => navigation.navigate(a.screen)}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
                                <Ionicons name={a.icon} size={22} color={a.color} />
                            </View>
                            <Text style={styles.actionLabel}>{a.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {recentActivity.map((item) => {
                    const isReturned = item.status === 'returned';
                    return (
                        <Card key={item.id} style={styles.actCard}>
                            <View style={[styles.actIcon, { backgroundColor: isReturned ? COLORS.success + '15' : COLORS.primary + '15' }]}>
                                <Ionicons name={isReturned ? 'return-up-back' : 'book'} size={18} color={isReturned ? COLORS.success : COLORS.primary} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.actTitle} numberOfLines={1}>{item.bookTitle}</Text>
                                <Text style={styles.actSub}>{item.studentName} • {item.regNo}</Text>
                                <Text style={styles.actDate}>{isReturned ? `Returned: ${item.returnDate}` : `Issued: ${item.issueDate}`}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: isReturned ? COLORS.success + '15' : COLORS.primary + '15' }]}>
                                <Text style={[styles.badgeText, { color: isReturned ? COLORS.success : COLORS.primary }]}>
                                    {isReturned ? 'Returned' : 'Issued'}
                                </Text>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: COLORS.primaryDark || '#1139A0', paddingHorizontal: 20,
        paddingVertical: 16, paddingTop: 20,
    },
    greeting: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.white },
    roleText: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
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

    sectionTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    statCard: {
        width: '30%', backgroundColor: COLORS.white, borderRadius: 12, padding: 12,
        alignItems: 'center', ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
        flexGrow: 1,
    },
    statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    statValue: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.textPrimary },
    statLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },

    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    actionCard: {
        width: '30%', backgroundColor: COLORS.white, borderRadius: 12, padding: 14,
        alignItems: 'center', ...SHADOWS.small, borderTopWidth: 3,
        borderWidth: 1, borderColor: COLORS.border, gap: 8, flexGrow: 1,
    },
    actionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { fontSize: SIZES.xs, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },

    actCard: { flexDirection: 'row', alignItems: 'flex-start' },
    actIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    actTitle: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.textPrimary },
    actSub: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 1 },
    actDate: { fontSize: SIZES.xs, color: COLORS.textLight, marginTop: 2 },
    badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
    badgeText: { fontSize: SIZES.xs, fontWeight: '700' },
});
