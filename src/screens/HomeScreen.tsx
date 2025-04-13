import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { useAppState } from "../context/AppStateContext";
import { ArticleItem } from "../components/ArticleItem";
import { fetchAllFeeds } from "../services/rssService";

export function HomeScreen() {
  const { state, dispatch } = useAppState();

  const sortedArticles = [...state.articles].sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const handleRefresh = async () => {
    if (state.feeds.length === 0) {
      dispatch({
        type: "SET_ERROR",
        payload: "No feeds added. Add feeds first to load articles."
      });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const articles = await fetchAllFeeds(state.feeds);
      dispatch({ type: "ADD_ARTICLES", payload: articles });
    } catch (error) {
      console.error("Error refreshing feeds:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to refresh feeds. Please try again."
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Articles</Text>

      <Button
        mode="contained"
        onPress={handleRefresh}
        style={{ marginBottom: 16 }}
        disabled={state.isLoading}
      >
        {state.isLoading ? "Loading..." : "Refresh Feeds"}
      </Button>

      {state.isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {sortedArticles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No articles found. Add RSS feeds and click Refresh to see
                articles here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedArticles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ArticleItem article={item} />}
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
