# RSS Reader for React Native

A simple and clean RSS reader application built with React Native and Expo. This app allows users to subscribe to various RSS feeds, read articles, search, and manage their subscriptions.

## Features

- **Feed Management**: Add, edit, and delete RSS feed subscriptions
- **Article Reading**: Read full articles with HTML rendering support
- **Search & Filtering**: Search for articles by title or description and filter unread articles
- **Favorites**: Mark articles as favorites for easy access later
- **Offline Support**: Previously loaded feeds and articles are saved locally
- **Read/Unread Tracking**: Keep track of what you've already read

## Screenshots


## Technologies Used

- React Native with Expo
- TypeScript for type-safe development
- React Navigation for screen navigation
- React Native Paper for UI components
- AsyncStorage for local data persistence
- Fast XML Parser for parsing RSS feeds

## Getting Started

### Prerequisites

- Node.js (14.x or later)
- Yarn or npm
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RackAnatoly/simple-rss-reader.git
cd simple-rss-reader
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn start
```

4. Run on a device or emulator:
   - Press `a` to run on Android emulator
   - Press `i` to run on iOS simulator
   - Scan the QR code with the Expo Go app on your physical device

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React Context for state management
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # Screen components
├── services/         # Services for data fetching
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Usage Guide

### Adding a Feed

1. Navigate to the "Feeds" tab
2. Tap the "+" button
3. Enter a feed URL (e.g., `https://feeds.bbci.co.uk/news/rss.xml`)
4. The app will automatically detect the feed title or you can provide your own
5. Tap "Save" to add the feed

### Reading Articles

1. Navigate to the "Home" tab to see all articles
2. Tap on any article to read its content
3. Use the star icon to add an article to favorites
4. Use the share icon to share the article
5. Use the external link icon to open the article in your browser

### Searching and Filtering

1. Use the search bar at the top of the "Home", "Feed Detail", or "Favorites" screens
2. Toggle the "Unread only" chip to filter for unread articles
3. Use the "Mark all as read" button to mark all visible articles as read

## Known Issues & Limitations

- Some RSS feeds may not render correctly if they have non-standard structures
- Large images in articles may take time to load
- The offline experience is limited to previously loaded content


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
