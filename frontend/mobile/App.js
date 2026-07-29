import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import CameraScreen from './src/screens/CameraScreen';
import { secureStore } from './src/services/secureStore';
import { setAuthFailureHandler } from './src/services/api';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

const App = () => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = React.useCallback(async () => {
    await secureStore.remove('auth_token');
    await secureStore.remove('refresh_token');
    setUserToken(null);
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, []);

  const handleLogin = async (accessToken, refreshToken) => {
    await secureStore.set('auth_token', accessToken);
    await secureStore.set('refresh_token', refreshToken);
    setUserToken(accessToken);
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await secureStore.get('auth_token');
      setUserToken(token);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  useEffect(() => {
    setAuthFailureHandler(handleLogout);
  }, [handleLogout]);

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!userToken ? (
            <>
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Feed">
                {(props) => <FeedScreen {...props} onLogout={handleLogout} />}
              </Stack.Screen>
              <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
              <Stack.Screen name="Camera" component={CameraScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
