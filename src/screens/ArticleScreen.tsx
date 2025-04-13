import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
  Share
} from "react-native";
import { Text, IconButton, Divider, Button } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";
import { format } from "date-fns";
import { RootStackParamList } from "../types/navigation";
import { useAppState } from "../context/AppStateContext";

type ArticleRouteProp = RouteProp<RootStackParamList, "Article">;

const { width } = Dimensions.get("window");

export function ArticleScreen() {
  const route = useRoute<ArticleRouteProp>();
  const { articleId } = route.params;
  const { state, dispatch } = useAppState();
  const [article, setArticle] = useState(
    state.articles.find((a) => a.id === articleId)
  );

  useEffect(() => {
    if (articleId && !article?.isRead) {
      dispatch({ type: "MARK_AS_READ", payload: articleId });
    }
  }, [articleId, article?.isRead, dispatch]);

  useEffect(() => {
    const updatedArticle = state.articles.find((a) => a.id === articleId);
    if (updatedArticle) {
      setArticle(updatedArticle);
    }
  }, [state.articles, articleId]);

  if (!article) {
    return (
      <View style={styles.container}>
        <Text>Article not found</Text>
      </View>
    );
  }

  const getFormattedDate = () => {
    try {
      return format(new Date(article.pubDate), "MMMM d, yyyy h:mm a");
    } catch (e) {
      return "Unknown date";
    }
  };

  const htmlContent =
    article.content || article.description || "<p>No content available</p>";

  const handleOpenLink = () => {
    if (article.link) {
      Linking.openURL(article.link);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title} - ${article.link}`,
        url: article.link
      });
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };

  const handleToggleFavorite = () => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: article.id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.date}>{getFormattedDate()}</Text>

        {article.author ? (
          <Text style={styles.author}>By {article.author}</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <IconButton
          icon={article.isFavorite ? "star" : "star-outline"}
          iconColor={article.isFavorite ? "#FFD700" : "#757575"}
          size={24}
          onPress={handleToggleFavorite}
        />
        <IconButton icon="share-variant" size={24} onPress={handleShare} />
        <IconButton icon="open-in-new" size={24} onPress={handleOpenLink} />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.content}>
        <RenderHtml
          contentWidth={width - 32}
          source={{ html: htmlContent }}
          renderersProps={{
            a: {
              onPress: (_, href) => {
                Linking.openURL(href);
              }
            }
          }}
        />
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleOpenLink}
          style={styles.readMoreButton}
        >
          Read Full Article
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8
  },
  date: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4
  },
  author: {
    fontSize: 14,
    color: "#757575"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8
  },
  divider: {
    marginVertical: 8
  },
  content: {
    padding: 16
  },
  footer: {
    padding: 16,
    alignItems: "center"
  },
  readMoreButton: {
    width: "100%",
    marginTop: 16
  }
});
