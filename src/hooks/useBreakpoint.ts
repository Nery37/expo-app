import { useWindowDimensions } from 'react-native';

const TABLET_MIN_WIDTH = 768;

/** Ponto único de decisão de layout responsivo (mobile x tablet/landscape). */
export function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;

  return {
    width,
    height,
    isTablet,
    /** Nº de colunas sugerido para listas em grade. */
    columns: isTablet ? 2 : 1,
  };
}
