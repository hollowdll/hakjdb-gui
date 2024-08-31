import "./App.css";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConnectionView from "./components/views/ConnectionView";
import ServerView from "./components/views/server/ServerView";
import DatabasesView from "./components/views/DatabasesView";
import KeysView from "./components/views/KeysView";
import ConnectionManager from "./components/connect/ConnectionManager";
import HomeView from "./components/views/HomeView";
import LoadingBackdrop from "./components/common/LoadingBackdrop";
import AlertBox from "./components/common/AlertBox";
import { useThemeStore } from "./state/store";
import { useEffect, useMemo } from "react";
import { EventPayloadSetDarkMode, tauriListenEvents } from "./tauri/event";
import { listen } from "@tauri-apps/api/event";
import { getDesignTokens } from "./style";
import { BottomBar } from "./components/layout/BottomBar";
import { invokeHandleSettings, invokeSettingsSetTheme } from "./tauri/command";
import { errorAlert } from "./utility/alert";

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setDarkMode = useThemeStore((state) => state.setDarkMode);

  const theme = useMemo(
    () => createTheme(getDesignTokens(isDarkMode ? "dark" : "light")),
    [isDarkMode],
  );

  useEffect(() => {
    const unlisten = listen<EventPayloadSetDarkMode>(
      tauriListenEvents.setDarkMode,
      (event) => {
        setDarkMode(event.payload.darkMode);
        if (event.payload.save) {
          invokeSettingsSetTheme(event.payload.darkMode).catch((err) => {
            errorAlert(`Failed to write settings: ${err}`);
          });
        }
      },
    );
    invokeHandleSettings();

    return () => {
      unlisten.then((resolve) => resolve());
    };
  }, [setDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex" }}>
          <ConnectionManager />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/connection" element={<ConnectionView />} />
            <Route path="/server" element={<ServerView />} />
            <Route path="/databases" element={<DatabasesView />} />
            <Route path="/keys" element={<KeysView />} />
          </Routes>
        </Box>
      </Router>
      <LoadingBackdrop />
      <AlertBox />
      <BottomBar />
    </ThemeProvider>
  );
}

export default App;
