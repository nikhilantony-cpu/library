import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, Card } from '../../components/theme';

export default function AddStudentScreen({ navigation }) {
    const { addStudent, showNotification } = useApp();
    const [form, setForm] = useState({
        name: '', regNo: '', email: '', password: '', year: '1st Year',
    });
    const [submitting, setSubmitting] = useState(false);

    const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleAdd = () => {
        const { name, regNo, email, password, year } = form;
        if (!name || !regNo || !email || !password || !year) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }

        setSubmitting(true);
        setTimeout(() => {
            const result = addStudent(form);
            setSubmitting(false);
            if (result.success) {
                showNotification(result.message, 'success');
                navigation.goBack();
            } else {
                showNotification(result.message, 'error');
            }
        }, 500);
    };

    const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG'];

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    <Card>
                        <Text style={styles.sectionTitle}>Student Information</Text>

                        <View style={styles.field}>
                            <Text style={styles.label}>Full Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter full name"
                                placeholderTextColor={COLORS.textLight}
                                value={form.name}
                                onChangeText={v => update('name', v)}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Registration Number *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. ECC2205"
                                placeholderTextColor={COLORS.textLight}
                                value={form.regNo}
                                autoCapitalize="characters"
                                onChangeText={v => update('regNo', v)}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Email Address *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="student@ecc.edu"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={form.email}
                                onChangeText={v => update('email', v)}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Password *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Assign temporary password"
                                placeholderTextColor={COLORS.textLight}
                                secureTextEntry
                                value={form.password}
                                onChangeText={v => update('password', v)}
                            />
                        </View>
                    </Card>

                    <Card>
                        <Text style={styles.sectionTitle}>Academic Year *</Text>
                        <View style={styles.catGrid}>
                            {yearOptions.map(y => (
                                <TouchableOpacity
                                    key={y}
                                    style={[styles.catChip, form.year === y && styles.catChipActive]}
                                    onPress={() => update('year', y)}
                                >
                                    <Text style={[styles.catText, form.year === y && styles.catTextActive]}>{y}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>

                    <TouchableOpacity
                        style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                        onPress={handleAdd}
                        disabled={submitting}
                    >
                        <Ionicons name="person-add" size={20} color={COLORS.white} />
                        <Text style={styles.submitText}>{submitting ? 'Registering...' : 'Register Student'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: 16, paddingBottom: 40 },

    sectionTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
    field: { marginBottom: 14 },
    label: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
    input: {
        borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 10,
        fontSize: SIZES.base, color: COLORS.textPrimary, backgroundColor: COLORS.background,
    },

    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    catChip: {
        paddingHorizontal: 16, height: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 20,
        backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    },
    catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    catText: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontWeight: '500', textAlign: 'center' },
    catTextActive: { color: COLORS.white, fontWeight: '600' },

    submitBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 12,
        paddingVertical: 15, marginTop: 8, gap: 8,
    },
    submitText: { color: COLORS.white, fontSize: SIZES.base, fontWeight: '700' },
});
