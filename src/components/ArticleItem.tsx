import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import { Article } from "../types";
import { RootStackParamList } from "../types/navigation";
import { useAppState } from "../context/AppStateContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ArticleItemProps {
  article: Article;
}

export function ArticleItem({ article }: ArticleItemProps) {
  const navigation = useNavigation<NavigationProp>();
  const { dispatch } = useAppState();

  const handlePress = () => {
    dispatch({ type: "MARK_AS_READ", payload: article.id });
    navigation.navigate("Article", {
      articleId: article.id,
      title: article.title
    });
  };

  const handleFavoriteToggle = (e: any) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_FAVORITE", payload: article.id });
  };

  const getFormattedDate = () => {
    try {
      return format(new Date(article.pubDate), "MMM d, yyyy");
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={[styles.indicator, article.isRead ? null : styles.unread]} />
      <View style={styles.content}>
        <Text
          style={[styles.title, article.isRead ? styles.readTitle : null]}
          numberOfLines={2}
        >
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {article.description}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.date}>{getFormattedDate()}</Text>
          {article.author ? (
            <Text style={styles.author}>by {article.author}</Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        onPress={handleFavoriteToggle}
        style={styles.favoriteButton}
      >
        <Avatar.Icon
          size={24}
          icon={article.isFavorite ? "star" : "star-outline"}
          color={article.isFavorite ? "#FFD700" : "#757575"}
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
    alignItems: "center"
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  },
  unread: {
    backgroundColor: "#2196F3"
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  readTitle: {
    fontWeight: "normal",
    color: "#757575"
  },
  description: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 5
  },
  meta: {
    flexDirection: "row",
    alignItems: "center"
  },
  date: {
    fontSize: 12,
    color: "#9E9E9E"
  },
  author: {
    fontSize: 12,
    color: "#9E9E9E",
    marginLeft: 10
  },
  favoriteButton: {
    padding: 5
  },
  favoriteIcon: {
    backgroundColor: "transparent"
  }
});
