import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image,Text } from 'react-native';
import ImageGridScreen from '../screens/ImageGridScreen';
import ImageViewerScreen from '../screens/ImageViewerScreen';
import { RootStackParamList } from '../navigation';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function GridStack() {
  const { navigationTheme,darkMode } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
          name="Grid"
          component={ImageGridScreen}
          options={{
        // title: "Fotoowl",
        // headerShown: true,
            headerTitle: () =>
    darkMode ? (
       <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Fotoowl</Text>
    ) : (
      <Image
        source={require("../../assets/images/logo-light.png")}
        style={{ width: 110, height: 20, resizeMode: "contain" }}
      />
    ),
          headerTitleAlign: "left", 
          headerStyle: {backgroundColor: navigationTheme.colors.background},
          
          }}
        />
        <Stack.Screen name="ImageViewer" component={ImageViewerScreen}/>
    </Stack.Navigator>
  );
}

export default GridStack;