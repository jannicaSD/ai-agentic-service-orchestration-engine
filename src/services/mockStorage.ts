import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key: string) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export async function setItem(key: string, value: any) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  await AsyncStorage.removeItem(key);
}
