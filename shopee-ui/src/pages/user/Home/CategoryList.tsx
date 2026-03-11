import React from "react";
import { useTranslation } from "react-i18next";

type CategoryListProps = {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
}) => {
  const { t } = useTranslation();

  return (
    <nav className="category">
      <h3 className="category__heading">
        <i className="category__heading-icon fas fa-list"></i>
        <span>{t("category")}</span>
      </h3>

      <ul className="category-list">
        {categories.map((category, index) => (
          <li
            key={index}
            className={`category-item ${
              activeCategory === category ? "category-item--active" : ""
            }`}
            onClick={() => onCategoryClick(category)}
          >
            <a
              href="#"
              className="category-item-link"
              onClick={(e) => e.preventDefault()}
            >
              {category}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryList;
