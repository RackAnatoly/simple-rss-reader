import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, Snackbar } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider, useAppState } from "./src/context/AppStateContext";
import { Navigation } from "./src/navigation";

function ErrorHandler() {
  const { state, dispatch } = useAppState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.error) {
      setVisible(true);
    }
  }, [state.error]);

  const onDismiss = () => {
    setVisible(false);
    dispatch({ type: "SET_ERROR", payload: "" });
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      action={{
        label: "Close",
        onPress: onDismiss
      }}
      duration={5000}
    >
      {state.error}
    </Snackbar>
  );
}

function Main() {
  return (
    <>
      <Navigation />
      <ErrorHandler />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <AppStateProvider>
            <StatusBar style="auto" />
            <Main />
          </AppStateProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
