import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, Card } from '../../components/theme';

export default function ResetPasswordScreen({ navigation }) {
    const { users, showNotification, resetStudentPassword } = useApp();
    const students = users.filter(u => u.role === 'student');

    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const filteredStudents = students.filter(s =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleReset = () => {
        if (!selectedStudent) {
            showNotification('Please select a student first.', 'error');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            showNotification('Password must be at least 6 characters.', 'error');
            return;
        }

        setSubmitting(true);
        setTimeout(() => {
            resetStudentPassword(selectedStudent.id, newPassword);

            setSubmitting(false);
            showNotification(`Password for ${selectedStudent.name} successfully reset!`, 'success');
            navigation.goBack();
        }, 500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    {!selectedStudent ? (
                        <>
                            <Card>
                                <Text style={styles.sectionTitle}>Select Student</Text>
                                <View style={styles.searchBar}>
                                    <Ionicons name="search" size={16} color={COLORS.textSecondary} />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search by name or email"
                                        placeholderTextColor={COLORS.textLight}
                                        value={search}
                                        onChangeText={setSearch}
                                    />
                                </View>
                            </Card>

                            {filteredStudents.map(student => (
                                <TouchableOpacity
                                    key={student.id}
                                    style={styles.itemCard}
                                    onPress={() => setSelectedStudent(student)}
                                >
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.itemName}>{student.name}</Text>
                                        <Text style={styles.itemSub}>{student.email}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.backBtn} onPress={() => { setSelectedStudent(null); setNewPassword(''); }}>
                                <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
                                <Text style={styles.backText}>Select Different Student</Text>
                            </TouchableOpacity>

                            <Card style={styles.selectedSummary}>
                                <Ionicons name="person-circle" size={20} color={COLORS.primary} />
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Text style={styles.summaryName}>{selectedStudent.name}</Text>
                                    <Text style={styles.summarySub}>{selectedStudent.email}</Text>
                                </View>
                            </Card>

                            <Card>
                                <Text style={styles.sectionTitle}>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new password"
                                    placeholderTextColor={COLORS.textLight}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                />
                            </Card>

                            <TouchableOpacity
                                style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                                onPress={handleReset}
                                disabled={submitting}
                            >
                                <Ionicons name="key" size={20} color={COLORS.white} />
                                <Text style={styles.submitText}>{submitting ? 'Resetting...' : 'Reset Password'}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: 16, paddingBottom: 40 },

    sectionTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.background, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10,
        borderWidth: 1, borderColor: COLORS.border,
    },
    searchInput: { flex: 1, fontSize: SIZES.base, color: COLORS.textPrimary },

    itemCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        borderRadius: 12, padding: 14, marginBottom: 10,
        borderWidth: 1, borderColor: COLORS.border,
    },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.primary },
    itemName: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    itemSub: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },

    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
    backText: { color: COLORS.primary, fontWeight: '600', fontSize: SIZES.md },

    selectedSummary: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderColor: COLORS.primary + '40', backgroundColor: '#EFF6FF' },
    summaryName: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.primary },
    summarySub: { fontSize: SIZES.sm, color: COLORS.textSecondary },

    input: {
        borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 12,
        fontSize: SIZES.base, color: COLORS.textPrimary, backgroundColor: COLORS.background,
    },

    submitBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.danger, borderRadius: 12,
        paddingVertical: 15, marginTop: 8, gap: 8,
    },
    submitText: { color: COLORS.white, fontSize: SIZES.base, fontWeight: '700' },
});
