/**
 * Remipey Premium Color Palette
 * Designed for a modern, clean, and trustworthy financial app.
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#0066CC', // Trustworthy Blue
    secondary: '#00A859', // Success Green (Money)
    surface: '#F5F7FA', // Light Gray for cards
    border: '#E1E4E8',
    error: '#D32F2F',
    warning: '#FFA000',
    info: '#1976D2',
    success: '#388E3C',
  },
  dark: {
    text: '#fff',
    background: '#0D1117', // Dark GitHub-like background
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#2196F3',
    secondary: '#00E676',
    surface: '#161B22',
    border: '#30363D',
    error: '#EF5350',
    warning: '#FFC107',
    info: '#42A5F5',
    success: '#66BB6A',
  },
};
