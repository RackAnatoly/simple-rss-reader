import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feed, Article, AppState } from "../types";

const FEEDS_STORAGE_KEY = "@rss_reader:feeds";
const ARTICLES_STORAGE_KEY = "@rss_reader:articles";

export async function saveFeeds(feeds: Feed[]) {
  try {
    await AsyncStorage.setItem(FEEDS_STORAGE_KEY, JSON.stringify(feeds));
  } catch (error) {
    console.error("Error saving feeds:", error);
  }
}

export async function getFeeds(): Promise<Feed[]> {
  try {
    const feedsJson = await AsyncStorage.getItem(FEEDS_STORAGE_KEY);
    return feedsJson ? JSON.parse(feedsJson) : [];
  } catch (error) {
    console.error("Error getting feeds:", error);
    return [];
  }
}

export async function saveArticles(articles: Article[]) {
  try {
    await AsyncStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error("Error saving articles:", error);
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const articlesJson = await AsyncStorage.getItem(ARTICLES_STORAGE_KEY);
    return articlesJson ? JSON.parse(articlesJson) : [];
  } catch (error) {
    console.error("Error getting articles:", error);
    return [];
  }
}

export async function saveAppState(state: AppState) {
  try {
    await saveFeeds(state.feeds);
    await saveArticles(state.articles);
  } catch (error) {
    console.error("Error saving app state:", error);
  }
}

export async function loadAppState(): Promise<Partial<AppState>> {
  try {
    const feeds = await getFeeds();
    const articles = await getArticles();

    return {
      feeds,
      articles
    };
  } catch (error) {
    console.error("Error loading app state:", error);
    return {};
  }
}
