
"use client";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    }
  };
};

const storage = typeof window !== 'undefined' 
  ? localStorage 
  : createNoopStorage();

export default {
  getItem: (key) => {
    try {
      const stringValue = storage.getItem(key);
      return Promise.resolve(stringValue ? JSON.parse(stringValue) : null);
    } catch (e) {
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      storage.setItem(key, JSON.stringify(value));
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  },
  removeItem: (key) => {
    try {
      storage.removeItem(key);
      return Promise.resolve();
    } catch (e) {
      return Promise.resolve();
    }
  }
};