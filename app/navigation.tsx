import React from "react";
import { NavigationContainer} from "@react-navigation/native";
import { ImageItem } from "./services/api";
import BottomTabs from "./components/BottomTabs";
import { useTheme } from "./theme/ThemeContext";
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

console.log(prefix);

export type RootStackParamList = {
  Grid: { eventId?: number; apiKey?: string } | undefined;
  ImageViewer: { items: ViewerItem[] | ImageItem[]; startIndex: number };
};

export type ViewerItem = {
  id: string;
  img_url: string;
};

const linking = {
  prefixes: [prefix], 
  config: {
    screens: {
      Grid: "event/154770", 
      ImageViewer: "event/154770/image/:id", 
    },
  }
};

export default function AppNavigation() {
  const { navigationTheme } = useTheme();
  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <BottomTabs/>
    </NavigationContainer>
  );
}
