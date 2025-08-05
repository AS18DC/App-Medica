import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Platform detection
export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

// Screen dimensions
export const screenWidth = width;
export const screenHeight = height;

// Breakpoints for responsive design
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1200,
};

// Responsive helpers
export const isMobileScreen = () => screenWidth < breakpoints.tablet;
export const isTabletScreen = () => screenWidth >= breakpoints.tablet && screenWidth < breakpoints.desktop;
export const isDesktopScreen = () => screenWidth >= breakpoints.desktop;

// Responsive spacing
export const getResponsiveSpacing = (mobile, tablet, desktop) => {
  if (isMobileScreen()) return mobile;
  if (isTabletScreen()) return tablet;
  return desktop;
};

// Responsive font sizes
export const getResponsiveFontSize = (mobile, tablet, desktop) => {
  if (isMobileScreen()) return mobile;
  if (isTabletScreen()) return tablet;
  return desktop;
};

// Responsive padding/margins
export const getResponsivePadding = (mobile, tablet, desktop) => {
  if (isMobileScreen()) return mobile;
  if (isTabletScreen()) return tablet;
  return desktop;
};

// Web-specific styles
export const webStyles = {
  container: {
    maxWidth: isDesktopScreen() ? 1200 : isTabletScreen() ? 768 : '100%',
    marginHorizontal: isDesktopScreen() ? 'auto' : 0,
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  card: {
    borderRadius: isWeb ? 8 : 12,
    boxShadow: isWeb ? '0 2px 8px rgba(0, 0, 0, 0.1)' : undefined,
    transition: isWeb ? 'all 0.3s ease' : undefined,
  },
  button: {
    borderRadius: isWeb ? 6 : 8,
    cursor: isWeb ? 'pointer' : undefined,
    transition: isWeb ? 'all 0.2s ease' : undefined,
  },
  input: {
    borderRadius: isWeb ? 8 : 12,
    borderWidth: isWeb ? 1 : 0,
    borderColor: isWeb ? '#e0e0e0' : undefined,
    paddingHorizontal: isWeb ? 16 : undefined,
    paddingVertical: isWeb ? 12 : undefined,
  },
};

// Responsive grid columns
export const getGridColumns = () => {
  if (isMobileScreen()) return 1;
  if (isTabletScreen()) return 2;
  if (isDesktopScreen()) return 3;
  return 4;
};

// CSS class names for web
export const webClasses = {
  container: 'web-container',
  card: 'web-card card-hover',
  button: 'web-button button-hover',
  buttonPrimary: 'web-button web-button-primary',
  buttonSecondary: 'web-button web-button-secondary',
  input: 'web-input',
  grid: 'web-grid-responsive',
  textCenter: 'web-text-center',
  textLarge: 'web-text-large',
  paddingLarge: 'web-padding-large',
  fadeIn: 'fade-in',
  hidden: 'web-hidden',
  visible: 'web-visible',
  hiddenMd: 'web-hidden-md',
  visibleMd: 'web-visible-md',
  hiddenLg: 'web-hidden-lg',
  visibleLg: 'web-visible-lg',
};

// Responsive layout helpers
export const getResponsiveLayout = () => {
  if (isMobileScreen()) return 'mobile';
  if (isTabletScreen()) return 'tablet';
  if (isDesktopScreen()) return 'desktop';
  return 'large';
};

// Responsive image sizes
export const getResponsiveImageSize = (mobile, tablet, desktop) => {
  if (isMobileScreen()) return mobile;
  if (isTabletScreen()) return tablet;
  return desktop;
};

// Responsive icon sizes
export const getResponsiveIconSize = (mobile, tablet, desktop) => {
  if (isMobileScreen()) return mobile;
  if (isTabletScreen()) return tablet;
  return desktop;
}; 