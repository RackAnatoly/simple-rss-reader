import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feed } from "../types";
import { RootStackParamList } from "../types/navigation";

interface FeedItemProps {
  feed: Feed;
  onEdit: (feed: Feed) => void;
  onDelete: (feedId: string) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function FeedItem({ feed, onEdit, onDelete }: FeedItemProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate("FeedDetail", {
      feedId: feed.id,
      title: feed.title
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{feed.title}</Text>
        <Text style={styles.url} numberOfLines={1}>
          {feed.url}
        </Text>
      </View>
      <View style={styles.actions}>
        <IconButton icon="pencil" size={20} onPress={() => onEdit(feed)} />
        <IconButton icon="delete" size={20} onPress={() => onDelete(feed.id)} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white"
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  url: {
    fontSize: 14,
    color: "gray",
    marginTop: 5
  },
  actions: {
    flexDirection: "row",
    alignItems: "center"
  }
});
