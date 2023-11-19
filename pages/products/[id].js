import React, { useState, useEffect, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@/AppContext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

function createEmptySetting() {
  return {
    code: null,
    name: "",
  };
}

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const {
    products,
    categories,
    updateProductCategory,
    settings,
    updateProductSettings,
    updateProduct,
  } = useContext(AppContext);
  const [alerts, setAlerts] = useState([]);

  const router = useRouter();
  const { id } = router.query;

  const dropdownOptions = useMemo(() => {
    return categories.map((category) => ({
      name: category.Name,
      code: category.Id.toString(),
    }));
  }, [categories]);

  const settingDropdownOptions = useMemo(() => {
    return settings.map((setting) => ({
      name: setting.Name,
      code: setting.Id.toString(),
    }));
  }, [settings]);

  useEffect(() => {
    const foundProduct = products.find((p) => p.Id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSettings(
        foundProduct?.ProductSettings.map((ps) => ({
          name: ps.Value,
          code: ps.SettingId.toString(),
        }))
      );
      setProductName(foundProduct.Name);
      setProductDescription(foundProduct.Description);
    }
  }, [id]);

  const setSelectedCategoryHandler = (value) => {
    setSelectedCategory(value);

    updateProductCategory(Number(id), Number(value.code));
    const newAlertId = Date.now();

    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { id: newAlertId, message: `Category updated as ${value.name}` },
    ]);

    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlertId)
      );
    }, 3000);
  };

  useEffect(() => {
    if (product) {
      const validSettings = selectedSettings.filter(
        (setting) => setting.code !== null && setting.name !== ""
      );

      updateProductSettings(
        product.Id,
        validSettings.map((s) => ({ SettingId: s.code, Value: s.name }))
      );
    }
  }, [selectedSettings]);

  const addNewSetting = () => {
    setSelectedSettings((prevSettings) => [
      ...prevSettings,
      createEmptySetting(),
    ]);
  };

  const removeSetting = (indexToRemove) => {
    setSelectedSettings((prevSettings) =>
      prevSettings.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSettingChange = (index, value) => {
    setSelectedSettings((prevSettings) =>
      prevSettings.map((sett, settIndex) =>
        index === settIndex ? { name: "", code: value.code } : sett
      )
    );
  };

  const getAvailableOptions = (
    currentSettingCode,
    allOptions,
    selectedSettings
  ) => {
    const selectedCodes = selectedSettings.map((sett) => sett.code);
    return allOptions.filter(
      (option) =>
        !selectedCodes.includes(option.code) ||
        option.code === currentSettingCode
    );
  };

  const handleSettingValueChange = (index, newValue) => {
    setSelectedSettings((prevSettings) =>
      prevSettings.map((sett, settIndex) =>
        index === settIndex ? { ...sett, name: newValue } : sett
      )
    );
  };

  useEffect(() => {
    console.log(selectedSettings);
  }, [selectedSettings]);

  if (!product) {
    return (
      <div>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          position: "fixed",
          right: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {alerts.map((alert, index) => (
          <Message key={index} severity="success" text={alert.message} />
        ))}
      </div>
      <div>
        <Button
          label="Back to products"
          icon="pi pi-angle-left"
          onClick={() => router.push(`/`)}
        />
        <h1>Product Details</h1>
        <div className="details-container">
          <div className="input-group">
            <label className="input-group-label" htmlFor="productName">
              Product Name:
            </label>
            <InputText
              className="input-group-input"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <Button
              className="input-group-button"
              label="Save"
              onClick={() =>
                updateProduct(Number(id), {
                  ...product,
                  Name: productName,
                })
              }
            />
          </div>

          <div className="input-group">
            <label className="input-group-label" htmlFor="productDescription">
              Product Description:{" "}
            </label>
            <InputTextarea
              className="input-group-input"
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={5}
              cols={30}
            />
            <Button
              className="input-group-button"
              label="Save"
              onClick={() =>
                updateProduct(Number(id), {
                  ...product,
                  Description: productDescription,
                })
              }
            />
          </div>
          <div className="input-group">
            <label className="input-group-label" htmlFor="productCategory">
              Product Category:{" "}
            </label>
            <Dropdown
              className="input-group-dd"
              id="productCategory"
              value={dropdownOptions.find(
                (category) => category.code === product.CategoryId.toString()
              )}
              onChange={(e) => setSelectedCategoryHandler(e.value)}
              options={dropdownOptions}
              optionLabel="name"
              placeholder="Select a Category"
            />
          </div>
          <div className="product-settings-group">
            <label className="product-settings-group-label">
              Product Settings:
            </label>
            <div className="product-settings-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Setting</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSettings.map((sett, index) => (
                    <tr key={index}>
                      <td>
                        <Dropdown
                          className="settingDropdown"
                          value={settingDropdownOptions.find(
                            (s) => s.code === sett.code
                          )}
                          options={getAvailableOptions(
                            sett.code,
                            settingDropdownOptions,
                            selectedSettings
                          )}
                          optionLabel="name"
                          placeholder="Setting"
                          onChange={(e) => handleSettingChange(index, e.value)}
                        />
                      </td>
                      <td>
                        <InputText
                          placeholder="Value"
                          value={sett.name}
                          onChange={(e) =>
                            handleSettingValueChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Button
                          icon="pi pi-trash"
                          onClick={() => removeSetting(index)}
                        />
                      </td>
                      <td>
                        {index === selectedSettings.length - 1 && (
                          <Button
                            onClick={addNewSetting}
                            icon="pi pi-plus"
                            disabled={
                              selectedSettings.length === 0 ||
                              selectedSettings[selectedSettings.length - 1]
                                .code === null ||
                              selectedSettings[selectedSettings.length - 1]
                                .name === ""
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
