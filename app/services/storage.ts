import AsyncStorage from '@react-native-async-storage/async-storage';
const FAVORITES_KEY = 'favorites_v1';
const METADATA_KEY = 'image_meta_v1';

export async function saveFavorite(id: string) {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  const list = raw ? JSON.parse(raw) as string[] : [];
  if (!list.includes(id)) {
    list.push(id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  }
}

export async function removeFavorite(id: string) {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  const list = raw ? JSON.parse(raw) as string[] : [];
  const out = list.filter((x: string) => x !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(out));
}

export async function getFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMetadata(imageList: any[]) {

  const metaDict: Record<string, any> = await getMetadata();

  imageList.forEach((img) => {
    metaDict[img.id] = img;
  });
  await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metaDict));
}

export async function getMetadata() {

  const raw = await AsyncStorage.getItem(METADATA_KEY);
  return raw ? JSON.parse(raw) : {};
}

export default {
  saveFavorite,
  removeFavorite,
  getFavorites,
  saveMetadata,
  getMetadata,
};
