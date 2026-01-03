import { createContext, useContext, useState, ReactNode } from "react";

interface DrawingContextType {
    isDrawingMode: boolean;
    toggleDrawingMode: () => void;
    tool: 'pencil' | 'eraser';
    setTool: (tool: 'pencil' | 'eraser') => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export function DrawingProvider({ children }: { children: ReactNode }) {
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

    const toggleDrawingMode = () => {
        setIsDrawingMode((prev) => !prev);
        // Reset tool to pencil when closing/opening
        if (isDrawingMode) {
            setTool('pencil');
        }
    };

    return (
        <DrawingContext.Provider value={{ isDrawingMode, toggleDrawingMode, tool, setTool }}>
            {children}
        </DrawingContext.Provider>
    );
}

export function useDrawing() {
    const context = useContext(DrawingContext);
    if (context === undefined) {
        throw new Error("useDrawing must be used within a DrawingProvider");
    }
    return context;
}
