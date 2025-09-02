import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

function Root() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#5b6cff" },
          secondary: { main: "#ff4db8" },
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App onToggleTheme={() => setMode((m) => (m === "light" ? "dark" : "light"))} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
