import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { fetchCourses } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../components/Logo';

// single course card component
const CourseCard = ({ item, onPress }) => {
  const [useFallback, setUseFallback] = React.useState(false);
  const imageUri = useFallback ? item.fallbackUrl : item.coverUrl;

  return (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.8}>
    <View style={styles.cardLeft}>
      <Image
        source={{ uri: imageUri }}
        style={styles.cover}
        resizeMode="cover"
        onError={() => {
          if (!useFallback) setUseFallback(true);
        }}
      />
    </View>
    <View style={styles.cardRight}>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardAuthor} numberOfLines={1}>✍️ {item.author}</Text>
      <Text style={styles.cardYear}>📅 {item.year}</Text>
      {item.subjects.length > 0 && (
        <View style={styles.tags}>
          {item.subjects.slice(0, 2).map((s, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>{s}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
    {/* navigation indicator */}
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const loadCourses = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchCourses('programming', 20);
      setCourses(data);
      setFiltered(data);
    } catch (err) {
      console.log('Error loading courses:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // filter locally whenever search text changes
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(courses);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        courses.filter(
          (c) => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
        )
      );
    }
  }, [search, courses]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  const goToDetail = (course) => navigation.navigate('Detail', { course });

  return (
    <View style={styles.container}>
      {/* Header with logo */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Logo size="medium" />
        <Text style={styles.greeting}>Hi, {user?.username || 'Student'} 👋</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      <Text style={styles.sectionTitle}>
        📚 Available books {!loading && `(${filtered.length})`}
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadCourses}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => <CourseCard item={item} onPress={goToDetail} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4F46E5']}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No books found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: { color: '#6B7280', fontSize: 13 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: { marginRight: 8, fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#1F2937' },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  cardLeft: { marginRight: 12 },
  cover: { width: 60, height: 80, borderRadius: 6 },
  coverPlaceholder: {
    width: 60,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: { fontSize: 28 },
  cardRight: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 20,
  },
  cardAuthor: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  cardYear: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, color: '#4F46E5', maxWidth: 100 },
  arrow: { fontSize: 24, color: '#9CA3AF', marginLeft: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  retryBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});

export default HomeScreen;
