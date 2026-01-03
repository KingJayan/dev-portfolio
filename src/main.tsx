import { createRoot } from "react-dom/client";
import { LanguageProvider } from "@/contexts/LanguageContext";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@/hooks/use-theme";
import { DrawingProvider } from "@/contexts/DrawingContext";

createRoot(document.getElementById("root")!).render(
    <LanguageProvider>
        <ThemeProvider>
            <DrawingProvider>
                <App />
            </DrawingProvider>
        </ThemeProvider>
    </LanguageProvider>
);
