import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    TextInput, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, SHADOWS, CATEGORIES } from '../../components/theme';
import { CATEGORIES as CATS } from '../../data/mockData';

export default function StudentBooksScreen({ navigation }) {
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
        const available = item.availableCopies > 0;
        return (
            <TouchableOpacity
                style={styles.bookCard}
                onPress={() => navigation.navigate('BookDetail', { book: item })}
                activeOpacity={0.85}
            >
                <View style={[styles.bookCover, { backgroundColor: getColor(item.category) + '18' }]}>
                    <Ionicons name="book" size={28} color={getColor(item.category)} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
                    <View style={styles.metaRow}>
                        <View style={[styles.catBadge, { backgroundColor: getColor(item.category) + '15' }]}>
                            <Text style={[styles.catText, { color: getColor(item.category) }]}>{item.category}</Text>
                        </View>
                        <View style={[styles.availBadge, { backgroundColor: available ? COLORS.success + '15' : COLORS.danger + '15' }]}>
                            <Text style={[styles.availText, { color: available ? COLORS.success : COLORS.danger }]}>
                                {available ? `${item.availableCopies} Available` : 'Unavailable'}
                            </Text>
                        </View>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Search */}
            <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={COLORS.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search books or author..."
                    placeholderTextColor={COLORS.textLight}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Category Filter */}
            <FlatList
                horizontal
                data={CATS}
                keyExtractor={item => item}
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0, minHeight: 55 }}
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

            <Text style={styles.resultCount}>{filtered.length} book{filtered.length !== 1 ? 's' : ''} found</Text>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={renderBook}
                contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="search-outline" size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No books found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const colorMap = {
    'Electronics': COLORS.primary,
    'Communication': '#8B5CF6',
    'VLSI': '#EC4899',
    'Control Systems': COLORS.success,
    'Electromagnetics': '#F97316',
    'Power Electronics': COLORS.accent,
};

const getColor = (cat) => colorMap[cat] || COLORS.primary;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        margin: 16, backgroundColor: COLORS.white, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10,
        borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small,
    },
    searchInput: { flex: 1, fontSize: SIZES.base, color: COLORS.textPrimary },

    catList: { paddingHorizontal: 16, paddingBottom: 8, paddingTop: 4 },
    catChip: {
        width: 120, height: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 20,
        backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border,
        marginRight: 8,
    },
    catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    catChipText: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontWeight: '500', textAlign: 'center' },
    catChipTextActive: { color: COLORS.white, fontWeight: '600' },

    resultCount: { fontSize: SIZES.sm, color: COLORS.textSecondary, paddingHorizontal: 16, marginBottom: 8 },

    bookCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        borderRadius: 12, padding: 14, marginBottom: 10,
        ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.border,
    },
    bookCover: { width: 52, height: 52, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    bookTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textPrimary },
    bookAuthor: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    metaRow: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
    catBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    catText: { fontSize: SIZES.xs, fontWeight: '600' },
    availBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    availText: { fontSize: SIZES.xs, fontWeight: '600' },

    empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText: { fontSize: SIZES.md, color: COLORS.textSecondary },
});
