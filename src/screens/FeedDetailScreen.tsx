import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  Searchbar,
  Chip
} from "react-native-paper";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getFilteredArticles = useCallback(() => {
    let filtered = state.articles.filter(
      (article) => article.feedId === feedId
    );

    if (showUnreadOnly) {
      filtered = filtered.filter((article) => !article.isRead);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          (article.description &&
            article.description.toLowerCase().includes(query))
      );
    }

    return [...filtered].sort((a, b) => {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });
  }, [state.articles, feedId, searchQuery, showUnreadOnly]);

  const filteredArticles = getFilteredArticles();

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

  const handleMarkAllAsRead = () => {
    const articleIds = filteredArticles
      .filter((article) => !article.isRead)
      .map((article) => article.id);

    articleIds.forEach((id) => {
      dispatch({ type: "MARK_AS_READ", payload: id });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Searchbar
        placeholder="Search in this feed"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={showUnreadOnly}
          onPress={() => setShowUnreadOnly(!showUnreadOnly)}
          style={styles.filterChip}
        >
          Unread only
        </Chip>

        <Button
          mode="text"
          onPress={handleMarkAllAsRead}
          disabled={filteredArticles.filter((a) => !a.isRead).length === 0}
        >
          Mark all as read
        </Button>
      </View>

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
          {filteredArticles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery || showUnreadOnly
                  ? "No articles match your search or filter criteria."
                  : "No articles found in this feed. Click Refresh to load articles."}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredArticles}
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
  searchBar: {
    marginBottom: 16
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  filterChip: {
    marginRight: 8
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
