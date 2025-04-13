import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider } from "./src/context/AppStateContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <AppStateProvider>
            {/* <StatusBar style="auto" /> */}
            <Text>RSS Reader App</Text>
          </AppStateProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
