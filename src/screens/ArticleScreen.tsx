import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type ArticleParams = {
  Article: {
    articleId: string;
    title: string;
  };
};

export function ArticleScreen() {
  const route = useRoute<RouteProp<ArticleParams, "Article">>();
  const { articleId, title } = route.params;

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
