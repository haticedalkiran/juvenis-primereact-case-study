import React, { createContext, useState } from "react";
import Products from "./public/data/product.json";
import Categories from "./public/data/category.json";
import Settings from "./public/data/setting.json";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(Products);

  const [settings, setSettings] = useState(Settings);

  const [categories, setCategories] = useState(Categories);

  const updateProductCategory = (productId, newCategoryId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.Id === productId
          ? { ...product, CategoryId: newCategoryId }
          : product
      )
    );
  };
  const updateProductSettings = (productId, newSettings) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.Id === productId
          ? { ...product, ProductSettings: newSettings }
          : product
      )
    );
  };

  const updateProduct = (productId, newProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.Id === productId ? newProduct : product
      )
    );
  };
  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        settings,
        setSettings,
        categories,
        setCategories,
        updateProductCategory,
        updateProductSettings,
        updateProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
