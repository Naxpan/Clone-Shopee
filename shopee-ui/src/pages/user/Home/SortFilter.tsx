import React from "react";
import { useTranslation } from "react-i18next";

type SortFilterProps = {
  sortBy: string;
  onSortChange: (value: string) => void;
};

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, onSortChange }) => {
  const { t } = useTranslation();

  return (
    <div className="home-filter hide-on-mobile-tablet">
      <span className="home-filter__label">{t("sort")}</span>
      <button
        className={`home-filter__btn btn ${
          sortBy === "latest" ? "btn--primary" : ""
        }`}
        onClick={() => onSortChange("latest")}
      >
        {t("latest")}
      </button>
      <button
        className={`home-filter__btn btn ${
          sortBy === "popular" ? "btn--primary" : ""
        }`}
        onClick={() => onSortChange("popular")}
      >
        {t("sell-well")}
      </button>
      <button
        className={`home-filter__btn btn ${
          sortBy === "favorite" ? "btn--primary" : ""
        }`}
        onClick={() => onSortChange("favorite")}
      >
        {t("favorite")}
      </button>

      {/* Dropdown Giá */}
      <div className="select-input">
        <span className="select-input__label">{t("price")}</span>
        <i className="select-input__icon fas fa-angle-down"></i>
        <ul className="select-input__list">
          <li className="select-input__item">
            <a
              href="#"
              className="select-input__link"
              onClick={(e) => {
                e.preventDefault();
                onSortChange("price-asc");
              }}
            >
              {t("price-up")}
            </a>
          </li>
          <li className="select-input__item">
            <a
              href="#"
              className="select-input__link"
              onClick={(e) => {
                e.preventDefault();
                onSortChange("price-desc");
              }}
            >
              {t("price-down")}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SortFilter;
