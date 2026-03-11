import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type CartHeaderSearchProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  originFilter: string;
  setOriginFilter: React.Dispatch<React.SetStateAction<string>>;
};

const CartHeaderSearch = ({
  searchTerm,
  setSearchTerm,
  originFilter,
  setOriginFilter,
}: CartHeaderSearchProps) => {
  const { t } = useTranslation();
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getOriginLabel = () => {
    if (originFilter === "domestic") return t("national");
    if (originFilter === "international") return t("international");
    return t("all");
  };

  return (
    <div className="header__search">
      <div className="header__search-input-wrapper">
        <input
          type="text"
          id="search-input"
          className="header__search-input"
          placeholder={t("search_placeholder") as string}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="header__search-history">
          <h3 className="header__search-history-heading">{t("history")}</h3>
          {/* <!-- <ul className="header__search-history-list">
                    <li className="header__search-history-item">
                      <a href="">Áo khoác</a>
                    </li>
                    <li className="header__search-history-item">
                      <a href="">Áo thun</a>
                    </li>
                  </ul> --> */}
        </div>
      </div>
      <div className="header__search-selection">
        <span
          className="header__search-label"
          onClick={() => setShowOriginDropdown(!showOriginDropdown)}
          style={{ cursor: "pointer" }}
        >
          {getOriginLabel()}
        </span>
        <i className="header__search-icon fa-solid fa-angle-down"></i>

        <ul
          className="header__search-option"
          style={{ display: showOriginDropdown ? "block" : "none" }}
        >
          <li
            className="header__search-option-item"
            onClick={() => {
              setOriginFilter("");
              setShowOriginDropdown(false);
            }}
          >
            <span>{t("all")}</span>
            {originFilter === "" && <i className="fa-solid fa-check"></i>}
          </li>
          <li
            className="header__search-option-item"
            onClick={() => {
              setOriginFilter("domestic");
              setShowOriginDropdown(false);
            }}
          >
            <span>{t("national")}</span>
            {originFilter === "domestic" && (
              <i className="fa-solid fa-check"></i>
            )}
          </li>
          <li
            className="header__search-option-item"
            onClick={() => {
              setOriginFilter("international");
              setShowOriginDropdown(false);
            }}
          >
            <span>{t("international")}</span>
            {originFilter === "international" && (
              <i className="fa-solid fa-check"></i>
            )}
          </li>
        </ul>
      </div>
      <button
        id="search-btn"
        className="header__search-btn"
        onClick={handleSearch}
      >
        <i className="header__search-btn-icon fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
};

export default CartHeaderSearch;
