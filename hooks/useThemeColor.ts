import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export function useThemeColor() {
  const scheme = useColorScheme();
  const theme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  return Colors[theme];
}
