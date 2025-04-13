import { XMLParser } from "fast-xml-parser";
import { generateId } from "../utils/idGenerator";
import { Feed, Article } from "../types";

const proxyUrl = "https://api.allorigins.win/raw?url=";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

export async function fetchRssFeed(feed: Feed): Promise<Article[]> {
  try {
    console.log("Fetching feed:", feed.url);

    const actualUrl = proxyUrl + encodeURIComponent(feed.url);
    console.log("Using proxy URL:", actualUrl);

    const response = await fetch(actualUrl, {
      method: "GET",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    try {
      const result = parser.parse(text);

      const channel = result.rss?.channel || {};

      if (!channel) {
        return [];
      }

      const items = channel.item || [];

      const itemsArray = Array.isArray(items) ? items : [items];
      console.log("Articles found:", itemsArray.length);

      const articles: Article[] = itemsArray.map((item) => ({
        id: item.guid?.["#text"] || item.link || generateId(),
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
    } catch (parseError) {
      console.error("Error parsing XML:", parseError);

      const titleRegex = /<title>(.*?)<\/title>/g;
      const linkRegex = /<link>(.*?)<\/link>/g;
      const descRegex = /<description>(.*?)<\/description>/g;

      const titles = [...text.matchAll(titleRegex)].map((m) => m[1]);
      const links = [...text.matchAll(linkRegex)].map((m) => m[1]);
      const descriptions = [...text.matchAll(descRegex)].map((m) => m[1]);

      const articleCount = Math.min(
        titles.length - 1,
        links.length - 1,
        descriptions.length - 1
      );

      if (articleCount <= 0) {
        return [];
      }

      const articles: Article[] = [];

      for (let i = 1; i <= articleCount; i++) {
        articles.push({
          id: generateId(),
          feedId: feed.id,
          title: titles[i] || "Untitled",
          link: links[i] || "",
          pubDate: new Date().toISOString(),
          content: "",
          description: descriptions[i] || "",
          isRead: false,
          isFavorite: false,
          author: "",
          categories: []
        });
      }

      return articles;
    }
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
}

export async function fetchAllFeeds(feeds: Feed[]): Promise<Article[]> {
  try {
    const articlesPromises = feeds.map((feed) => fetchRssFeed(feed));
    const articlesArrays = await Promise.all(articlesPromises);

    return articlesArrays.flat();
  } catch (error) {
    console.error("Error fetching all feeds:", error);
    return [];
  }
}

export async function getFeedTitle(url: string): Promise<string> {
  try {
    const actualUrl = proxyUrl + encodeURIComponent(url);

    const response = await fetch(actualUrl, {
      method: "GET",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    const result = parser.parse(text);
    const channel = result.rss?.channel || {};

    return channel.title || "Untitled Feed";
  } catch (error) {
    console.error("Error fetching feed title:", error);
    return "Untitled Feed";
  }
}
