import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { HomeScreen } from "../screens/HomeScreen";
import { FeedsScreen } from "../screens/FeedsScreen";
import { FeedDetailScreen } from "../screens/FeedDetailScreen";
import { ArticleScreen } from "../screens/ArticleScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Feeds") {
            iconName = focused ? "rss" : "rss-box";
          } else if (route.name === "Favorites") {
            iconName = focused ? "star" : "star-outline";
          }

          return (
            <MaterialCommunityIcons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feeds" component={FeedsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FeedDetail"
          component={FeedDetailScreen}
          options={({ route }: any) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="Article"
          component={ArticleScreen}
          options={({ route }: any) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
