import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fetchCourseDetail } from '../services/apiService';
import { useFavorites } from '../context/FavoritesContext';

const DetailScreen = ({ route, navigation }) => {
  const { course } = route.params;
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFav = checkIsFavorite(course.key);
  const [useFallback, setUseFallback] = useState(false);
  const imageUri = useFallback ? course.fallbackUrl : course.coverUrl;

  // fetch extra details from the API using the book's work key
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCourseDetail(course.key);
        setDetail(data);
      } catch (err) {
        console.log('Could not load detail:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [course.key]);

  // add favorite toggle button to the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => toggleFavorite(course)}
          style={{ marginRight: 16 }}
        >
          <Text style={{ fontSize: 24 }}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFav, course, toggleFavorite]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero section with cover image */}
      <View style={styles.hero}>
        <Image
          source={{ uri: imageUri }}
          style={styles.cover}
          resizeMode="cover"
          onError={() => { if (!useFallback) setUseFallback(true); }}
        />
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{course.title}</Text>
          <Text style={styles.heroAuthor}>✍️ {course.author}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Quick info row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaLabel}>Year</Text>
            <Text style={styles.metaValue}>{course.year}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>{isFav ? '❤️' : '🤍'}</Text>
            <Text style={styles.metaLabel}>Saved</Text>
            <Text style={styles.metaValue}>{isFav ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        {/* Description - loaded from API */}
        <Text style={styles.sectionTitle}>Description</Text>
        {loading ? (
          <ActivityIndicator color="#4F46E5" style={{ marginTop: 16 }} />
        ) : error ? (
          <Text style={styles.noDesc}>No description available.</Text>
        ) : (
          <Text style={styles.description}>
            {detail?.description || 'No description available.'}
          </Text>
        )}

        {/* Topics */}
        {course.subjects.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Topics</Text>
            <View style={styles.tags}>
              {course.subjects.map((s, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Favorites button */}
        <TouchableOpacity
          style={[styles.favBtn, isFav && styles.favBtnActive]}
          onPress={() => toggleFavorite(course)}
        >
          <Text style={styles.favBtnText}>
            {isFav ? '❤️  Remove from favorites' : '🤍  Add to favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF' },
  hero: { height: 220, backgroundColor: '#1F2937', justifyContent: 'flex-end' },
  cover: { ...StyleSheet.absoluteFillObject },
  coverPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: { padding: 16 },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 4,
  },
  heroAuthor: { color: '#D1D5DB', fontSize: 13 },
  body: { padding: 16 },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metaItem: { alignItems: 'center' },
  metaIcon: { fontSize: 22, marginBottom: 4 },
  metaLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 2 },
  metaValue: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  metaDivider: { width: 1, height: 40, backgroundColor: '#E5E7EB' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
    marginTop: 8,
  },
  description: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  noDesc: { color: '#9CA3AF', fontSize: 14, fontStyle: 'italic' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, color: '#4F46E5' },
  favBtn: {
    marginTop: 8,
    marginBottom: 32,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  favBtnActive: { backgroundColor: '#DC2626' },
  favBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default DetailScreen;
