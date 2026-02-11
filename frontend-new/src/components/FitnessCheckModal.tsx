import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import theme from '../theme/colors';
import StyledIcon from './StyledIcon';

interface FitnessResult {
  furniture_id: number;
  furniture_name: string;
  fits: boolean;
  collisions: string[];
  adequate_space: boolean;
  walking_space_x: number;
  walking_space_y: number;
  message: string;
}

interface FitnessCheckModalProps {
  visible: boolean;
  allFits: boolean;
  results: FitnessResult[];
  overallMessage: string;
  onClose: () => void;
}

const FitnessCheckModal: React.FC<FitnessCheckModalProps> = ({
  visible,
  allFits,
  results,
  overallMessage,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 9,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 9,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
    }
  }, [visible]);

  const gradient = allFits ? theme.colors.gradientSuccess : theme.colors.gradientDanger;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Gradient header */}
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <StyledIcon
              name={allFits ? 'check' : 'warning'}
              size="lg"
              color="#FFFFFF"
            />
            <Text style={styles.headerTitle}>Fitness Check</Text>
          </LinearGradient>

          {/* Overall result badge */}
          <View style={[styles.overallBadge, {
            backgroundColor: allFits ? theme.colors.successLight : theme.colors.errorLight,
          }]}>
            <Text style={[styles.overallText, {
              color: allFits ? theme.colors.success : theme.colors.error,
            }]}>
              {overallMessage}
            </Text>
          </View>

          {/* Individual results */}
          <ScrollView
            style={styles.resultsScroll}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}
          >
            {results.map((result, index) => {
              const passes = result.fits && !result.collisions.length;
              return (
                <View
                  key={index}
                  style={[
                    styles.resultCard,
                    {
                      borderLeftColor: passes ? theme.colors.success : theme.colors.error,
                    },
                  ]}
                >
                  <View style={styles.resultHeader}>
                    <View style={[styles.resultStatusDot, {
                      backgroundColor: passes ? theme.colors.success : theme.colors.error,
                    }]} />
                    <Text style={styles.resultName}>{result.furniture_name}</Text>
                  </View>

                  <Text style={[styles.resultMessage, {
                    color: passes ? theme.colors.success : theme.colors.error,
                  }]}>
                    {result.message}
                  </Text>

                  {result.collisions.length > 0 && (
                    <View style={styles.collisionBox}>
                      <StyledIcon name="warning" size="xs" color={theme.colors.error} />
                      <View style={styles.collisionList}>
                        {result.collisions.map((collision, idx) => (
                          <Text key={idx} style={styles.collisionItem}>
                            Overlaps with {collision}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Walking space bar */}
                  <View style={styles.spaceRow}>
                    <StyledIcon name="move" size="xs" color={theme.colors.textLight} />
                    <Text style={styles.spaceText}>
                      {result.walking_space_x.toFixed(1)}ft × {result.walking_space_y.toFixed(1)}ft
                    </Text>
                    <View style={[styles.spaceTag, {
                      backgroundColor: result.adequate_space
                        ? theme.colors.successLight
                        : theme.colors.warningLight,
                    }]}>
                      <Text style={[styles.spaceTagText, {
                        color: result.adequate_space
                          ? theme.colors.success
                          : theme.colors.warning,
                      }]}>
                        {result.adequate_space ? 'OK' : 'Tight'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Close button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    padding: theme.spacing.md,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
    overflow: 'hidden',
    ...theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  overallBadge: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  overallText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultsScroll: {
    maxHeight: 340,
  },
  resultsContent: {
    padding: theme.spacing.md,
    gap: 10,
  },
  resultCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    borderLeftWidth: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  resultStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  resultMessage: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  collisionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: theme.colors.errorLight,
    padding: 8,
    borderRadius: theme.borderRadius.xs,
    marginBottom: 8,
  },
  collisionList: {
    flex: 1,
  },
  collisionItem: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: '500',
  },
  spaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  spaceText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  spaceTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.round,
  },
  spaceTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  buttonWrapper: {
    padding: theme.spacing.md,
  },
  button: {
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default FitnessCheckModal;
