import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const MenuItem = ({ icon, label, sublabel, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <Text style={styles.menuIconText}>{icon}</Text>
    </View>
    <View style={styles.menuTextBox}>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {sublabel ? <Text style={styles.menuSublabel}>{sublabel}</Text> : null}
    </View>
    {!danger && <Text style={styles.menuArrow}>›</Text>}
  </TouchableOpacity>
);

const SettingsMenuScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* User info */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username ? user.username[0].toUpperCase() : '?'}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{user?.username || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>
      </View>

      {/* Menu options */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>OPCIONES</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="⚙️"
            label="Configuración"
            sublabel="Perfil y preferencias"
            onPress={() => navigation.navigate('Settings')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="🔔"
            label="Notificaciones"
            sublabel="Administrar alertas"
            onPress={() => navigation.navigate('Notifications')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CUENTA</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="🚪"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>

      <Text style={styles.version}>LearnApp v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF', padding: 16 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#F59E0B',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  userName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  userEmail: { color: '#C7D2FE', fontSize: 13, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  menuIconDanger: { backgroundColor: '#FEF2F2' },
  menuIconText: { fontSize: 20 },
  menuTextBox: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  menuLabelDanger: { color: '#DC2626' },
  menuSublabel: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  menuArrow: { fontSize: 22, color: '#9CA3AF' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 68 },
  version: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 'auto', paddingBottom: 16 },
});

export default SettingsMenuScreen;
