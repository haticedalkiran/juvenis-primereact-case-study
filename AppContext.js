import React, { createContext, useState } from "react";
import Products from "./public/data/product.json";
import Categories from "./public/data/category.json";
import Settings from "./public/data/setting.json";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(Products);

  const [settings, setSettings] = useState(Settings);

  const [categories, setCategories] = useState(Categories);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        settings,
        setSettings,
        categories,
        setCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
