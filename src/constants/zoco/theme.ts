// Example pastel colors based on the Zoco Salamandra logo
export const COLORS = {
  // Pulled from the "Zoco" text colors
  primary: '#FF99CC',  // Pastel pink
  secondary: '#99FF99', // Pastel green
  accent: '#CC99FF',   // Pastel purple
  
  // Light blue background from the circle
  background: '#B3E5FC', // or #ACE8FF, whichever you prefer
  
  white: '#FFFFFF',
  black: '#000000',

  // Use a darker color for text so it’s readable on a light background
  text: '#333333',

  // Keep error & success standard or change to brand-related if desired
  error: '#FF3B30',
  success: '#34C759',
};

export const FONTS = {
  bold: 'System',
  regular: 'System',
  medium: 'System',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  padding: 24,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
};
