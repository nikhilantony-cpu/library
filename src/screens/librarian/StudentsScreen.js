import React from 'react';
import {
    View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../../components/theme';

export default function StudentsScreen({ navigation }) {
    const { users, issuedBooks } = useApp();
    const students = users.filter(u => u.role === 'student');

    const getStudentStats = (studentId) => {
        const active = issuedBooks.filter(b => b.studentId === studentId && b.status !== 'returned');
        const overdue = active.filter(b => new Date(b.dueDate) < new Date());
        const fine = overdue.reduce((s, b) => {
            const days = Math.ceil((new Date() - new Date(b.dueDate)) / (1000 * 60 * 60 * 24));
            return s + days * 5;
        }, 0);
        return { active: active.length, overdue: overdue.length, fine };
    };

    const renderStudent = ({ item }) => {
        const stats = getStudentStats(item.id);

        return (
            <View style={[styles.card, stats.overdue > 0 && styles.overdueCard]}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.regNo}>{item.regNo} • {item.year}</Text>
                    <View style={styles.statsRow}>
                        <View style={[styles.statBadge, { backgroundColor: COLORS.primary + '15' }]}>
                            <Ionicons name="book" size={11} color={COLORS.primary} />
                            <Text style={[styles.statText, { color: COLORS.primary }]}>{stats.active} issued</Text>
                        </View>
                        {stats.overdue > 0 && (
                            <View style={[styles.statBadge, { backgroundColor: COLORS.danger + '15' }]}>
                                <Ionicons name="alert-circle" size={11} color={COLORS.danger} />
                                <Text style={[styles.statText, { color: COLORS.danger }]}>{stats.overdue} overdue</Text>
                            </View>
                        )}
                        {stats.fine > 0 && (
                            <View style={[styles.statBadge, { backgroundColor: COLORS.accent + '15' }]}>
                                <Ionicons name="cash" size={11} color={COLORS.accent} />
                                <Text style={[styles.statText, { color: COLORS.accent }]}>₹{stats.fine}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.slotBox}>
                    <Text style={styles.slotVal}>{3 - stats.active}</Text>
                    <Text style={styles.slotLabel}>slots left</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={students}
                keyExtractor={item => item.id}
                renderItem={renderStudent}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{students.length} Registered Students</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: 16, paddingBottom: 30 },
    header: { marginBottom: 14 },
    headerText: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontWeight: '500' },

    card: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        borderRadius: 12, padding: 14, marginBottom: 10,
        ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
    },
    overdueCard: { borderColor: COLORS.danger + '50' },
    avatar: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.primary },
    name: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    regNo: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
    statBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
    statText: { fontSize: SIZES.xs, fontWeight: '600' },
    slotBox: { alignItems: 'center', minWidth: 44 },
    slotVal: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.textPrimary },
    slotLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary },
});
