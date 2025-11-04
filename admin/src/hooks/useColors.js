import { useTheme } from "../store/useTheme";
import { themes } from "../utils/theme";

export const useColors = () => {
  const { theme } = useTheme();
  return themes[theme];
};
