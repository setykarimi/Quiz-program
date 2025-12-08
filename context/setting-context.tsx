"use client";
import { createContext, useContext, useState } from "react";

type SettingContextType = {
    showSidebar: boolean
    handleShowSidebar:(value: boolean) => void

};

const SettingContext = createContext<SettingContextType>({
    showSidebar: false,
    handleShowSidebar: () => {},
});

export const SettingProvider = ({ children }: { children: React.ReactNode }) => {
    const [showSidebar, setShowSidebar] = useState(false)

    const handleShowSidebar = (value: boolean) => {
        setShowSidebar(value)
    }


    return (
        <SettingContext.Provider value={{ showSidebar, handleShowSidebar }}>
            {children}
        </SettingContext.Provider>
    );
};

export const useSetting = () => useContext(SettingContext);
