import React from 'react';
import { View, StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#1A56DB',
    primaryLight: '#EBF5FF',
    primaryDark: '#1139A0',
    secondary: '#0EA5E9',
    accent: '#F59E0B',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    white: '#FFFFFF',
    background: '#F5F7FA',
    card: '#FFFFFF',
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
};

export const FONTS = {
    regular: 'System',
    medium: 'System',
    bold: 'System',
};

export const SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
};

export const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
});
