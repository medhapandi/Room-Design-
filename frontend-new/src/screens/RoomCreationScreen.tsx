import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../config';
import theme from '../theme/colors';
import { Room, RootStackParamList } from '../types';
import StyledIcon from '../components/StyledIcon';
import LoadingSpinner from '../components/LoadingSpinner';

type NavProp = StackNavigationProp<RootStackParamList>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TEMPLATES = [
  { name: 'Living Room', width: 15, depth: 12, icon: 'sofa', color: ['#FF9A9E', '#FECFEF'] },
  { name: 'Bedroom', width: 12, depth: 10, icon: 'bed', color: ['#a18cd1', '#fbc2eb'] },
  { name: 'Office', width: 10, depth: 8, icon: 'chair', color: ['#84fab0', '#8fd3f4'] },
  { name: 'Dining', width: 14, depth: 11, icon: 'table', color: ['#fccb90', '#d57eeb'] },
];

const RoomCreationScreen = () => {
  const navigation = useNavigation<NavProp>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({ name: '', width: '', depth: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      if (Array.isArray(response.data)) {
        setRooms(response.data);
      } else {
        console.warn('Invalid rooms data received:', response.data);
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      Alert.alert('Connection Error', 'Could not fetch rooms. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchRooms(); }, []));

  const createOrUpdateRoom = async () => {
    const width = parseFloat(newRoom.width);
    const depth = parseFloat(newRoom.depth);
    if (!newRoom.name.trim()) return Alert.alert('Missing', 'Please enter a room name.');
    if (isNaN(width) || width <= 0) return Alert.alert('Invalid', 'Width must be a positive number.');
    if (isNaN(depth) || depth <= 0) return Alert.alert('Invalid', 'Depth must be a positive number.');

    try {
      setLoading(true);
      if (editingRoomId) {
        await axios.put(`${API_BASE_URL}/rooms/${editingRoomId}`, { name: newRoom.name, width, depth });
        Alert.alert('Success', 'Room updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/rooms`, { name: newRoom.name, width, depth });
      }
      setNewRoom({ name: '', width: '', depth: '' });
      setEditingRoomId(null);
      setShowForm(false);
      await fetchRooms();
    } catch (error) {
      Alert.alert('Error', `Failed to ${editingRoomId ? 'update' : 'create'} room.`);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (room: Room) => {
    setNewRoom({ name: room.name, width: String(room.width), depth: String(room.depth) });
    setEditingRoomId(room.id);
    setShowForm(true);
  };

  const deleteRoom = (id: number, name: string) => {
    Alert.alert('Delete Room', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/rooms/${id}`);
            fetchRooms();
          } catch { Alert.alert('Error', 'Failed to delete room.'); }
        },
      },
    ]);
  };

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setNewRoom({ name: t.name, width: String(t.width), depth: String(t.depth) });
    setEditingRoomId(null);
    setShowForm(true);
  };

  if (loading && rooms.length === 0) {
    return (
      <View style={styles.screen}>
        <LoadingSpinner message="Loading rooms…" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[theme.colors.background, '#F0F2FF']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>My Rooms</Text>
            <Text style={styles.headerSub}>Design your spaces</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (showForm) {
                setShowForm(false);
                setEditingRoomId(null);
                setNewRoom({ name: '', width: '', depth: '' });
              } else {
                setShowForm(true);
              }
            }}
            activeOpacity={0.8}
          >
            <StyledIcon name={showForm ? "cross" : "add"} size="md" color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* Create Room Form (Collapsible) */}
        {showForm ? (
          <View style={styles.formContainer}>
            <Text style={styles.sectionLabel}>{editingRoomId ? 'EDIT ROOM' : 'CREATE NEW ROOM'}</Text>
            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={newRoom.name}
                  onChangeText={name => setNewRoom(p => ({ ...p, name }))}
                  placeholder="e.g. Master Bedroom"
                  placeholderTextColor={theme.colors.textLight}
                />
              </View>
              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Width (ft)</Text>
                  <TextInput
                    style={styles.input}
                    value={newRoom.width}
                    onChangeText={width => setNewRoom(p => ({ ...p, width }))}
                    placeholder="15"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textLight}
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Depth (ft)</Text>
                  <TextInput
                    style={styles.input}
                    value={newRoom.depth}
                    onChangeText={depth => setNewRoom(p => ({ ...p, depth }))}
                    placeholder="12"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textLight}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={createOrUpdateRoom} activeOpacity={0.9} style={styles.createBtnFull}>
                <LinearGradient
                  colors={theme.colors.gradientPrimary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createBtnGradient}
                >
                  <Text style={styles.createBtnText}>{editingRoomId ? 'Update Room' : 'Create Room'}</Text>
                  <StyledIcon name="arrowRight" size="sm" color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Templates Only Show if Form Hidden to save space? Or always show? 
          // Let's keep templates but make them compact strip
          <View style={styles.templatesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateList}>
              <TouchableOpacity style={styles.newRoomChip} onPress={() => setShowForm(true)}>
                <View style={styles.newRoomIconCircle}>
                  <StyledIcon name="add" size="sm" color="#FFFFFF" />
                </View>
                <Text style={styles.newRoomText}>New</Text>
              </TouchableOpacity>
              {TEMPLATES.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.templateChip}
                  onPress={() => applyTemplate(t)}
                >
                  <LinearGradient
                    colors={t.color as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.templateGradient}
                  >
                    <StyledIcon name={t.icon} size="xs" color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.templateTitle}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Existing Rooms List */}
        <View style={styles.roomsList}>
          {Array.isArray(rooms) && rooms.map(room => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomRow}
              onPress={() => navigation.navigate('DesignStudio', { room })}
              activeOpacity={0.9}
            >
              <View style={styles.roomIconBox}>
                <StyledIcon name="room" size="md" color={theme.colors.primary} />
              </View>
              <View style={styles.roomContent}>
                <Text style={styles.roomRowName}>{room.name}</Text>
                <Text style={styles.roomRowDims}>{room.width}ft × {room.depth}ft</Text>
              </View>
              <View style={styles.roomRowActions}>
                <TouchableOpacity onPress={() => startEditing(room)} style={styles.iconBtn}>
                  <StyledIcon name="edit" size="xs" color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRoom(room.id, room.name)} style={styles.iconBtn}>
                  <StyledIcon name="remove" size="xs" color={theme.colors.textLight} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          {rooms.length === 0 && !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No rooms created yet.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingTop: 16, paddingBottom: 30 },

  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadows.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },

  // Templates
  templatesContainer: {
    height: 80,
    marginBottom: 10,
  },
  templateList: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: 'center',
  },
  newRoomChip: {
    alignItems: 'center',
    gap: 6,
    marginRight: 4,
  },
  newRoomIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  newRoomText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  templateChip: {
    alignItems: 'center',
    gap: 6,
  },
  templateGradient: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  templateTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  // Form
  formContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...theme.shadows.medium,
  },
  inputGroup: { marginBottom: 12 },
  rowInputs: { flexDirection: 'row', marginBottom: 20 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  createBtnFull: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  createBtnGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Rooms List
  roomsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...theme.shadows.small,
  },
  roomIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomContent: {
    flex: 1,
    marginLeft: 14,
  },
  roomRowName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  roomRowDims: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  roomRowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textLight,
  },
});

export default RoomCreationScreen;