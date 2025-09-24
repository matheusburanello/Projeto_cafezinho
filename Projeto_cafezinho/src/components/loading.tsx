import React from "react";
import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a'
    }}>
      <ActivityIndicator color="#ffffff" size="large" />
    </View>
  );
}
