import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useAppState } from "../context/AppStateContext";
import { useRefreshFeeds } from "../hooks/useRefreshFeeds";

export function HomeScreen() {
  const { state } = useAppState();
  const { refreshing, refreshFeeds } = useRefreshFeeds();

  useEffect(() => {
    if (state.feeds.length > 0 && state.articles.length === 0) {
      refreshFeeds();
    }
  }, [state.feeds, state.articles, refreshFeeds]);

  const sortedArticles = [...state.articles].sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Articles</Text>

      {state.isLoading && !refreshing ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {sortedArticles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No articles found. Add RSS feeds to see articles here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedArticles}
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
