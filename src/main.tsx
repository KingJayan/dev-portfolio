import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@/hooks/use-theme";
import { DrawingProvider } from "@/contexts/DrawingContext";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <DrawingProvider>
            <App />
        </DrawingProvider>
    </ThemeProvider>
);
