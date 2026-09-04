import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export function useThemeColor(
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromScheme = Colors[theme];

  if (colorName) {
    return colorFromScheme[colorName];
  }

  return colorFromScheme;
}
