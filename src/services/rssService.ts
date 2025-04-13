import { XMLParser } from "fast-xml-parser";
import { v4 as uuidv4 } from "uuid";
import { Feed, Article } from "../types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

export async function fetchRssFeed(feed: Feed): Promise<Article[]> {
  try {
    const response = await fetch(feed.url);
    const text = await response.text();

    const result = parser.parse(text);

    const channel = result.rss?.channel || {};
    const items = channel.item || [];

    const itemsArray = Array.isArray(items) ? items : [items];

    const articles: Article[] = itemsArray.map((item) => ({
      id: item.guid?.["#text"] || item.link || uuidv4(),
      feedId: feed.id,
      title: item.title || "Untitled",
      link: item.link || "",
      pubDate: item.pubDate || new Date().toISOString(),
      content: item["content:encoded"] || item.content || "",
      description: item.description || "",
      isRead: false,
      isFavorite: false,
      author: item.creator || item.author || "",
      categories: Array.isArray(item.category)
        ? item.category
        : item.category
        ? [item.category]
        : []
    }));

    return articles;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    throw error;
  }
}

export async function fetchAllFeeds(feeds: Feed[]): Promise<Article[]> {
  try {
    const articlesPromises = feeds.map((feed) => fetchRssFeed(feed));
    const articlesArrays = await Promise.all(articlesPromises);

    return articlesArrays.flat();
  } catch (error) {
    console.error("Error fetching all feeds:", error);
    throw error;
  }
}

export async function getFeedTitle(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const text = await response.text();

    const result = parser.parse(text);
    const channel = result.rss?.channel || {};

    return channel.title || "Untitled Feed";
  } catch (error) {
    console.error("Error fetching feed title:", error);
    throw error;
  }
}
