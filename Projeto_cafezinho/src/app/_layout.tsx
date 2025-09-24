import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { View } from "react-native";
import { log } from "@/utils/functions/logger";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { Loading } from "@/components/loading";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    log('Layout', 'mounted');
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#0f172a',
      paddingTop: 40
    }}>
      <Slot />
    </View>
  );
}
