import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useAtom } from "jotai";
import { DevTools } from "jotai-devtools";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import App from "./App";
import { themeAtom } from "./atoms/theme";
import "jotai-devtools/styles.css";

const Main = () => {
  const [theme] = useAtom(themeAtom);

  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme} />
      <App />
    </ChakraProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DevTools />
    <Main />
  </StrictMode>
);
