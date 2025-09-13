import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/SettingsScreen';
import GridStack from './GridStack';
import { Entypo, Ionicons,MaterialIcons } from '@expo/vector-icons';
import FavoritesScreen from '../screens/FavouritesScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { navigationTheme } = useTheme();
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }
    }>
      <Tab.Screen name="Home" component={GridStack} 
      options={{
        headerShown:false,
        tabBarStyle: {
            backgroundColor: navigationTheme.colors.card
        },
        tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
    }}/>

    <Tab.Screen name="Favourites" component={FavoritesScreen}
    options={
        {
        tabBarIcon : ({ color, size }) => (
           <MaterialIcons name="favorite" size={24} color={color} />
          )
    }}
    />
      <Tab.Screen name="Settings" component={SettingsScreen} 
      options={
        { title: 'Settings',
             tabBarIcon: 
            ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              )
        }} />
    </Tab.Navigator>
    
  );
}
