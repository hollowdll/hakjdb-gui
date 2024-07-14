import "./App.css";
import { Box, CssBaseline, PaletteMode, useMediaQuery } from "@mui/material";
import { amber, deepOrange, grey } from "@mui/material/colors";
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

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: grey,
          background: {
            default: deepOrange[100],
            box: deepOrange[700],
            paper: deepOrange[500],
          },
          divider: grey[500],
          text: {
            primary: grey[900],
            secondary: grey[600],
          },
        }
      : {
          primary: deepOrange,
          background: {
            default: deepOrange[900],
            box: deepOrange[700],
          },
          text: {
            primary: "#fff",
            secondary: grey[500],
          },
        }),
  },
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setDarkMode = useThemeStore((state) => state.setDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );

  useEffect(() => {
    if (prefersDarkMode) setDarkMode(true);
  }, [prefersDarkMode, setDarkMode]);

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
    </ThemeProvider>
  );
}

export default App;
