import React, { useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { Text, FAB } from "react-native-paper";
import { useAppState } from "../context/AppStateContext";
import { AddFeedModal } from "../components/AddFeedModal";
import { FeedItem } from "../components/FeedItem";
import { Feed } from "../types";

export function FeedsScreen() {
  const { state, dispatch } = useAppState();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFeed, setEditingFeed] = useState<Feed | undefined>(undefined);

  const handleAddFeed = () => {
    setEditingFeed(undefined);
    setModalVisible(true);
  };

  const handleEditFeed = (feed: Feed) => {
    setEditingFeed(feed);
    setModalVisible(true);
  };

  const handleDeleteFeed = (feedId: string) => {
    Alert.alert(
      "Delete Feed",
      "Are you sure you want to delete this feed? All articles from this feed will also be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => dispatch({ type: "DELETE_FEED", payload: feedId }),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage RSS Feeds</Text>

      {state.feeds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No feeds added yet. Add your first RSS feed to start!
          </Text>
        </View>
      ) : (
        <FlatList
          data={state.feeds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeedItem
              feed={item}
              onEdit={handleEditFeed}
              onDelete={handleDeleteFeed}
            />
          )}
        />
      )}

      <FAB style={styles.fab} icon="plus" onPress={handleAddFeed} />

      <AddFeedModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        editFeed={editingFeed}
      />
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
  }
});
