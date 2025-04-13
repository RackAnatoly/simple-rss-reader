import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type FeedDetailParams = {
  FeedDetail: {
    feedId: string;
    title: string;
  };
};

export function FeedDetailScreen() {
  const route = useRoute<RouteProp<FeedDetailParams, "FeedDetail">>();
  const { feedId, title } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16
  }
});
