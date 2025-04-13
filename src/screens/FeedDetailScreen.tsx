import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { useAppState } from "../context/AppStateContext";
import { ArticleItem } from "../components/ArticleItem";
import { fetchRssFeed } from "../services/rssService";

type FeedDetailRouteProp = RouteProp<RootStackParamList, "FeedDetail">;

export function FeedDetailScreen() {
  const route = useRoute<FeedDetailRouteProp>();
  const { feedId, title } = route.params;
  const { state, dispatch } = useAppState();

  const feedArticles = state.articles
    .filter((article) => article.feedId === feedId)
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

  const handleRefresh = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const feed = state.feeds.find((f) => f.id === feedId);
      if (feed) {
        const articles = await fetchRssFeed(feed);
        dispatch({ type: "ADD_ARTICLES", payload: articles });
      }
    } catch (error) {
      console.error("Error refreshing feed:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to refresh feed. Please try again."
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Button
        mode="contained"
        onPress={handleRefresh}
        style={{ marginBottom: 16 }}
        disabled={state.isLoading}
      >
        {state.isLoading ? "Loading..." : "Refresh Feed"}
      </Button>

      {state.isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {feedArticles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No articles found in this feed. Click Refresh to load articles.
              </Text>
            </View>
          ) : (
            <FlatList
              data={feedArticles}
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
