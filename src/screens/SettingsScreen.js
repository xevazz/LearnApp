import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { getSettings, saveSettings, updateUsername } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const s = await getSettings();
      setDarkMode(s.darkMode);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'El nombre de usuario no puede estar vacío.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateUsername(username.trim());
      if (updated) updateUser(updated);
      await saveSettings({ darkMode });
      Alert.alert('Configuración guardada', 'Los cambios han sido guardados correctamente.');
    } catch (_) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const toggleDarkMode = async (val) => {
    setDarkMode(val);
    const current = await getSettings();
    await saveSettings({ ...current, darkMode: val });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PERFIL</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Tu nombre de usuario"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.email || ''}</Text>
          </View>
          <Text style={styles.hint}>* El correo electrónico no se puede modificar.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>APARIENCIA</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Modo oscuro</Text>
              <Text style={styles.rowSub}>Cambia el tema de la aplicación</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
              thumbColor={darkMode ? '#fff' : '#fff'}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>{saving ? 'Guardando...' : '💾  Guardar cambios'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF' },
  content: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
  },
  readonlyText: { fontSize: 15, color: '#9CA3AF' },
  hint: { fontSize: 11, color: '#9CA3AF', marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  rowSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  saveBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: { backgroundColor: '#A5B4FC' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default SettingsScreen;
