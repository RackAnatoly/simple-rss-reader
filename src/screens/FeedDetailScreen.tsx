import React from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { useAppState } from "../context/AppStateContext";
import { useRefreshFeeds } from "../hooks/useRefreshFeeds";

type FeedDetailRouteProp = RouteProp<RootStackParamList, "FeedDetail">;

export function FeedDetailScreen() {
  const route = useRoute<FeedDetailRouteProp>();
  const { feedId, title } = route.params;
  const { state } = useAppState();
  const { refreshing, refreshFeeds } = useRefreshFeeds();

  const feedArticles = state.articles
    .filter((article) => article.feedId === feedId)
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {state.isLoading && !refreshing ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {feedArticles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No articles found in this feed.
              </Text>
            </View>
          ) : (
            <FlatList
              data={feedArticles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Text>{item.title}</Text>}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshFeeds}
                />
              }
            />
          )}
        </>
      )}
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
  },
  loader: {
    marginTop: 50
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray"
  }
});
