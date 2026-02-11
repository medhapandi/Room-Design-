import React, { useRef, useMemo, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, PanResponder, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Room, PlacedFurniture } from '../types';
import theme from '../theme/colors';
import StyledIcon, { getCategoryIconName } from './StyledIcon';

interface Room2DProps {
  room: Room;
  placedFurniture: PlacedFurniture[];
  selectedItem: PlacedFurniture | null;
  fitnessResult?: any;
  onSelectItem: (item: PlacedFurniture) => void;
  onUpdatePosition: (id: number, position: { x: number; y: number }) => void;
}

// ─── Draggable Furniture Piece ─────────────────────────
const DraggableFurniture: React.FC<{
  item: PlacedFurniture;
  room: Room;
  scale: number;
  isSelected: boolean;
  color: string;
  onSelectItem: (item: PlacedFurniture) => void;
  onUpdatePosition: (id: number, position: { x: number; y: number }) => void;
}> = ({ item, room, scale, isSelected, color, onSelectItem, onUpdatePosition }) => {
  const startPositionRef = useRef({ x: 0, y: 0 });

  const effectiveWidth = item.rotation % 180 === 0 ? item.furniture.width : item.furniture.depth;
  const effectiveDepth = item.rotation % 180 === 0 ? item.furniture.depth : item.furniture.width;

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 2 || Math.abs(gs.dy) > 2,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      startPositionRef.current = { x: item.position.x, y: item.position.y };
      onSelectItem(item);
    },
    onPanResponderMove: (_, gestureState) => {
      const dx = gestureState.dx / scale;
      const dy = gestureState.dy / scale;
      const w = item.rotation % 180 === 0 ? item.furniture.width : item.furniture.depth;
      const d = item.rotation % 180 === 0 ? item.furniture.depth : item.furniture.width;
      const newX = Math.max(0, Math.min(room.width - w, startPositionRef.current.x + dx));
      const newY = Math.max(0, Math.min(room.depth - d, startPositionRef.current.y + dy));
      const snappedX = Math.round(newX * 2) / 2;
      const snappedY = Math.round(newY * 2) / 2;
      onUpdatePosition(item.id, { x: snappedX, y: snappedY });
    },
    onPanResponderRelease: () => {
      startPositionRef.current = { x: item.position.x, y: item.position.y };
    },
  }), [item.id, item.furniture.width, item.furniture.depth, item.rotation, room.width, room.depth, scale]);

  const itemW = effectiveWidth * scale;
  const itemH = effectiveDepth * scale;
  const showLabel = itemW > 35 && itemH > 25;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.furnitureItem,
        {
          width: itemW,
          height: itemH,
          left: item.position.x * scale,
          top: item.position.y * scale,
          backgroundColor: color,
          borderWidth: isSelected ? 2.5 : 0,
          borderColor: isSelected ? '#FFD93D' : 'transparent',
        },
      ]}
    >
      <StyledIcon
        name={getCategoryIconName(item.furniture.type)}
        size={itemW > 40 ? 'sm' : 'xs'}
        color="rgba(255,255,255,0.9)"
      />
      {showLabel && (
        <Text style={styles.furnitureLabel} numberOfLines={1}>
          {item.furniture.name}
        </Text>
      )}
    </View>
  );
};

