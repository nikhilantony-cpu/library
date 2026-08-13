import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    TextInput, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../../components/theme';
import { CATEGORIES as CATS } from '../../data/mockData';

const colorMap = {
    'Electronics': COLORS.primary,
    'Communication': '#8B5CF6',
    'VLSI': '#EC4899',
    'Control Systems': COLORS.success,
    'Electromagnetics': '#F97316',
    'Power Electronics': COLORS.accent,
};

export default function LibrarianBooksScreen({ navigation }) {
    const { books } = useApp();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = books.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || b.category === category;
        return matchSearch && matchCat;
    });

    const renderBook = ({ item }) => {
        const color = colorMap[item.category] || COLORS.primary;
        const pct = Math.round((item.availableCopies / item.totalCopies) * 100);

        return (
            <View style={styles.bookCard}>
                <View style={[styles.cover, { backgroundColor: color + '15' }]}>
                    <Ionicons name="book" size={22} color={color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>Shelf: {item.shelf}</Text>
                        <View style={[styles.catBadge, { backgroundColor: color + '15' }]}>
                            <Text style={[styles.catText, { color }]}>{item.category}</Text>
                        </View>
                    </View>
                    <View style={styles.stockRow}>
                        <View style={styles.stockBar}>
                            <View style={[styles.stockFill, { width: `${pct}%`, backgroundColor: item.availableCopies === 0 ? COLORS.danger : COLORS.success }]} />
                        </View>
                        <Text style={[styles.stockText, { color: item.availableCopies === 0 ? COLORS.danger : COLORS.success }]}>
                            {item.availableCopies}/{item.totalCopies}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color={COLORS.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search books..."
                    placeholderTextColor={COLORS.textLight}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                horizontal
                data={CATS}
                keyExtractor={i => i}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.catChip, category === item && styles.catChipActive]}
                        onPress={() => setCategory(item)}
                    >
                        <Text style={[styles.catChipText, category === item && styles.catChipTextActive]}>{item}</Text>
                    </TouchableOpacity>
                )}
            />

            <Text style={styles.count}>{filtered.length} books</Text>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={renderBook}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="book-outline" size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No books found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        margin: 16, backgroundColor: COLORS.white, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10,
        borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small,
    },
    searchInput: { flex: 1, fontSize: SIZES.base, color: COLORS.textPrimary },

    catList: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
    catChip: {
        paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
        backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border,
    },
    catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    catChipText: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontWeight: '500' },
    catChipTextActive: { color: COLORS.white, fontWeight: '600' },

    count: { fontSize: SIZES.sm, color: COLORS.textSecondary, paddingHorizontal: 16, marginBottom: 8 },

    list: { padding: 16, paddingTop: 0, paddingBottom: 30 },
    bookCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        borderRadius: 12, padding: 14, marginBottom: 10,
        ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
    },
    cover: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    author: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    metaText: { fontSize: SIZES.xs, color: COLORS.textSecondary },
    catBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
    catText: { fontSize: SIZES.xs, fontWeight: '600' },
    stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
    stockBar: { flex: 1, height: 5, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
    stockFill: { height: '100%', borderRadius: 3 },
    stockText: { fontSize: SIZES.xs, fontWeight: '700', minWidth: 28 },

    empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText: { fontSize: SIZES.md, color: COLORS.textSecondary },
});
