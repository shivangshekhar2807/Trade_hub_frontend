"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import Store from "../utils/redux/store"
import AppHeader from "./_components/AppHeader";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return <Provider store={Store}>
        <AppHeader></AppHeader>
        {children}
    
    </Provider>;
}