// src/screens/ImageViewerScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StatusBar, TouchableOpacity,Alert } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  saveFavorite,
  removeFavorite,
  getFavorites,
} from "../services/storage";
import { MaterialIcons } from "@expo/vector-icons";

import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export default function ImageViewerScreen() {

  const navigation = useNavigation();
  const route = useRoute();
  const { items = [], startIndex = 0, id } = (route.params as any) || {};
  
 // const images = items.map((it: any) => ({ uri: it.img_url }));
  const [imageIndex, setImageIndex] = useState(startIndex);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [images, setImages] = useState<{ uri: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [startIndexDeepLink, setStartIndexDeepLink] = useState(imageIndex);

  const expoUri = process.env.EXPO_API_URI;
  const apiKey = process.env.EXPO_API_KEY;

  //https://openapi.fotoowl.ai/open/event/image-list?event_id=154770&page=0&page_size=4&key=4030&order_by=2&order_asc=true

  var currentId = items[imageIndex]?.id;

  if(items.length == 0 && currentId == null){
    currentId = id;
  }   

  const currentUri = items[imageIndex]?.img_url;

  useEffect(() => {

    StatusBar.setBarStyle("light-content");
    StatusBar.setHidden(true, "fade");

    return () => {

      StatusBar.setHidden(false, "fade");
      StatusBar.setBarStyle("dark-content");

    };
  }, []);


    useEffect(() => {
    if (items.length > 0) {

      setImages(items.map((it: any) => ({ uri: it.img_url })));

    } else if (id) {

      setLoading(true);

      fetch(`${expoUri}?event_id=154770&page=0&page_size=20&key=${apiKey}&order_by=2&order_asc=true`) 
        .then((res) => res.json())
        .then((data) => {
          
         const imageList = data?.data?.image_list ?? [];
         const formatted = imageList.map((img: any) => ({
          uri: img.img_url,
          id: img.id,
        }));

        setImages(formatted);

        const index = formatted.findIndex((img: any) => img.id === id);
        setStartIndexDeepLink(index >= 0 ? index : 0);

        })
        .catch((err) => console.error("Failed to fetch image:", err))
        .finally(() => setLoading(false));
    }
  }, [id, items]);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const toggleFavorite = async () => {
    if (!currentId) return;

    if (favorites.includes(currentId)) {
      await removeFavorite(currentId);
      setFavorites((prev) => prev.filter((x) => x !== currentId));
    } else {
      await saveFavorite(currentId);
      setFavorites((prev) => [...prev, currentId]);
    }
  };

   const shareImage = async () => {

    if (!currentUri) return;

    try {
      
      const fileUri = FileSystem.cacheDirectory + "share.jpg";
      await FileSystem.downloadAsync(currentUri, fileUri);
      await Sharing.shareAsync(fileUri);

    } catch (e) {
      console.log("Share failed:", e);
      Alert.alert("Error", "Unable to share image");
    }

  };

  const saveImage = async () => {

    if (!currentUri) return;

    try {

      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission required", "Storage permission is needed to save images.");
        return;
      }

      const fileUri = FileSystem.cacheDirectory + "save.jpg";
      const { uri } = await FileSystem.downloadAsync(currentUri, fileUri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("MyApp", asset, false);

      Alert.alert("Saved", "Image saved to gallery.");

    } catch (e) {

      console.log("Save failed:", e);
      Alert.alert("Error", "Unable to save image");
      
    }
  };

  const isFav = currentId && favorites.includes(currentId);

    if (loading) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>

      <ImageViewing
        images={images}
        visible={true}
        imageIndex={startIndexDeepLink}
        onImageIndexChange={setImageIndex}
        onRequestClose={() => {
          navigation.goBack()
        }}
        presentationStyle="overFullScreen"
        HeaderComponent={() => (
          <View
            style={{
              position: "absolute",
              top: 40,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-between", // left + right
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={toggleFavorite}
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 25,
                padding: 12,
              }}
            >
              <MaterialIcons
                name="favorite"
                size={24}
                color={isFav ? "red" : "white"}
              />

            </TouchableOpacity>

             <TouchableOpacity
              onPress={shareImage}
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 25,
                padding: 12,
                marginRight: 12,
              }}
            >
              <MaterialIcons name="share" size={24} color="white" />
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity
              onPress={saveImage}
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 25,
                padding: 12,
                marginRight: 12,
              }}
            >
              <MaterialIcons name="download" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} 
            style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 25,
                padding: 12,
                marginRight: 0,
              }}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
