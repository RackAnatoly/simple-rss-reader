import Parser from "rss-parser";
import { v4 as uuidv4 } from "uuid";
import { Feed, Article } from "../types";

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "content"], "categories"]
  }
});

export async function fetchRssFeed(feed: Feed): Promise<Article[]> {
  try {
    const rssFeed = await parser.parseURL(feed.url);

    const articles: Article[] = rssFeed.items.map((item) => ({
      id: item.guid || item.link || uuidv4(),
      feedId: feed.id,
      title: item.title || "Untitled",
      link: item.link || "",
      pubDate: item.pubDate || new Date().toISOString(),
      content: item.content || item["content:encoded"] || "",
      description: item.description || "",
      isRead: false,
      isFavorite: false,
      author: item.creator || item.author || "",
      categories: item.categories || []
    }));

    return articles;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    throw error;
  }
}
