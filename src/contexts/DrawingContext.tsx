import { createContext, useContext, useState, ReactNode } from "react";

interface DrawingContextType {
    isDrawingMode: boolean;
    toggleDrawingMode: () => void;
    tool: 'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle';
    setTool: (tool: 'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle') => void;
    color: string;
    setColor: (color: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export function DrawingProvider({ children }: { children: ReactNode }) {
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [tool, setTool] = useState<'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle'>('pencil');

    const [color, setColor] = useState<string>('default'); // 'default' changes with theme
    const [brushSize, setBrushSize] = useState<number>(3); //default to "pen" size

    const toggleDrawingMode = () => {
        setIsDrawingMode((prev) => !prev);
        // reset tool to pencil when closing/opening
        if (isDrawingMode) {
            setTool('pencil');
            setColor('default');
            setBrushSize(3);
        }
    };

    return (
        <DrawingContext.Provider value={{
            isDrawingMode,
            toggleDrawingMode,
            tool,
            setTool,
            color,
            setColor,
            brushSize,
            setBrushSize
        }}>
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
