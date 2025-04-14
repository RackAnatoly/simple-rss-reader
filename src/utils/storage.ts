import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feed, Article, AppState } from "../types";

const FEEDS_STORAGE_KEY = "@rss_reader:feeds";
const ARTICLES_STORAGE_KEY = "@rss_reader:articles";
const SETTINGS_STORAGE_KEY = "@rss_reader:settings";

export async function saveFeeds(feeds: Feed[]) {
  try {
    await AsyncStorage.setItem(FEEDS_STORAGE_KEY, JSON.stringify(feeds));
    return true;
  } catch (error) {
    console.error("Error saving feeds:", error);
    return false;
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
    return true;
  } catch (error) {
    console.error("Error saving articles:", error);
    return false;
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
    const promises = [saveFeeds(state.feeds), saveArticles(state.articles)];

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Error saving app state:", error);
    return false;
  }
}

export async function loadAppState(): Promise<Partial<AppState>> {
  try {
    const [feeds, articles] = await Promise.all([getFeeds(), getArticles()]);

    return {
      feeds,
      articles,
      isLoading: false
    };
  } catch (error) {
    console.error("Error loading app state:", error);
    return {
      feeds: [],
      articles: [],
      isLoading: false
    };
  }
}

export async function clearAllData() {
  try {
    const keys = [
      FEEDS_STORAGE_KEY,
      ARTICLES_STORAGE_KEY,
      SETTINGS_STORAGE_KEY
    ];

    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error("Error clearing app data:", error);
    return false;
  }
}
