import React from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function SettingsScreen() {
//  const [darkMode, setDarkMode] = React.useState(false);
  const { darkMode, toggleDarkMode, colors, navigationTheme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Section Title */}
      <Text style={[styles.sectionTitle, {color: colors.text}]}>Preferences</Text>

      {/* Dark Mode Toggle */}
      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, {color: colors.text}]}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFCF7",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  label: {
    fontSize: 15,
    color: "#333",
  },
});
