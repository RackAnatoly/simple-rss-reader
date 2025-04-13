import React from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useAppState } from "../context/AppStateContext";
import { useRefreshFeeds } from "../hooks/useRefreshFeeds";
import { ArticleItem } from "../components/ArticleItem";

export function FavoritesScreen() {
  const { state } = useAppState();
  const { refreshing, refreshFeeds } = useRefreshFeeds();

  const favoriteArticles = state.articles
    .filter((article) => article.isFavorite)
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Articles</Text>

      {state.isLoading && !refreshing ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {favoriteArticles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No favorite articles yet. Mark articles as favorite to see them
                here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={favoriteArticles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ArticleItem article={item} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshFeeds}
                />
              }
              contentContainerStyle={styles.list}
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
  },
  list: {
    paddingBottom: 20
  }
});
