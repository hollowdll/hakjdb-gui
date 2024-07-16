import { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#fff",
            paper: "#fff",
          },
          divider: "rgba(0,0,0,0.12)",
          text: {
            primary: "rgba(0,0,0,0.87)",
            secondary: "rgba(0,0,0,0.6)",
            disabled: "rgba(0,0,0,0.38)",
          },
          action: {
            active: "rgba(0,0,0,0.54)",
            hover: "rgba(0,0,0,0.04)",
            selected: "rgba(0,0,0,0.08)",
            disabled: "rgba(0,0,0,0.26)",
            disabledBackground: "rgba(0,0,0,0.12)",
          },
        }
      : {
          background: {
            default: "rgb(45,45,45)",
            paper: "rgb(20,20,20)",
          },
          divider: "rgba(255,255,255,0.12)",
          text: {
            primary: "#fff",
            secondary: "rgba(255,255,255,0.7)",
            disabled: "rgba(255,255,255,0.5)",
          },
          action: {
            active: "#fff",
            hover: "rgba(255,255,255,0.08)",
            selected: "rgba(255,255,255,0.16)",
            disabled: "rgba(255,255,255,0.3)",
            disabledBackground: "rgba(255,255,255,0.12)",
          },
        }),
  },
});
