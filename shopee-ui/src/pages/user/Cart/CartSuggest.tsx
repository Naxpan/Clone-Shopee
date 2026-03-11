import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import productsData from "../../../assets/data/products.json";

type Product = {
  id: number;
  name: string;
  price_old: number;
  sale_off_percent: number;
  image: string;
  sold?: number;
  brand?: string;
  origin?: string;
  liked?: boolean;
  // ...bổ sung các trường khác nếu cần
};

type CartSuggestProps = {
  excludeIds?: number[];
  onAddToCart: (product: Product) => void;
};

function CartSuggest({ excludeIds = [], onAddToCart }: CartSuggestProps) {
  const { t } = useTranslation();

  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Lọc sản phẩm chưa có trong giỏ hàng
    const availableProducts = productsData.products.filter(
      (product) => !excludeIds.includes(product.id),
    );

    // Shuffle và lấy 10 sản phẩm ngẫu nhiên
    const shuffled = availableProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    setSuggestedProducts(shuffled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeIds.length, excludeIds.join(",")]);

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="cart-suggest">
      <h3 className="cart-suggest-heading">{t("may_like")}</h3>

      <div className="row sm-gutter">
        {suggestedProducts.map((product) => {
          const discountedPrice =
            product.price_old * (1 - product.sale_off_percent / 100);

          return (
            <div key={product.id} className="col l-2-4 m-4 c-6">
              <Link className="home-product-item" to={`/detail/${product.id}`}>
                <div
                  className="home-product-item__img"
                  style={{ backgroundImage: `url(${product.image})` }}
                ></div>

                <h4 className="home-product-item__name">{product.name}</h4>

                <div className="home-product-item__price">
                  <span className="home-product-item__price-old">
                    {product.price_old.toLocaleString()}₫
                  </span>
                  <span className="home-product-item__price-current">
                    {discountedPrice.toLocaleString()}₫
                  </span>
                </div>

                <div className="home-product-item__action">
                  <span className="home-product-item__like">
                    <i className="home-product-item__like-icon-empty far fa-heart"></i>
                    <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                  </span>
                  <div className="home-product-item__rating">
                    <i className="home-product-item__star--gold fas fa-star"></i>
                    <i className="home-product-item__star--gold fas fa-star"></i>
                    <i className="home-product-item__star--gold fas fa-star"></i>
                    <i className="home-product-item__star--gold fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <span className="home-product-item__sold">
                    {product.sold} {t("sold")}
                  </span>
                </div>

                <div className="home-product-item__origin">
                  <span className="home-product-item__brand">
                    {product.brand}
                  </span>
                  <span className="home-product-item__origin-name">
                    {product.origin}
                  </span>
                </div>

                {product.liked && (
                  <div className="home-product-item__favourite">
                    <i className="fas fa-check"></i>
                    <span>{t("favorite")}</span>
                  </div>
                )}

                <div className="home-product-item__sale-off">
                  <span className="home-product-item__sale-off-percent">
                    {product.sale_off_percent}%
                  </span>
                  <br />
                  <span className="home-product-item__sale-off-label">
                    {t("off")}
                  </span>
                </div>

                <div
                  className="add-to-cart adddd"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span>{t("add_to_cart")}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CartSuggest;
