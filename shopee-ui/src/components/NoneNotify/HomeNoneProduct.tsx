import React from "react";
import { useTranslation } from "react-i18next";

const NoneProduct = () => {
  const { t } = useTranslation();

  return (
    <div className="home-product">
      <div className="row sm-gutter" id="product-list"></div>
      <div className="undefined">
        <i className="fa-regular fa-face-frown"></i>
        <span>{t("empty-cart-main")}</span>
      </div>
    </div>
  );
};

export default NoneProduct;
