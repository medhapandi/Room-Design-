import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import theme from '../theme/colors';
import { RootStackParamList } from '../types';
import StyledIcon from '../components/StyledIcon';

type HomeNavigationProp = StackNavigationProp<RootStackParamList>;
const { width: SCREEN_W } = Dimensions.get('window');

// ─── Feature Cards Data ────────────────────────────────
const features = [
  {
    id: 1,
    icon: 'room',
    title: 'Create Your Room',
    description: 'Design rooms with custom dimensions and templates.',
    action: 'Get Started',
    navigate: 'RoomCreation' as const,
    params: undefined,
    gradient: theme.colors.gradientPrimary,
  },
  {
    id: 2,
    icon: 'design',
    title: 'Design Studio',
    description: 'Arrange furniture with drag-and-drop and fitness checking.',
    action: 'Open Studio',
    navigate: 'RoomCreation' as const,
    params: undefined,
    gradient: theme.colors.gradientAccent,
  },
  {
    id: 3,
    icon: 'furniture',
    title: 'Furniture Catalog',
    description: 'Browse 24+ items — sofas, beds, tables, and more.',
    action: 'Browse',
    navigate: 'RoomCreation' as const,
    params: undefined,
    gradient: theme.colors.gradientCool,
  },
  {
    id: 4,
    icon: 'saved',
    title: 'Saved Designs',
    description: 'View, load, and manage all your saved room designs.',
    action: 'View Designs',
    navigate: 'SavedDesigns' as const,
    params: undefined,
    gradient: theme.colors.gradientWarm,
  },
];

const stats = [
  { icon: 'furniture', label: '24+ Furniture', sub: 'Items' },
  { icon: 'layout', label: '2D Layout', sub: 'Engine' },
  { icon: 'fitness', label: 'AI Fitness', sub: 'Checker' },
  { icon: 'save', label: 'Cloud Save', sub: 'Designs' },
];

// ─── Home Screen ───────────────────────────────────────
const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Hero Header ──────────────────────────── */}
        <LinearGradient
          colors={theme.colors.gradientDark}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Animated.View style={[styles.heroContent, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }]}>
            <View style={styles.heroBadge}>
              <StyledIcon name="sparkle" size="xs" color={theme.colors.primaryLight} />
              <Text style={styles.heroBadgeText}>Room Designer</Text>
            </View>
            <Text style={styles.heroTitle}>Design Your{'\n'}Perfect Space</Text>
            <Text style={styles.heroSubtitle}>
              Create rooms, arrange furniture, and check layouts with intelligent fitness analysis.
            </Text>
            <TouchableOpacity
              style={styles.heroCTA}
              onPress={() => navigation.navigate('RoomCreation')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={theme.colors.gradientAccent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroCTAGradient}
              >
                <Text style={styles.heroCTAText}>Start Designing</Text>
                <StyledIcon name="arrowRight" size="sm" color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Decorative circles */}
          <View style={[styles.decorCircle, styles.decorCircle1]} />
          <View style={[styles.decorCircle, styles.decorCircle2]} />
        </LinearGradient>

        {/* ─── Stats Strip ──────────────────────────── */}
        <View style={styles.statsStrip}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <StyledIcon name={stat.icon} size="sm" color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        {/* ─── Feature Cards ────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Everything you need to get started</Text>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={feature.id}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate(feature.navigate as any, feature.params as any)
              }
              style={styles.featureCard}
            >
              <View style={styles.featureRow}>
                <LinearGradient
                  colors={feature.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIconBadge}
                >
                  <StyledIcon name={feature.icon} size="md" color="#FFFFFF" />
                </LinearGradient>

                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.description}</Text>
                </View>

                <View style={styles.featureArrow}>
                  <StyledIcon name="arrowRight" size="sm" color={theme.colors.textLight} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ─── Tip ──────────────────────────────────── */}
        <View style={styles.tipCard}>
          <LinearGradient
            colors={[theme.colors.primaryLighter, theme.colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tipGradient}
          >
            <View style={styles.tipIconWrap}>
              <StyledIcon name="zap" size="md" color={theme.colors.primary} />
            </View>
            <View style={styles.tipText}>
              <Text style={styles.tipTitle}>Pro Tip</Text>
              <Text style={styles.tipDesc}>
                Use the fitness checker after placing furniture to ensure optimal spacing and no collisions.
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Hero
  hero: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  heroContent: {
    zIndex: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
    marginBottom: 16,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primaryLight,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '400',
  },
  heroCTA: {
    alignSelf: 'flex-start',
  },
  heroCTAGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.round,
  },
  heroCTAText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorCircle1: {
    width: 180,
    height: 180,
    top: -30,
    right: -40,
  },
  decorCircle2: {
    width: 120,
    height: 120,
    bottom: -20,
    right: 60,
  },

  // Stats
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    ...theme.shadows.medium,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  statSub: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontWeight: '500',
  },

  // Section
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontWeight: '500',
    marginTop: 2,
  },

  // Feature Cards
  featureCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    ...theme.shadows.small,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextCol: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  featureArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tip Card
  tipCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  tipGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  tipIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  tipText: {
    flex: 1,
    marginLeft: 14,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
});

export default HomeScreen;