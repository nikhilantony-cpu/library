import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS, Card } from '../../components/theme';
import { CATEGORIES } from '../../data/mockData';

export default function AddBookScreen({ navigation }) {
    const { addBook, showNotification } = useApp();
    const [form, setForm] = useState({
        title: '', author: '', isbn: '', category: 'Electronics',
        totalCopies: '', shelf: '', publisher: '', year: '', description: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleAdd = () => {
        const { title, author, isbn, category, totalCopies, shelf } = form;
        if (!title || !author || !isbn || !category || !totalCopies || !shelf) {
            showNotification('Please fill all required fields (marked with *).', 'error');
            return;
        }
        if (isNaN(parseInt(totalCopies)) || parseInt(totalCopies) < 1) {
            showNotification('Please enter a valid number of copies.', 'error');
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            const result = addBook({
                ...form,
                totalCopies: parseInt(totalCopies),
                year: parseInt(form.year) || new Date().getFullYear(),
            });
            setSubmitting(false);
            if (result.success) {
                showNotification(result.message, 'success');
                navigation.goBack();
            }
        }, 500);
    };

    const cats = CATEGORIES.filter(c => c !== 'All');

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    <Card>
                        <Text style={styles.sectionTitle}>Book Information</Text>

                        <View style={styles.field}>
                            <Text style={styles.label}>Title *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter book title"
                                placeholderTextColor={COLORS.textLight}
                                value={form.title}
                                onChangeText={v => update('title', v)}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Author *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter author name"
                                placeholderTextColor={COLORS.textLight}
                                value={form.author}
                                onChangeText={v => update('author', v)}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>ISBN *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 978-0138147570"
                                placeholderTextColor={COLORS.textLight}
                                value={form.isbn}
                                onChangeText={v => update('isbn', v)}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={styles.label}>Total Copies *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 5"
                                    placeholderTextColor={COLORS.textLight}
                                    value={form.totalCopies}
                                    onChangeText={v => update('totalCopies', v)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={styles.label}>Shelf Location *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. A-12"
                                    placeholderTextColor={COLORS.textLight}
                                    value={form.shelf}
                                    onChangeText={v => update('shelf', v)}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={styles.label}>Publisher</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Publisher name"
                                    placeholderTextColor={COLORS.textLight}
                                    value={form.publisher}
                                    onChangeText={v => update('publisher', v)}
                                />
                            </View>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={styles.label}>Year</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 2020"
                                    placeholderTextColor={COLORS.textLight}
                                    value={form.year}
                                    onChangeText={v => update('year', v)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </Card>

                    {/* Category */}
                    <Card>
                        <Text style={styles.sectionTitle}>Category *</Text>
                        <View style={styles.catGrid}>
                            {cats.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.catChip, form.category === cat && styles.catChipActive]}
                                    onPress={() => update('category', cat)}
                                >
                                    <Text style={[styles.catText, form.category === cat && styles.catTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>

                    {/* Description */}
                    <Card>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Brief description about the book..."
                            placeholderTextColor={COLORS.textLight}
                            value={form.description}
                            onChangeText={v => update('description', v)}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </Card>

                    <TouchableOpacity
                        style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                        onPress={handleAdd}
                        disabled={submitting}
                    >
                        <Ionicons name="add-circle" size={20} color={COLORS.white} />
                        <Text style={styles.submitText}>{submitting ? 'Adding...' : 'Add Book to Library'}</Text>
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
    row: { flexDirection: 'row', gap: 12 },
    label: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
    input: {
        borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 10,
        fontSize: SIZES.base, color: COLORS.textPrimary, backgroundColor: COLORS.background,
    },
    textArea: { height: 90, paddingTop: 10 },

    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    catChip: {
        width: 120, height: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 20,
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
