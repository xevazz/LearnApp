import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Logo = ({ size = 'medium', color = '#4F46E5' }) => {
  const sizes = {
    small: { icon: 28, text: 16 },
    medium: { icon: 40, text: 22 },
    large: { icon: 56, text: 30 },
  };
  const s = sizes[size] || sizes.medium;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { width: s.icon + 12, height: s.icon + 12, borderRadius: (s.icon + 12) / 2, backgroundColor: color }]}>
        <Text style={[styles.iconText, { fontSize: s.icon * 0.6 }]}>📚</Text>
      </View>
      <Text style={[styles.brandText, { fontSize: s.text, color }]}>
        Learn<Text style={{ color: '#F59E0B' }}>App</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {},
  brandText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default Logo;
