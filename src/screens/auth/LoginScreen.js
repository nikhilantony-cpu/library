import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    SafeAreaView, KeyboardAvoidingView, Platform, Alert,
    ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../../components/theme';

export default function LoginScreen() {
    const { login, showNotification } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('student'); // 'student' or 'librarian'

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            showNotification('Please enter email and password', 'error');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const result = login(email.trim().toLowerCase(), password.trim());
            setLoading(false);
            if (!result.success) {
                showNotification(result.message, 'error');
            } else {
                showNotification('Login successful!', 'success');
            }
        }, 800);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="library" size={40} color={COLORS.white} />
                        </View>
                        <Text style={styles.collegeName}>UC College</Text>
                        <Text style={styles.appName}>ECC Department Library Management</Text>
                        <Text style={styles.subtitle}>Electronics & Computer science </Text>
                    </View>

                    {/* Role Toggle */}
                    <View style={styles.roleToggle}>
                        <TouchableOpacity
                            style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
                            onPress={() => setRole('student')}
                        >
                            <Ionicons name="school-outline" size={16} color={role === 'student' ? COLORS.white : COLORS.primary} />
                            <Text style={[styles.roleBtnText, role === 'student' && styles.roleBtnTextActive]}>Student</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleBtn, role === 'librarian' && styles.roleBtnActive]}
                            onPress={() => setRole('librarian')}
                        >
                            <Ionicons name="person-outline" size={16} color={role === 'librarian' ? COLORS.white : COLORS.primary} />
                            <Text style={[styles.roleBtnText, role === 'librarian' && styles.roleBtnTextActive]}>Librarian</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Form */}
                    <View style={styles.form}>
                        <Text style={styles.formTitle}>Sign In</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={COLORS.textLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.textLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Text style={styles.loginBtnText}>Login</Text>
                                    <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footer}>ECC Library • Academic Year 2025-26</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { flexGrow: 1, paddingBottom: 30 },

    header: { alignItems: 'center', paddingTop: 50, paddingBottom: 30, backgroundColor: COLORS.primary, paddingHorizontal: 20 },
    logoCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    },
    collegeName: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.white },
    appName: { fontSize: SIZES.lg, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginTop: 2 },
    subtitle: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

    roleToggle: {
        flexDirection: 'row', margin: 20, backgroundColor: COLORS.white,
        borderRadius: 10, padding: 4, ...SHADOWS.small,
    },
    roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
    roleBtnActive: { backgroundColor: COLORS.primary },
    roleBtnText: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.primary },
    roleBtnTextActive: { color: COLORS.white },

    form: { marginHorizontal: 20, backgroundColor: COLORS.white, borderRadius: 16, padding: 20, ...SHADOWS.medium },
    formTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 20 },

    inputGroup: { marginBottom: 16 },
    label: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 10, backgroundColor: COLORS.background,
    },
    inputIcon: { paddingLeft: 12 },
    input: { flex: 1, paddingHorizontal: 10, paddingVertical: 12, fontSize: SIZES.base, color: COLORS.textPrimary },
    eyeBtn: { padding: 12 },

    loginBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 10,
        paddingVertical: 14, marginTop: 8, gap: 8,
    },
    loginBtnText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.white },

    demoLabel: { textAlign: 'center', fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 20, marginBottom: 10 },
    demoRow: { flexDirection: 'row', gap: 10 },
    demoBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8,
        paddingVertical: 8, gap: 5,
    },
    demoBtnText: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },

    footer: { textAlign: 'center', fontSize: SIZES.xs, color: COLORS.textLight, marginTop: 24 },
});
