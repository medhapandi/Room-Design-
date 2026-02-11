import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, FlatList, BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../config';
import theme from '../theme/colors';
import { Room, Furniture, PlacedFurniture, RootStackParamList, SavedFurnitureItem } from '../types';
import Room2D from '../components/Room2D';
import CustomModal from '../components/CustomModal';
import FitnessCheckModal from '../components/FitnessCheckModal';
import LoadingSpinner from '../components/LoadingSpinner';
import StyledIcon, { getCategoryIconName } from '../components/StyledIcon';
import { useFitnessCheck } from '../hooks/useFitnessCheck';

type NavProp = StackNavigationProp<RootStackParamList, 'DesignStudio'>;
type RoutePropType = RouteProp<RootStackParamList, 'DesignStudio'>;

const DesignStudioScreen = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { room, savedFurniture } = route.params;

  // State
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [placedFurniture, setPlacedFurniture] = useState<PlacedFurniture[]>([]);
  const [selectedPlacedItem, setSelectedPlacedItem] = useState<PlacedFurniture | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'furniture' | 'controls'>('furniture');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Custom Hooks
  const {
    fitnessResult,
    loading: fitnessLoading,
    fitnessModalVisible,
    error: fitnessError,
    checkFitness,
    closeFitnessModal: resetFitness,
    clearError,
  } = useFitnessCheck();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  // Error handling from hook
  useEffect(() => {
    if (fitnessError) {
      showModal('error', 'Fitness Check Failed', fitnessError);
      clearError();
    }
  }, [fitnessError]);

  // ─── Data Loading ────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/furniture`);
        setFurniture(response.data);

        if (savedFurniture && savedFurniture.length > 0) {
          const placed: PlacedFurniture[] = savedFurniture
            .map((sf: SavedFurnitureItem, index: number) => {
              const furnitureItem = response.data.find(
                (f: Furniture) => f.id === sf.furniture_id
              );
              if (!furnitureItem) return null;
              return {
                id: Date.now() + index,
                furniture: furnitureItem,
                position: { x: sf.position_x, y: sf.position_y },
                rotation: sf.rotation,
              };
            })
            .filter(Boolean) as PlacedFurniture[];
          setPlacedFurniture(placed);
        }
      } catch (error) {
        showModal('error', 'Connection Error', 'Cannot reach the server. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ─── Back handler ────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (hasUnsavedChanges) {
          Alert.alert('Unsaved Changes', 'You have unsaved changes. Are you sure you want to leave?', [
            { text: 'Stay', style: 'cancel' },
            { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
          ]);
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [hasUnsavedChanges])
  );

  // ─── Furniture Actions ───────────────────────────────
  const addFurniture = (item: Furniture) => {
    const newItem: PlacedFurniture = {
      id: Date.now(),
      furniture: item,
      position: { x: 0, y: 0 },
      rotation: 0,
    };
    setPlacedFurniture(prev => [...prev, newItem]);
    setSelectedPlacedItem(newItem);
    resetFitness();
    setHasUnsavedChanges(true);
    setActiveTab('controls');
  };

  const removeFurniture = (id: number) => {
    setPlacedFurniture(prev => prev.filter(item => item.id !== id));
    if (selectedPlacedItem?.id === id) setSelectedPlacedItem(null);
    resetFitness();
    setHasUnsavedChanges(true);
  };

  const rotateFurniture = (id: number) => {
    setPlacedFurniture(prev =>
      prev.map(item =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
    const updated = placedFurniture.find(i => i.id === id);
    if (updated) {
      const rotated = { ...updated, rotation: (updated.rotation + 90) % 360 };
      setSelectedPlacedItem(rotated);
    }
    resetFitness();
    setHasUnsavedChanges(true);
  };

  const updateFurniturePosition = (id: number, position: { x: number; y: number }) => {
    setPlacedFurniture(prev =>
      prev.map(item => (item.id === id ? { ...item, position } : item))
    );
    if (selectedPlacedItem?.id === id) {
      setSelectedPlacedItem(prev => prev ? { ...prev, position } : null);
    }
    resetFitness();
    setHasUnsavedChanges(true);
  };

  const clearAllFurniture = () => {
    Alert.alert('Clear All', 'Remove all furniture from the room?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => {
          setPlacedFurniture([]);
          setSelectedPlacedItem(null);
          resetFitness();
          setHasUnsavedChanges(true);
        },
      },
    ]);
  };

  // ─── Position Helpers ────────────────────────────────
  const getEffectiveDimensions = (item: PlacedFurniture) => {
    const w = item.rotation % 180 === 0 ? item.furniture.width : item.furniture.depth;
    const d = item.rotation % 180 === 0 ? item.furniture.depth : item.furniture.width;
    return { w, d };
  };

  const moveSelectedItem = (dx: number, dy: number) => {
    if (!selectedPlacedItem) return;
    const { w, d } = getEffectiveDimensions(selectedPlacedItem);
    const newX = Math.max(0, Math.min(room.width - w, selectedPlacedItem.position.x + dx));
    const newY = Math.max(0, Math.min(room.depth - d, selectedPlacedItem.position.y + dy));
    updateFurniturePosition(selectedPlacedItem.id, { x: newX, y: newY });
  };

  // ─── Fitness Check ───────────────────────────────────
  const handleCheckFitness = () => {
    if (placedFurniture.length === 0) {
      return showModal('info', 'No Furniture', 'Place some furniture items first before running a fitness check.');
    }
    checkFitness(room, placedFurniture);
  };

  // ─── Save Design ─────────────────────────────────────
  const saveDesign = async () => {
    if (placedFurniture.length === 0) {
      return showModal('info', 'Nothing to Save', 'Place some furniture items first before saving.');
    }
    const designData = {
      name: `${room.name} Design`,
      room_id: room.id,
      furniture_items: placedFurniture.map(item => ({
        furniture_id: item.furniture.id,
        position_x: item.position.x,
        position_y: item.position.y,
        rotation: item.rotation,
      })),
    };
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/save-design`, designData);
      setHasUnsavedChanges(false);
      showModal('success', 'Saved!', 'Your design has been saved successfully.');
    } catch (error) {
      showModal('error', 'Save Failed', 'Could not save the design. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render: Furniture Catalog ───────────────────────
  const renderFurnitureCatalog = () => (
    <View style={styles.catalogContainer}>
      {furniture.length === 0 ? (
        <LoadingSpinner message="Loading furniture…" size="small" />
      ) : (
        <FlatList
          data={furniture}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catalogList}
          renderItem={({ item }) => {
            const alreadyPlaced = placedFurniture.some(p => p.furniture.id === item.id);
            return (
              <TouchableOpacity
                style={[styles.catalogCard, alreadyPlaced && styles.catalogCardPlaced]}
                onPress={() => addFurniture(item)}
                activeOpacity={0.85}
              >
                <View style={[styles.catalogIconWrap, alreadyPlaced && styles.catalogIconPlaced]}>
                  <StyledIcon
                    name={getCategoryIconName(item.type)}
                    size="md"
                    color={alreadyPlaced ? theme.colors.white : theme.colors.primary}
                  />
                </View>
                <Text style={styles.catalogName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.catalogDims}>{item.width}×{item.depth}ft</Text>
                {alreadyPlaced && (
                  <View style={styles.placedBadge}>
                    <StyledIcon name="check" size="xs" color={theme.colors.success} />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );

  // ─── Render: Furniture Controls ──────────────────────
  const renderFurnitureControls = () => {
    if (!selectedPlacedItem) {
      return (
        <View style={styles.controlsEmpty}>
          <StyledIcon name="move" size="lg" color={theme.colors.textLight} />
          <Text style={styles.controlsEmptyText}>Select an item to adjust</Text>
          {placedFurniture.length > 0 && (
            <TouchableOpacity style={styles.clearAllBtn} onPress={clearAllFurniture}>
              <StyledIcon name="remove" size="sm" color={theme.colors.error} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.controlsContainer}>
        {/* Selected item info */}
        <View style={styles.controlsHeader}>
          <View style={styles.controlsIconWrap}>
            <StyledIcon
              name={getCategoryIconName(selectedPlacedItem.furniture.type)}
              size="md"
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.controlsInfo}>
            <Text style={styles.controlsName}>{selectedPlacedItem.furniture.name}</Text>
            <Text style={styles.controlsDims}>
              {selectedPlacedItem.furniture.width}×{selectedPlacedItem.furniture.depth}ft · {selectedPlacedItem.rotation}°
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.controlsActions}>
          <TouchableOpacity
            style={styles.controlAction}
            onPress={() => rotateFurniture(selectedPlacedItem.id)}
          >
            <StyledIcon name="rotate" size="sm" color={theme.colors.primary} />
            <Text style={styles.controlActionText}>Rotate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlAction, styles.controlActionDanger]}
            onPress={() => removeFurniture(selectedPlacedItem.id)}
          >
            <StyledIcon name="remove" size="sm" color={theme.colors.error} />
            <Text style={[styles.controlActionText, { color: theme.colors.error }]}>Remove</Text>
          </TouchableOpacity>
        </View>

        {/* Position arrows */}
        <View style={styles.positionSection}>
          <Text style={styles.positionLabel}>POSITION</Text>
          <Text style={styles.positionCoords}>
            X: {selectedPlacedItem.position.x.toFixed(1)} · Y: {selectedPlacedItem.position.y.toFixed(1)}
          </Text>

          <View style={styles.arrowGrid}>
            <View style={styles.arrowRow}>
              <View style={styles.arrowSpacer} />
              <TouchableOpacity style={styles.arrowBtn} onPress={() => moveSelectedItem(0, -0.5)}>
                <StyledIcon name="arrowUp" size="sm" color={theme.colors.primary} />
              </TouchableOpacity>
              <View style={styles.arrowSpacer} />
            </View>
            <View style={styles.arrowRow}>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => moveSelectedItem(-0.5, 0)}>
                <StyledIcon name="arrowLeft" size="sm" color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => moveSelectedItem(0, 0.5)}>
                <StyledIcon name="arrowDown" size="sm" color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => moveSelectedItem(0.5, 0)}>
                <StyledIcon name="arrowRight" size="sm" color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {placedFurniture.length > 1 && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={clearAllFurniture}>
            <StyledIcon name="remove" size="xs" color={theme.colors.error} />
            <Text style={styles.clearAllText}>Clear All ({placedFurniture.length})</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ─── Main Render ─────────────────────────────────────
  if (loading && furniture.length === 0) {
    return (
      <View style={styles.screen}>
        <LoadingSpinner message="Loading Design Studio…" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={theme.colors.gradientDark}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <StyledIcon name="chevronBack" size="md" color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{room.name}</Text>
              <Text style={styles.headerSub}>
                {room.width}×{room.depth}ft · {placedFurniture.length} items
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerActionBtn} onPress={handleCheckFitness}>
                <StyledIcon name="fitness" size="sm" color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionBtn} onPress={saveDesign}>
                <StyledIcon name="save" size="sm" color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Room 2D View */}
        <Room2D
          room={room}
          placedFurniture={placedFurniture}
          selectedItem={selectedPlacedItem}
          fitnessResult={fitnessResult}
          onSelectItem={setSelectedPlacedItem}
          onUpdatePosition={updateFurniturePosition}
        />

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'furniture' && styles.tabActive]}
            onPress={() => setActiveTab('furniture')}
          >
            <StyledIcon
              name="furniture"
              size="sm"
              color={activeTab === 'furniture' ? theme.colors.primary : theme.colors.textLight}
            />
            <Text style={[styles.tabText, activeTab === 'furniture' && styles.tabTextActive]}>
              Catalog
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'controls' && styles.tabActive]}
            onPress={() => setActiveTab('controls')}
          >
            <StyledIcon
              name="move"
              size="sm"
              color={activeTab === 'controls' ? theme.colors.primary : theme.colors.textLight}
            />
            <Text style={[styles.tabText, activeTab === 'controls' && styles.tabTextActive]}>
              Controls
            </Text>
            {selectedPlacedItem && (
              <View style={styles.tabDot} />
            )}
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'furniture' && renderFurnitureCatalog()}
          {activeTab === 'controls' && renderFurnitureControls()}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity onPress={handleCheckFitness} activeOpacity={0.85} style={{ flex: 1 }}>
            <LinearGradient
              colors={theme.colors.gradientCool}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bottomBtn}
            >
              <StyledIcon name="fitness" size="sm" color="#FFFFFF" />
              <Text style={styles.bottomBtnText}>Check Fitness</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDesign} activeOpacity={0.85} style={{ flex: 1 }}>
            <LinearGradient
              colors={theme.colors.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bottomBtn}
            >
              <StyledIcon name="save" size="sm" color="#FFFFFF" />
              <Text style={styles.bottomBtnText}>Save Design</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <CustomModal
        visible={modalVisible}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      {fitnessResult && (
        <FitnessCheckModal
          visible={fitnessModalVisible}
          allFits={fitnessResult.all_fits}
          results={fitnessResult.results || []}
          overallMessage={fitnessResult.overall_message || ''}
          onClose={resetFitness}
        />
      )}
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 24 },

  // Header
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { flex: 1, marginLeft: 12 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    marginTop: 1,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    ...theme.shadows.small,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: theme.colors.primaryGhost,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textLight,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
  },
  tabContent: {
    minHeight: 140,
  },

  // Catalog
  catalogContainer: {
    paddingVertical: 12,
  },
  catalogList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  catalogCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    alignItems: 'center',
    width: 95,
    ...theme.shadows.small,
  },
  catalogCardPlaced: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '40',
  },
  catalogIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catalogIconPlaced: {
    backgroundColor: theme.colors.primary,
  },
  catalogName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  catalogDims: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  placedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },

  // Controls
  controlsEmpty: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  controlsEmptyText: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  controlsContainer: {
    padding: 16,
  },
  controlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  controlsIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsInfo: { marginLeft: 12 },
  controlsName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  controlsDims: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
    marginTop: 1,
  },
  controlsActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  controlAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryGhost,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
  },
  controlActionDanger: {
    backgroundColor: theme.colors.errorLight,
  },
  controlActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Position
  positionSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  positionLabel: {
    ...theme.typography.label,
    marginBottom: 4,
  },
  positionCoords: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 10,
  },
  arrowGrid: { alignItems: 'center', gap: 6 },
  arrowRow: { flexDirection: 'row', gap: 6 },
  arrowSpacer: { width: 44, height: 44 },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },

  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: theme.colors.errorLight,
    borderRadius: theme.borderRadius.sm,
    marginTop: 8,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.error,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  bottomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
  },
  bottomBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default DesignStudioScreen;