
"use client";

import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "react-redux";
import { persistStore } from "redux-persist";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }) {
  const store = useStore();
  const [persistor, setPersistor] = useState(null);

  useEffect(() => {
    
    setPersistor(persistStore(store));
  }, [store]);

  return (
    <>
      {persistor ? (
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </>
  );
}