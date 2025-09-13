import { ThemeProvider } from "./theme/ThemeContext";
import AppNavigation from "./navigation";
import { registerRootComponent } from "expo";

registerRootComponent(Index);

export default function Index() {
  return (
    <ThemeProvider>
        <AppNavigation/>
    </ThemeProvider>

  );
}
