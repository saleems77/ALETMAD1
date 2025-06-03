// app/providers.tsx
"use client";
import { ReactNode } from "react";
import { Provider } from 'react-redux';
import { store } from '../store/store';

import { MantineProvider } from "@mantine/core";
import { MediaRecorderProvider } from "@/contexts/MediaRecorderContext";
import { LicenseProvider } from "./DashBoardAdmin/components/Saas/LicenseContext";
import { ConfirmProvider } from "./DashBoardAdmin/components/Saas/ConfirmContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
       <Provider store={store}>

    <MantineProvider>
      <MediaRecorderProvider>
        <LicenseProvider>
          <ConfirmProvider>
            <LanguageProvider>

              {children}


              </LanguageProvider>
          </ConfirmProvider>
        </LicenseProvider>
      </MediaRecorderProvider>
    </MantineProvider>
             </Provider>

  );
}
