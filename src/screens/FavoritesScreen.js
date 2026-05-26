import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const FavoritesScreen = ({ navigation }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  const FavCard = ({ item }) => {
    const [useFallback, setUseFallback] = React.useState(false);
    const imageUri = useFallback ? item.fallbackUrl : item.coverUrl;
    return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HomeTab', { screen: 'Detail', params: { course: item } })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUri }}
        style={styles.cover}
        resizeMode="cover"
        onError={() => { if (!useFallback) setUseFallback(true); }}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author} numberOfLines={1}>✍️ {item.author}</Text>
        <Text style={styles.year}>📅 {item.year}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.removeBtn}>
        <Text style={{ fontSize: 22 }}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username ? user.username[0].toUpperCase() : '?'}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{user?.username || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <Text style={styles.favCount}>❤️ {favorites.length} favorito{favorites.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mis Favoritos</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <FavCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔖</Text>
            <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
            <Text style={styles.emptyText}>
              Explora los libros y toca el corazón para guardarlos aquí.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF' },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    padding: 20,
    gap: 16,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#F59E0B',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  userName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  userEmail: { color: '#C7D2FE', fontSize: 13, marginTop: 2 },
  favCount: { color: '#E0E7FF', fontSize: 13, marginTop: 4 },
  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: '#374151',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4,
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
  cover: { width: 60, height: 80, borderRadius: 6, marginRight: 12 },
  coverPlaceholder: {
    width: 60, height: 80, borderRadius: 6,
    backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: '#1F2937', lineHeight: 20, marginBottom: 4 },
  author: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  year: { fontSize: 12, color: '#9CA3AF' },
  removeBtn: { padding: 8 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
});

export default FavoritesScreen;
