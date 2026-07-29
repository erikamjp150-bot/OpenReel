import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const fallbackSet = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const fallbackGet = async (key) => {
  return await AsyncStorage.getItem(key);
};

const fallbackRemove = async (key) => {
  await AsyncStorage.removeItem(key);
};

export const secureStore = {
  set: async (key, value) => {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
    } catch (error) {
      await fallbackSet(key, value);
    }
  },
  get: async (key) => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials) {
        return credentials.password;
      }
      return await fallbackGet(key);
    } catch (error) {
      return await fallbackGet(key);
    }
  },
  remove: async (key) => {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      await fallbackRemove(key);
    }
  },
};
