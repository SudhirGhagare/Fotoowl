# Fotoowl 

Fotoowl is a cross-platform photo browsing app built with [Expo](https://expo.dev). It supports smooth scrolling, offline-first access, and efficient memory usage for large image lists.

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js 
- npm 
- Expo CLI
- Xcode (for iOS simulator) / Android Studio (for Android emulator)

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/SudhirGhagare/Fotoowl.git
   cd Fotoowl
2. Install Dependencies 

   ```bash
   npm install 
3. Start the app 

    ```bash 
    npx expo start

## 🏗 Architecture Overview

The app follows a modular architecture with clear separation of concerns:

- **UI Layer:** (app/screens)
All UI components and screens are organized in the screens folder. Each screen handles presentation logic only and delegates data fetching (using useInfiniteImages.ts hook defined inside app/hooks/useInfiniteImages.ts or persistence to services.

- **Networking Layer:** (app/services/api.ts)
API calls and remote data fetching are centralized inside api.ts. This ensures a single point for handling base URLs, authentication headers, retries, and error handling.

- **Storage Layer:** (app/services/storage.ts)
Local storage (via. AsyncStorage) is abstracted inside storage.ts. This provides a consistent way to cache and retrieve data without tying UI code to the storage mechanism.

- **Navigation Layer:** (app/navigation.tsx)
App routing is managed by React Navigation using a stack/tab navigator. Deep linking is supported to open specific screens or resources directly.

### 🔄 Data Flow

1. **Image Fetching**

   The ImageGridScreen.tsx screen uses the custom hook useInfiniteImages.ts to fetch and render paginated image data.

2. **Networking & Caching**

  API requests are handled in services/api.ts using a public REST API.
Response metadata is cached locally through services/storage.ts (AsyncStorage), enabling offline support.

3. **Data Delivery to UI**

  The useInfiniteImages hook returns normalized data to ImageGridScreen.tsx, which displays it in a performant infinite scroll grid.

4. **Favorites Management**

User interactions (add/remove favorites) are handled within services/storage.ts.

Updates are persisted locally, ensuring that favorite selections remain available across app restarts. 

### ⚖️ Trade-offs

Chose a services-based architecture instead of Redux or Zustand for simplicity. This keeps boilerplate low but may limit complex state sharing in larger apps.

Used React Navigation (battle-tested & community-supported) rather than a custom solution.

### 🔑 Environment Variables
Create a `.env` file in the root directory and add the following:

```bash 
API_KEY=your_api_key_here
BASE_URL=https://your_api_url_here
```
<<<<<<< HEAD
Copy `.env.example` → rename it to `.env` → fill with real values.
=======

Copy `.env.example` → rename it to `.env` → fill with real values.
>>>>>>> 522f291 (added Unit testing for Image GridScreen)
