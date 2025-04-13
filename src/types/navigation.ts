import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  FeedDetail: {
    feedId: string;
    title: string;
  };
  Article: {
    articleId: string;
    title: string;
  };
};

export type HomeTabParamList = {
  Home: undefined;
  Feeds: undefined;
  Favorites: undefined;
};
