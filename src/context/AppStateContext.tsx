import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AppState, Feed, Article } from "../types";

const initialState: AppState = {
  feeds: [],
  articles: [],
  isLoading: false,
  error: undefined
};

type ActionType =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "ADD_FEED"; payload: Feed }
  | { type: "UPDATE_FEED"; payload: Feed }
  | { type: "DELETE_FEED"; payload: string }
  | { type: "SET_ARTICLES"; payload: Article[] }
  | { type: "ADD_ARTICLES"; payload: Article[] }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "INIT_STATE"; payload: Partial<AppState> };

function appReducer(state: AppState, action: ActionType): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "ADD_FEED":
      return { ...state, feeds: [...state.feeds, action.payload] };
    case "UPDATE_FEED":
      return {
        ...state,
        feeds: state.feeds.map((feed) =>
          feed.id === action.payload.id ? action.payload : feed
        )
      };
    case "DELETE_FEED":
      return {
        ...state,
        feeds: state.feeds.filter((feed) => feed.id !== action.payload),
        articles: state.articles.filter(
          (article) => article.feedId !== action.payload
        )
      };
    case "SET_ARTICLES":
      return { ...state, articles: action.payload };
    case "ADD_ARTICLES":
      const existingIds = new Set(state.articles.map((article) => article.id));
      const newArticles = action.payload.filter(
        (article) => !existingIds.has(article.id)
      );
      return {
        ...state,
        articles: [...state.articles, ...newArticles]
      };
    case "MARK_AS_READ":
      return {
        ...state,
        articles: state.articles.map((article) =>
          article.id === action.payload ? { ...article, isRead: true } : article
        )
      };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        articles: state.articles.map((article) =>
          article.id === action.payload
            ? { ...article, isFavorite: !article.isFavorite }
            : article
        )
      };
    case "INIT_STATE":
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}

type AppStateContextType = {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
};

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
