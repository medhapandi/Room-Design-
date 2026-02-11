import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../config';
import theme from '../theme/colors';
import { Furniture, RootStackParamList } from '../types';
import StyledIcon, { getCategoryIconName } from '../components/StyledIcon';
import LoadingSpinner from '../components/LoadingSpinner';

type NavProp = StackNavigationProp<RootStackParamList, 'FurnitureCatalog'>;
type RoutePropType = RouteProp<RootStackParamList, 'FurnitureCatalog'>;

const CATEGORIES = ['all', 'sofa', 'table', 'bed', 'chair', 'storage'];
const SORT_OPTIONS = ['name', 'width', 'depth'] as const;

const FurnitureCatalogScreen = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const onSelectFurniture = route.params?.onSelectFurniture;

  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [filteredFurniture, setFilteredFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>('name');
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/furniture`);
        setFurniture(response.data);
      } catch (error) {
        Alert.alert('Connection Error', 'Cannot reach the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchFurniture();
  }, []);

  useEffect(() => {
    let filtered = furniture;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.type === selectedCategory);
    }
    filtered.sort((a, b) => {
      const comparison = sortBy === 'name' ? a.name.localeCompare(b.name)
        : sortBy === 'width' ? a.width - b.width : a.depth - b.depth;
      return sortAscending ? comparison : -comparison;
    });
    setFilteredFurniture(filtered);
  }, [furniture, searchQuery, selectedCategory, sortBy, sortAscending]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <LoadingSpinner message="Loading furniture catalog…" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <StyledIcon name="chevronBack" size="md" color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Furniture Catalog</Text>
            <Text style={styles.headerSub}>{filteredFurniture.length} items</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <StyledIcon name="search" size="sm" color={theme.colors.textLight} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search furniture…"
            placeholderTextColor={theme.colors.textLight}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <StyledIcon name="cross" size="sm" color={theme.colors.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersRow}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.8}
              >
                {item !== 'all' && (
                  <StyledIcon
                    name={getCategoryIconName(item)}
                    size="xs"
                    color={isActive ? '#FFFFFF' : theme.colors.primary}
                  />
                )}
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Sort Controls */}
      <View style={styles.sortRow}>
        <StyledIcon name="sort" size="sm" color={theme.colors.textLight} />
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}
            onPress={() => {
              if (sortBy === opt) setSortAscending(!sortAscending);
              else { setSortBy(opt); setSortAscending(true); }
            }}
          >
            <Text style={[styles.sortChipText, sortBy === opt && styles.sortChipTextActive]}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
              {sortBy === opt && (sortAscending ? ' ↑' : ' ↓')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Furniture Grid */}
      <FlatList
        data={filteredFurniture}
        keyExtractor={item => item.id.toString()}
        key="catalog-grid"
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <StyledIcon name="search" size="xl" color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your search or filters</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.furnitureCard}
            onPress={() => {
              if (onSelectFurniture) {
                onSelectFurniture(item);
                navigation.goBack();
              }
            }}
            activeOpacity={0.9}
          >
            <View style={styles.cardIconWrap}>
              <StyledIcon name={getCategoryIconName(item.type)} size="lg" color={theme.colors.primary} />
            </View>
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.cardDimsRow}>
              <StyledIcon name="ruler" size="xs" color={theme.colors.textLight} />
              <Text style={styles.cardDims}>{item.width}×{item.depth}ft</Text>
            </View>
            <View style={styles.cardTypeBadge}>
              <Text style={styles.cardTypeText}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },

  // Header
  header: {
    paddingTop: 48,
    paddingBottom: 18,
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
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
  },

  // Search
  searchContainer: { paddingHorizontal: 16, marginTop: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    ...theme.shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },

  // Filters
  filtersRow: { marginTop: 14 },
  filtersList: { paddingHorizontal: 16, gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  filterChipTextActive: { color: '#FFFFFF' },

  // Sort
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    gap: 8,
  },
  sortChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  sortChipActive: {
    backgroundColor: theme.colors.primaryGhost,
    borderColor: theme.colors.primary + '40',
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  sortChipTextActive: {
    color: theme.colors.primary,
  },

  // Grid
  gridContent: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 24 },
  gridRow: { justifyContent: 'space-between', marginBottom: 10 },
  furnitureCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    ...theme.shadows.small,
  },
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDimsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  cardDims: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  cardTypeBadge: {
    backgroundColor: theme.colors.primaryGhost,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.round,
  },
  cardTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.3,
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 14,
  },
  emptyDesc: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
});

export default FurnitureCatalogScreen;