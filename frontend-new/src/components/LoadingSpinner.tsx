import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme/colors';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...',
    size = 'large',
}) => {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;
    const scale1 = useRef(new Animated.Value(0.6)).current;
    const scale2 = useRef(new Animated.Value(0.6)).current;
    const scale3 = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const createDotAnimation = (opacityAnim: Animated.Value, scaleAnim: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.parallel([
                        Animated.timing(opacityAnim, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.spring(scaleAnim, {
                            toValue: 1,
                            useNativeDriver: true,
                            tension: 80,
                            friction: 5,
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(opacityAnim, {
                            toValue: 0.3,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.spring(scaleAnim, {
                            toValue: 0.6,
                            useNativeDriver: true,
                            tension: 80,
                            friction: 5,
                        }),
                    ]),
                    Animated.delay(600 - delay),
                ])
            );
        };

        const anim1 = createDotAnimation(dot1, scale1, 0);
        const anim2 = createDotAnimation(dot2, scale2, 200);
        const anim3 = createDotAnimation(dot3, scale3, 400);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, []);

    const dotSize = size === 'large' ? 14 : 10;
    const gap = size === 'large' ? 12 : 8;

    const renderDot = (opacity: Animated.Value, scale: Animated.Value, colors: readonly [string, string], key: number) => (
        <Animated.View
            key={key}
            style={{
                opacity,
                transform: [{ scale }],
            }}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                }}
            />
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.dotsRow, { gap }]}>
                {renderDot(dot1, scale1, theme.colors.gradientPrimary, 0)}
                {renderDot(dot2, scale2, theme.colors.gradientAccent, 1)}
                {renderDot(dot3, scale3, theme.colors.gradientCool, 2)}
            </View>
            <Text style={[styles.message, size === 'small' && styles.smallMessage]}>
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        minHeight: 120,
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    message: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    smallMessage: {
        fontSize: 12,
    },
});

export default LoadingSpinner;
