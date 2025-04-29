
"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { createStore, createPersistedStore } from "../../Redux/store";

export default function ReduxProvider({ children, initialState }) {
  const storeRef = useRef();
  const persistorRef = useRef();

  if (typeof window !== 'undefined') {
    // Client-side
    if (!storeRef.current || !persistorRef.current) {
      const { store, persistor } = createPersistedStore(initialState);
      storeRef.current = store;
      persistorRef.current = persistor;
    }
  } else {
    // Server-side
    if (!storeRef.current) {
      storeRef.current = createStore(initialState);
    }
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}