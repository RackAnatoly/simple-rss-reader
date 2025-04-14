import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Provider as PaperProvider,
  Snackbar,
  ActivityIndicator,
  Text
} from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider, useAppState } from "./src/context/AppStateContext";
import { Navigation } from "./src/navigation";

function ErrorHandler() {
  const { state, dispatch } = useAppState();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
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

function InitialLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.loadingText}>Loading your feeds...</Text>
    </View>
  );
}

function Main() {
  const { state } = useAppState();

  if (
    state.isLoading &&
    state.articles.length === 0 &&
    state.feeds.length === 0
  ) {
    return <InitialLoadingScreen />;
  }

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16
  }
});
