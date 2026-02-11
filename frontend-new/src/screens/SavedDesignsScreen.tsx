import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  Alert, RefreshControl, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../config';
import theme from '../theme/colors';
import { Room, Design, RootStackParamList } from '../types';
import StyledIcon from '../components/StyledIcon';
import LoadingSpinner from '../components/LoadingSpinner';

type NavProp = StackNavigationProp<RootStackParamList>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 cols with padding

const SavedDesignsScreen = () => {
  const navigation = useNavigation<NavProp>();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'recent'>('all');

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [roomsResponse, designsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/rooms`),
        axios.get(`${API_BASE_URL}/saved-designs`),
      ]);
      setRooms(Array.isArray(roomsResponse.data) ? roomsResponse.data : []);

      const rawDesigns = Array.isArray(designsResponse.data) ? designsResponse.data : [];
      const designsData = rawDesigns.map((d: any) => ({
        id: d.id,
        name: d.name,
        room_id: d.room_id,
        furniture_items: d.furniture_items || [],
        created_at: d.created_at,
      }));
      setDesigns(designsData);
    } catch (error) {
      // silent fail or retry
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const deleteDesign = (id: number, name: string) => {
    Alert.alert('Delete Design', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/saved-designs/${id}`);
            loadData();
          } catch { Alert.alert('Error', 'Failed to delete design.'); }
        },
      },

    ]);
  };

  const openDesign = (design: Design) => {
    const room = rooms.find(r => r.id === design.room_id);
    if (!room) {
      return Alert.alert('Error', 'Room not found. It may have been deleted.');
    }
    const savedFurniture = design.furniture_items.map((item: any) => ({
      furniture_id: item.furniture_id,
      position_x: item.position_x,
      position_y: item.position_y,
      rotation: item.rotation,
    }));
    navigation.navigate('DesignStudio', { room, savedFurniture });
  };

  const filteredDesigns = filter === 'recent'
    ? [...designs].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()).slice(0, 5)
    : designs;

  const getRoomName = (roomId: number) => {
    if (!Array.isArray(rooms)) return 'Unknown Room';
    return rooms.find(r => r.id === roomId)?.name || 'Unknown Room';
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={[theme.colors.background, '#F0F2FF']}
          style={StyleSheet.absoluteFill}
        />
        <LoadingSpinner message="Loading designs…" />
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
        colors={theme.colors.gradientDark}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Gallery</Text>
            <Text style={styles.headerSub}>Your masterpieces</Text>
          </View>
          <View style={styles.filterPill}>
            <TouchableOpacity
              style={[styles.filterOpt, filter === 'all' && styles.filterOptActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOpt, filter === 'recent' && styles.filterOptActive]}
              onPress={() => setFilter('recent')}
            >
              <Text style={[styles.filterText, filter === 'recent' && styles.filterTextActive]}>Recent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Grid List */}
      <FlatList
        key="grid-layout"
        data={filteredDesigns}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <StyledIcon name="saved" size="lg" color={theme.colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No designs</Text>
            <Text style={styles.emptyDesc}>Save your first design from the Studio</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => openDesign(item)}
            activeOpacity={0.9}
          >
            <View style={styles.cardPreview}>
              <StyledIcon name="design" size="xl" color={theme.colors.primary + '40'} />
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.furniture_items.length} items</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardRoom} numberOfLines={1}>{getRoomName(item.room_id)}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteDesign(item.id, item.name)} style={{ padding: 4 }}>
                  <StyledIcon name="remove" size="xs" color={theme.colors.textLight} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button for easy creation if list is long? No, we have the tab bar */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
    ...theme.shadows.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  // Filter Pill
  filterPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 4,
  },
  filterOpt: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  filterOptActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  filterTextActive: {
    color: theme.colors.primary,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },

  gridCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    ...theme.shadows.small,
    overflow: 'hidden',
  },
  cardPreview: {
    height: 100,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  cardContent: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  cardRoom: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textLight,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.small,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
});

export default SavedDesignsScreen;