import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFavorites, getMetadata } from "../services/storage";
import { RootStackParamList, ViewerItem } from "../navigation";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../theme/ThemeContext";

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / numColumns - 8;

export default function FavoritesScreen() {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
   const { navigationTheme } = useTheme();

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);
      const favs = await getFavorites();
      const meta = await getMetadata();
      setMetadata(meta)
      setFavorites(favs);
      setLoading(false);
    };

    const unsubscribe = navigation.addListener("focus", loadData);
    loadData(); 

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: "center", color: navigationTheme.colors.text}}>No favorites yet ❤️</Text>
      </View>
    );
  }

const openImage = (
    index: number,
    favorites: string[]
   ) => {

    const items: ViewerItem[] = favorites.map((id) => ({
      id,
      img_url: metadata[id]?.img_url,
    }));

    navigation.navigate("ImageViewer", {
      items,
      startIndex: index,
   });
  };

  return (

    <FlatList
      data={favorites}
      keyExtractor={(id) => id}
      numColumns={numColumns}
      contentContainerStyle={{ padding: 4 }}
      renderItem={({ item, index }) => {
        const imgUrl =  metadata[item]?.thumbnail_url;
      
        return (
          <TouchableOpacity
            onPress={() => openImage(index, favorites)}
          >
            <Image
              source={{ uri: imgUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      }}
    />

  );
}

const styles = StyleSheet.create({
  image: {
    width: itemSize,
    height: itemSize,
    margin: 4,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
