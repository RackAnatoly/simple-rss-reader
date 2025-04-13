import { useState, useCallback } from "react";
import { useAppState } from "../context/AppStateContext";
import { fetchAllFeeds } from "../services/rssService";

export function useRefreshFeeds() {
  const { state, dispatch } = useAppState();
  const [refreshing, setRefreshing] = useState(false);

  const refreshFeeds = useCallback(async () => {
    if (state.feeds.length === 0) {
      return;
    }

    try {
      setRefreshing(true);
      dispatch({ type: "SET_LOADING", payload: true });

      const articles = await fetchAllFeeds(state.feeds);
      dispatch({ type: "ADD_ARTICLES", payload: articles });
    } catch (error) {
      console.error("Error refreshing feeds:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to refresh feeds. Please try again."
      });
    } finally {
      setRefreshing(false);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.feeds, dispatch]);

  return { refreshing, refreshFeeds };
}
