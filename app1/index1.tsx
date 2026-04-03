import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from '../screens/Home';

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Simulate loading (API, fonts, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAppReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null; // keep splash visible
  }

   return <HomeScreen />;
}