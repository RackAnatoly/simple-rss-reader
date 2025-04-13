import "rss-parser";

declare module "rss-parser" {
  interface Item {
    description?: string;
    content?: string;
    "content:encoded"?: string;
    author?: string;
    creator?: string;
    categories?: string[];
    guid?: string;
  }
}
