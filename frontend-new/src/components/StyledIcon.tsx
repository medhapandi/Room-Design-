// ═══════════════════════════════════════════════════════
// Room Designer — Custom SVG Icon System
// Replaces all emojis with clean, consistent vector icons
// ═══════════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';
import theme from '../theme/colors';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IconProps {
    name: string;
    size?: IconSize;
    color?: string;
}

const SIZES: Record<IconSize, number> = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
};

// ─── SVG Path Data per Icon ──────────────────────────
const ICONS: Record<string, (s: number, c: string) => React.ReactElement> = {

    home: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.55 5.45 21 6 21H9M19 10L21 12M19 10V20C19 20.55 18.55 21 18 21H15M9 21C9.55 21 10 20.55 10 20V16C10 15.45 10.45 15 11 15H13C13.55 15 14 15.45 14 16V20C14 20.55 14.45 21 15 21M9 21H15" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    room: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="18" height="18" rx="2" stroke={c} strokeWidth={2} />
            <Path d="M3 9H21M9 3V9" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Circle cx="15" cy="15" r="2" stroke={c} strokeWidth={1.5} />
        </Svg>
    ),

    design: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={c} strokeWidth={2} strokeLinejoin="round" />
            <Path d="M2 17L12 22L22 17" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2 12L12 17L22 12" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    saved: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    sofa: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M4 11V8C4 6.9 4.9 6 6 6H18C19.1 6 20 6.9 20 8V11" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Path d="M3 11C3.55 11 4 11.45 4 12V15H20V12C20 11.45 20.45 11 21 11C21.55 11 22 11.45 22 12V17C22 17.55 21.55 18 21 18H3C2.45 18 2 17.55 2 17V12C2 11.45 2.45 11 3 11Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="6" y1="18" x2="6" y2="20" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="18" y1="18" x2="18" y2="20" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    bed: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M3 7V20" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Path d="M21 7V20" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Path d="M3 14H21" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Path d="M3 10H10V14" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14 10C14 10 21 10 21 14" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Circle cx="7" cy="10" r="2" stroke={c} strokeWidth={1.5} />
        </Svg>
    ),

    chair: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M7 13V5C7 3.9 7.9 3 9 3H15C16.1 3 17 3.9 17 5V13" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Rect x="5" y="13" width="14" height="3" rx="1" stroke={c} strokeWidth={2} />
            <Line x1="7" y1="16" x2="7" y2="21" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="17" y1="16" x2="17" y2="21" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    table: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="8" width="18" height="3" rx="1.5" stroke={c} strokeWidth={2} />
            <Line x1="6" y1="11" x2="6" y2="20" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="18" y1="11" x2="18" y2="20" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    storage: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="3" width="16" height="18" rx="2" stroke={c} strokeWidth={2} />
            <Line x1="4" y1="9" x2="20" y2="9" stroke={c} strokeWidth={2} />
            <Line x1="4" y1="15" x2="20" y2="15" stroke={c} strokeWidth={2} />
            <Line x1="11" y1="5.5" x2="13" y2="5.5" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="11" y1="11.5" x2="13" y2="11.5" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="11" y1="17.5" x2="13" y2="17.5" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    furniture: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="6" width="18" height="12" rx="2" stroke={c} strokeWidth={2} />
            <Path d="M7 10V14M17 10V14" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="3" y1="18" x2="5" y2="20" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="21" y1="18" x2="19" y2="20" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    add: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth={2} />
            <Line x1="12" y1="8" x2="12" y2="16" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="8" y1="12" x2="16" y2="12" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    remove: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M3 6H5H21" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    rotate: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M1 4V10H7" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.51 15C4.01717 16.6118 5.04159 18.0183 6.43258 19.0128C7.82357 20.0074 9.50588 20.5375 11.2271 20.5205C12.9483 20.5036 14.6197 19.9405 15.99 18.9189C17.3602 17.8973 18.3546 16.4711 18.828 14.849C19.3014 13.227 19.2296 11.497 18.6232 9.91893C18.0169 8.34088 16.907 7.0001 15.4568 6.09267C14.0065 5.18523 12.2952 4.76058 10.5804 4.88124C8.86553 5.0019 7.23399 5.66145 5.93 6.76001L1 10" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    check: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85782 7.69279 2.71536 9.79619 2.2401C11.8996 1.76484 14.1003 1.98232 16.07 2.85999" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M22 4L12 14.01L9 11.01" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    cross: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={2} />
            <Line x1="15" y1="9" x2="9" y2="15" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="9" y1="9" x2="15" y2="15" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    warning: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55297 18.6453 1.55199 18.9945C1.55101 19.3437 1.64149 19.6871 1.81443 19.9905C1.98737 20.2939 2.23672 20.5468 2.53771 20.7239C2.83869 20.901 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5468 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="12" y1="9" x2="12" y2="13" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Circle cx="12" cy="17" r="0.5" fill={c} stroke={c} strokeWidth={1} />
        </Svg>
    ),

    info: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={2} />
            <Line x1="12" y1="16" x2="12" y2="12" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Circle cx="12" cy="8" r="0.5" fill={c} stroke={c} strokeWidth={1} />
        </Svg>
    ),

    arrowUp: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M12 19V5M5 12L12 5L19 12" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    arrowDown: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M12 5V19M19 12L12 19L5 12" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    arrowLeft: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5M12 19L5 12L12 5" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    arrowRight: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12H19M12 5L19 12L12 19" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    search: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="8" stroke={c} strokeWidth={2} />
            <Path d="M21 21L16.65 16.65" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    filter: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    sort: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Line x1="4" y1="6" x2="20" y2="6" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="4" y1="12" x2="16" y2="12" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="4" y1="18" x2="12" y2="18" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    grid: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth={2} />
            <Rect x="14" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth={2} />
            <Rect x="3" y="14" width="7" height="7" rx="1" stroke={c} strokeWidth={2} />
            <Rect x="14" y="14" width="7" height="7" rx="1" stroke={c} strokeWidth={2} />
        </Svg>
    ),

    door: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M5 21V3C5 2.45 5.45 2 6 2H18C18.55 2 19 2.45 19 3V21" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="3" y1="21" x2="21" y2="21" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Circle cx="15.5" cy="12" r="1" fill={c} />
        </Svg>
    ),

    fitness: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M9 12L11 14L15 10" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20.618 5.984C21.0665 6.0904 21.4704 6.33181 21.7742 6.67489C22.078 7.01796 22.2665 7.44595 22.3152 7.90167C22.3639 8.35738 22.2705 8.81787 22.048 9.22092C21.8255 9.62397 21.4842 9.95033 21.071 10.154L12 15L2.929 10.154C2.5158 9.95033 2.17452 9.62397 1.95201 9.22092C1.7295 8.81787 1.63614 8.35738 1.68481 7.90167C1.73349 7.44595 1.92201 7.01796 2.22581 6.67489C2.52961 6.33181 2.93352 6.0904 3.382 5.984L12 4L20.618 5.984Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 15V20" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Path d="M8 20H16" stroke={c} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    ),

    save: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M17 21V13H7V21" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7 3V8H15" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    sparkle: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={c} fillOpacity={0.15} />
        </Svg>
    ),

    layout: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="18" height="18" rx="2" stroke={c} strokeWidth={2} />
            <Line x1="3" y1="9" x2="21" y2="9" stroke={c} strokeWidth={2} />
            <Line x1="9" y1="9" x2="9" y2="21" stroke={c} strokeWidth={2} />
        </Svg>
    ),

    chevronBack: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18L9 12L15 6" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    refresh: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M23 4V10H17" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M1 20V14H7" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.51 9C4.01 7.56 4.89 6.28 6.05 5.28C7.22 4.28 8.62 3.61 10.12 3.32C11.62 3.04 13.17 3.15 14.61 3.65C16.06 4.15 17.35 5.02 18.35 6.18L23 10M1 14L5.64 17.82C6.64 18.98 7.94 19.85 9.38 20.35C10.83 20.85 12.37 20.96 13.88 20.68C15.38 20.39 16.78 19.72 17.95 18.72C19.11 17.72 19.99 16.44 20.49 15" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    edit: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),

    zap: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={c} fillOpacity={0.1} />
        </Svg>
    ),

    eye: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="12" r="3" stroke={c} strokeWidth={2} />
        </Svg>
    ),

    ruler: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="2" y="7" width="20" height="10" rx="1" stroke={c} strokeWidth={2} />
            <Line x1="6" y1="7" x2="6" y2="11" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="10" y1="7" x2="10" y2="13" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="14" y1="7" x2="14" y2="11" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="18" y1="7" x2="18" y2="13" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
    ),

    move: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Path d="M5 9L2 12L5 15" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M9 5L12 2L15 5" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M15 19L12 22L9 19" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M19 9L22 12L19 15" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="2" y1="12" x2="22" y2="12" stroke={c} strokeWidth={2} />
            <Line x1="12" y1="2" x2="12" y2="22" stroke={c} strokeWidth={2} />
        </Svg>
    ),

    calendar: (s, c) => (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth={2} />
            <Line x1="16" y1="2" x2="16" y2="6" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="8" y1="2" x2="8" y2="6" stroke={c} strokeWidth={2} strokeLinecap="round" />
            <Line x1="3" y1="10" x2="21" y2="10" stroke={c} strokeWidth={2} />
        </Svg>
    ),
};

// ─── Icon Component ──────────────────────────────────
const StyledIcon: React.FC<IconProps> = ({
    name,
    size = 'md',
    color = theme.colors.primary,
}) => {
    const s = SIZES[size];
    const renderIcon = ICONS[name];

    if (!renderIcon) {
        // Fallback — shows a simple circle for unknown icons
        return (
            <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
            </Svg>
        );
    }

    return renderIcon(s, color);
};

// ─── Helper: Get furniture category icon name ────────
export const getCategoryIconName = (type: string): string => {
    switch (type) {
        case 'sofa': return 'sofa';
        case 'table': return 'table';
        case 'bed': return 'bed';
        case 'chair': return 'chair';
        case 'storage': return 'storage';
        default: return 'furniture';
    }
};

export default StyledIcon;
