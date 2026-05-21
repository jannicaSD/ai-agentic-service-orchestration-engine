import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const baseWidth = 375;
const baseHeight = 812;

export const isSmallScreen = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH >= 768;

export function scale(size: number) {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / baseWidth) * size);
}

export function verticalScale(size: number) {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / baseHeight) * size);
}

export function moderateScale(size: number, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

export function getScreenWidth() {
  return SCREEN_WIDTH;
}
