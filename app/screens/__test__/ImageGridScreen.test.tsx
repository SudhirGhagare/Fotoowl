import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ImageGridScreen from "../ImageGridScreen";

// --- Mock navigation ---
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useFocusEffect: (fn: any) => fn(),
}));

// --- Mock hooks ---
jest.mock("../../hooks/useInfiniteImages", () => ({
  useInfiniteImages: jest.fn(),
}));
jest.mock("../../hooks/useNetworkStatus", () => ({
  useNetworkStatus: jest.fn(),
}));

// --- Mock storage ---
jest.mock("../../services/storage", () => ({
  getFavorites: jest.fn().mockResolvedValue(["1"]),
  saveFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}));

// --- Mock theme ---
jest.mock("../../theme/ThemeContext", () => ({
  useTheme: () => ({
    navigationTheme: { colors: { background: "white", text: "black" } },
  }),
}));

// --- Mock vector icons ---
jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

// --- Mock expo-image ---
jest.mock("expo-image", () => ({
  Image: "Image",
}));

import { useInfiniteImages } from "../../hooks/useInfiniteImages";
import storage from "../../services/storage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

describe("ImageGridScreen", () => {

  const mockImages = [
    {
      id: "1",
      thumbnail_url: 
        "test_url_1.webp",
    },
    {
      id: "2",
      thumbnail_url:
        "test_url_2.webp",
    },
  ];

  let loadNextMock: jest.Mock;
  let refreshMock: jest.Mock;

  beforeEach(() => {
    loadNextMock = jest.fn();
    refreshMock = jest.fn();

    (useInfiniteImages as jest.Mock).mockReturnValue({
      items: mockImages,
      loading: false,
      refreshing: false,
      error: null,
      hasNext: true,
      loadNext: loadNextMock,
      refresh: refreshMock,
    });

    (storage.getFavorites as jest.Mock).mockResolvedValue(["1"]);
    (useNetworkStatus as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initial render: ", () => {

    it("renders images correctly", async () => {

    const { getAllByTestId } = render(<ImageGridScreen route={{ params: {} }} />);

    await waitFor(() => {
    
      const images = getAllByTestId("image-item");
      expect(images).toHaveLength(mockImages.length);

      mockImages.forEach((img, index) => {
      expect(images[index].props.source.uri).toBe(img.thumbnail_url);
      });

    });
  });

  it("toggles favorite when heart icon is pressed", async () => {

    const { getByTestId } = render(<ImageGridScreen route={{ params: {} }} />);

    await waitFor(() => { 
      expect(storage.getFavorites).toHaveBeenCalled();
    });

    const hearts = getByTestId("favorite-icon-1");
    fireEvent.press(hearts);

    await waitFor(() => { 
      expect(storage.removeFavorite).toHaveBeenCalledWith("1");
    });
    
  });
});

  describe("offline mode", () => {

    it("shows offline banner when offline", () => {

      (useNetworkStatus as jest.Mock).mockReturnValue(false);
      const { getByText } = render(<ImageGridScreen route={{ params: {} }} />);
      expect(getByText(/You are offline/)).toBeTruthy();

    });
  });

  describe("loading state", () => {

    it("renders SkeletonGrid when loading and no items", () => {

      (useInfiniteImages as jest.Mock).mockReturnValue({
        items: mockImages,
        loading: true,
        refreshing: false,
        error: null,
        hasNext: false,
        loadNext: jest.fn(),
        refresh: jest.fn(),
      });

      const { getByText } = render(<ImageGridScreen route={{ params: {} }} />);
      expect(getByText("Loading...")).toBeTruthy();

    });
  });

  describe("error state", () => {
    it("renders ErrorEmpty when error occurs", () => {
      (useInfiniteImages as jest.Mock).mockReturnValue({
        items: [],
        loading: false,
        refreshing: false,
        error: { message: "Network Error" },
        hasNext: false,
        loadNext: jest.fn(),
        refresh: jest.fn(),
      });

      const { getByText } = render(<ImageGridScreen route={{ params: {} }} />);
      expect(getByText(/Network Error/)).toBeTruthy();
    });
  });

  describe("pagination", () => {

    it("calls loadNext when end of list is reached", () => {
      const { getByTestId } = render(
        <ImageGridScreen route={{ params: {} }} />
      );

      const flatList = getByTestId("flatlist"); 
      fireEvent(flatList, "onEndReached");
      expect(loadNextMock).toHaveBeenCalled();

    });
  });

});
