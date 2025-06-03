// app/client-layout.tsx (Client Component)
'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { checkAuth } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxWrapper>

          <LayoutContent>
    <div className="font-sans">

            {children}
                  </div>

            </LayoutContent>

      </ReduxWrapper>
    </Provider>
  );
}

function ReduxWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <>{children}</>;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="hidden lg:block">
        <main className="pt-0 pl-0">{children}</main>
      </div>
      <div className="block lg:hidden">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}