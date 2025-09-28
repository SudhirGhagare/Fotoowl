import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ErrorEmpty from "../components/ErrorEmpty";
import SkeletonGrid from "../components/SkeletonGrid";
import { useInfiniteImages } from "../hooks/useInfiniteImages";
import { RootStackParamList } from "../navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../theme/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import storage from "../services/storage";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

type ImageGridScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Grid"
>;

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const ITEM_SPACING = 8;
const ITEM_SIZE = Math.floor(
  (width - ITEM_SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT
);

export default function ImageGridScreen({ route }: any) {
  const isOnline = useNetworkStatus();

  const apiKeyFromEnv = process.env.EXPO_API_KEY;
  const { eventId = 154770, apiKey = apiKeyFromEnv } = route.params ?? {};
  const { items, loading, refreshing, error, hasNext, loadNext, refresh } =
    useInfiniteImages({
      eventId,
      pageSize: 20,
      key: apiKey,
      order_by: 2,
      order_asc: true,
    });

  const navigation = useNavigation<ImageGridScreenNavigationProp>();
  const listRef = useRef<FlatList>(null);
  const { navigationTheme } = useTheme();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {

    const loadFavorites = async () => {
      const favs = await storage.getFavorites();
      setFavorites(new Set(favs));
    };

    loadFavorites();

  }, []);

  const loadFavorites = async () => {
    const favs = await storage.getFavorites();
    setFavorites(new Set(favs));
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const toggleFavorite = async (id: string) => {

    let newFavs = new Set(favorites);

    if (favorites.has(id)) {

      newFavs.delete(id);
      await storage.removeFavorite(id);

    } else {

      newFavs.add(id);
      await storage.saveFavorite(id);

    }

    setFavorites(newFavs);

  };

  const openViewer = (index: number) => {
    navigation.navigate("ImageViewer", { items, startIndex: index });
  };

  if (loading && items.length === 0) {
    return <SkeletonGrid columns={COLUMN_COUNT} itemSize={ITEM_SIZE} />;
  }

  if (error && items.length === 0) {
    console.log("Error loading images:", error);
    return (
      <ErrorEmpty
        message={error.message || "Failed to load"}
        onRetry={refresh}
      />
    );
  }

  if (!loading && items.length === 0) {
    console.log(`No of images : {${items.length} , ${loading}}`);
    return <ErrorEmpty message="No images found" onRetry={refresh} />;
  }

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    const isFavorite = favorites.has(item.id);

    return (
      <View
        style={{
          marginBottom: ITEM_SPACING,
        }}
      >
        <TouchableOpacity onPress={() => openViewer(index)} activeOpacity={0.8}>
          <Image
            source={{ uri: item.thumbnail_url }}
            style={{
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              borderRadius: 8,
              marginBottom: ITEM_SPACING,
              marginRight:
                index % COLUMN_COUNT < COLUMN_COUNT - 1 ? ITEM_SPACING : 0,
              backgroundColor: "#eee",
              borderWidth: 2,
              borderColor: isFavorite ? "red" : "#ccc",
            }}
            contentFit="cover"
            cachePolicy={"disk"}
            transition={200}
            testID="image-item"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={{
            position: "absolute",
            top: 8,
            right: 15,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 20,
            padding: 4,
          }}

          testID={`favorite-icon-${item.id}`}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={20}
            color={isFavorite ? "red" : "white"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {!isOnline && (

        <View
          style={{
            padding: 8,
            backgroundColor: "#ffcccc",
            borderRadius: 8,
            margin: 8,
          }}>
            
          <Text
            style={{
              textAlign: "center",
              color: "white",
              backgroundColor:"red",
              padding:4
            }}
          >
           You are offline. Showing cached photos.
          </Text>

        </View>
      )}

      <View
        style={{
          flex: 1,
          padding: ITEM_SPACING,
          backgroundColor: navigationTheme.colors.background
        }}
      >
        <FlatList
          testID="flatlist"
          ref={listRef}
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          numColumns={COLUMN_COUNT}
          onEndReached={() => {
            if (hasNext && !loading) loadNext();
          }}
          onEndReachedThreshold={0.6}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListFooterComponent={() =>
            loading ? (
              <Text style={{ padding: 12, textAlign: "center", color: navigationTheme.colors.text }}>
                Loading...
              </Text>
            ) : null
          }
          removeClippedSubviews
          windowSize={11}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
        />
      </View>
    </>
  );
}