// ─── Main Room2D Component ─────────────────────────────
const Room2D: React.FC<Room2DProps> = ({
  room,
  placedFurniture,
  selectedItem,
  fitnessResult,
  onSelectItem,
  onUpdatePosition,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const maxWidth = Dimensions.get('window').width - 56;
  const baseScale = Math.min(maxWidth / room.width, 250 / room.depth, 20);
  const scale = baseScale * zoomLevel;
  const actualRoomWidth = room.width * scale;
  const actualRoomDepth = room.depth * scale;

  const gridLinesX = [];
  const gridLinesY = [];
  for (let i = 1; i < room.width; i++) gridLinesX.push(i);
  for (let i = 1; i < room.depth; i++) gridLinesY.push(i);

  const getFurnitureColor = (item: PlacedFurniture) => {
    if (!fitnessResult) return theme.colors.primary + 'CC';
    const result = fitnessResult?.results?.find(
      (r: any) => r.furniture_id === item.furniture.id
    );
    if (!result) return theme.colors.primary + 'CC';
    return result.fits && !result.collisions?.length ? theme.colors.success : theme.colors.error;
  };

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.headerRow}>
        <StyledIcon name="layout" size="md" color={theme.colors.primary} />
        <Text style={styles.title}>2D Layout</Text>
      </View>
      <Text style={styles.subtitle}>
        {room.name} · {room.width}×{room.depth}ft · {placedFurniture.length} items
      </Text>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoomLevel(z => Math.max(0.5, z - 0.2))}>
          <StyledIcon name="remove" size="xs" color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoomLevel(z => Math.min(3.0, z + 0.2))}>
          <StyledIcon name="add" size="xs" color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.zoomBtn, { marginLeft: 8 }]} onPress={() => setZoomLevel(1.0)}>
          <StyledIcon name="refresh" size="xs" color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Room canvas */}
      <View style={styles.canvasWrapper}>
        <ScrollView
          style={styles.scrollOuter}
          contentContainerStyle={styles.scrollContent}
          maximumZoomScale={3}
          minimumZoomScale={0.5}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollContent}
            showsHorizontalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <View style={[styles.roomOutline, { width: actualRoomWidth, height: actualRoomDepth, margin: 20 }]}>
              {/* Grid */}
              {gridLinesX.map(i => (
                <View
                  key={`gx-${i}`}
                  style={[styles.gridLineV, { left: i * scale, height: actualRoomDepth }]}
                />
              ))}
              {gridLinesY.map(i => (
                <View
                  key={`gy-${i}`}
                  style={[styles.gridLineH, { top: i * scale, width: actualRoomWidth }]}
                />
              ))}

              {/* Room name badge */}
              <View style={styles.roomBadge}>
                <Text style={styles.roomBadgeText}>{room.name}</Text>
              </View>

              {/* Dimension labels */}
              <View style={styles.widthLabelContainer}>
                <Text style={styles.dimLabel}>{room.width}ft</Text>
              </View>
              <View style={styles.depthLabelContainer}>
                <Text style={styles.dimLabel}>{room.depth}ft</Text>
              </View>

              {/* Door indicator */}
              <View style={styles.doorIndicator}>
                <StyledIcon name="door" size="xs" color={theme.colors.textLight} />
              </View>

              {/* Furniture */}
              {placedFurniture.map(item => (
                <DraggableFurniture
                  key={item.id}
                  item={item}
                  room={room}
                  scale={scale}
                  isSelected={selectedItem?.id === item.id}
                  color={getFurnitureColor(item)}
                  onSelectItem={onSelectItem}
                  onUpdatePosition={onUpdatePosition}
                />
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      {/* Fitness result badge */}
      {fitnessResult && (
        <LinearGradient
          colors={fitnessResult.all_fits ? theme.colors.gradientSuccess : theme.colors.gradientDanger}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.resultBadge}
        >
          <StyledIcon
            name={fitnessResult.all_fits ? 'check' : 'warning'}
            size="sm"
            color="#FFFFFF"
          />
          <Text style={styles.resultText}>{fitnessResult.overall_message}</Text>
        </LinearGradient>
      )}

      {/* Hint */}
      <View style={styles.hintRow}>
        <StyledIcon name="move" size="xs" color={theme.colors.textLight} />
        <Text style={styles.hint}>
          {placedFurniture.length === 0
            ? 'Add furniture from the catalog below'
            : 'Tap to select · Drag to move'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  canvasWrapper: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 0,
    ...theme.shadows.medium,
    width: '100%',
    height: 350,
    overflow: 'hidden',
  },
  scrollOuter: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  roomOutline: {
    borderWidth: 2,
    borderColor: theme.colors.primary + '40',
    backgroundColor: theme.colors.primaryGhost,
    position: 'relative',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    width: 1,
    backgroundColor: theme.colors.primary + '10',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    height: 1,
    backgroundColor: theme.colors.primary + '10',
  },
  roomBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: theme.colors.white + 'E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
    zIndex: 10,
  },
  roomBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.3,
  },
  widthLabelContainer: {
    position: 'absolute',
    bottom: 3,
    alignSelf: 'center',
    zIndex: 10,
  },
  depthLabelContainer: {
    position: 'absolute',
    right: 3,
    top: '42%',
    zIndex: 10,
  },
  dimLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textLight,
    backgroundColor: theme.colors.white + 'CC',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    letterSpacing: 0.5,
  },
  doorIndicator: {
    position: 'absolute',
    bottom: 2,
    left: '42%',
    zIndex: 10,
  },
  furnitureItem: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    zIndex: 5,
  },
  furnitureLabel: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 2,
    marginTop: 1,
    letterSpacing: 0.2,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.round,
    marginTop: theme.spacing.md,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.white,
    padding: 4,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  zoomBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    minWidth: 36,
    textAlign: 'center',
  },
});

export default Room2D;