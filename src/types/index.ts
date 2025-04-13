export interface Feed {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  added: number;
}

export interface Article {
  id: string;
  feedId: string;
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  description?: string;
  isRead: boolean;
  isFavorite: boolean;
  author?: string;
  categories?: string[];
}

export interface AppState {
  feeds: Feed[];
  articles: Article[];
  isLoading: boolean;
  error?: string;
}
