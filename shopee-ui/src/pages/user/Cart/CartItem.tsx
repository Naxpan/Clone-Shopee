import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import productsData from "../../../assets/data/products.json";

type Product = {
  id: number;
  name: string;
  price_old: number;
  sale_off_percent: number;
  quantity?: number;
  image: string;
  category: string;
  rating?: number;
  sold?: number;
  brand?: string;
  origin?: string;
  liked?: boolean;
};

type CartItemProps = {
  product: Product;
  quantity: number;
  selected: boolean;
  onSelect: (id: number) => void;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
  showSimilar: boolean;
  onToggleSimilar: () => void;
};

function CartItem({
  product,
  quantity,
  selected,
  onSelect,
  onUpdateQuantity,
  onRemove,
  showSimilar,
  onToggleSimilar,
}: CartItemProps) {
  const { t } = useTranslation();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  // Load sản phẩm tương tự khi showSimilar = true
  useEffect(() => {
    if (showSimilar) {
      const similar = (productsData.products as Product[])
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      setSimilarProducts(similar);
      // console.log("Similar products loaded:", similar.length, similar);
    }
  }, [showSimilar, product]);

  // Tính giá sau giảm
  const discountedPrice =
    product.price_old * (1 - product.sale_off_percent / 100);

  // Tính thành tiền
  const totalPrice = discountedPrice * quantity;

  // Giảm số lượng
  const handleDecrease = () => {
    // Luôn gọi onUpdateQuantity, logic hiển thị modal sẽ xử lý trong Cart component
    onUpdateQuantity(product.id, quantity - 1);
  };

  // Tăng số lượng
  const handleIncrease = () => {
    onUpdateQuantity(product.id, quantity + 1);
  };

  // Thay đổi số lượng từ input
  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      onUpdateQuantity(product.id, value);
    }
  };

  return (
    <tr>
      {/* Checkbox */}
      <td>
        <input
          type="checkbox"
          className="cart-item-checkbox"
          checked={selected}
          onChange={() => onSelect(product.id)}
        />
      </td>

      {/* Sản phẩm */}
      <td className="cart-product-info">
        <Link to={`/detail/${product.id}`} className="cart-product-link">
          <img
            src={product.image}
            alt={product.name}
            className="cart-product-img"
          />
          <div className="cart-product-detail">
            <div className="cart-product-name">{product.name}</div>
          </div>
        </Link>
      </td>

      {/* Đơn giá */}
      <td className="cart-product-price hide-on-mobile">
        {discountedPrice.toLocaleString()}₫
      </td>

      {/* Số lượng */}
      <td className="cart-product-qty">
        <button className="cart-qty-btn" onClick={handleDecrease}>
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleChangeQuantity}
          className="cart-qty-input"
          min="1"
        />
        <button className="cart-qty-btn" onClick={handleIncrease}>
          +
        </button>
      </td>

      {/* Thành tiền */}
      <td className="cart-product-total">{totalPrice.toLocaleString()}₫</td>

      {/* Thao tác */}
      <td className="cart-product-action hide-on-mobile">
        <a
          href="#"
          className="cart-action-remove"
          onClick={(e) => {
            e.preventDefault();
            onRemove(product.id);
          }}
        >
          {t("delete")}
        </a>
        <br />
        <div
          className="cart-action-similar down"
          style={{ display: showSimilar ? "none" : "block" }}
          onClick={onToggleSimilar}
        >
          <span>{t("similar_products")}</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <div
          className="cart-action-similar up"
          style={{ display: showSimilar ? "block" : "none" }}
          onClick={onToggleSimilar}
        >
          <span>{t("similar_products")}</span>
          <i className="fa-solid fa-angle-up"></i>
        </div>
        {showSimilar && (
          <div className="cart-similar-products" style={{ display: "block" }}>
            <div className="cart-similar-list">
              {similarProducts.length === 0 ? (
                <p>{t("loading")}</p>
              ) : (
                similarProducts.map((p) => {
                  const price =
                    p.price_old * (1 - (p.sale_off_percent || 0) / 100);
                  return (
                    <div key={p.id} className="col l-3 m-4 c-6">
                      <Link
                        to={`/detail/${p.id}`}
                        className="home-product-item"
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "block",
                        }}
                      >
                        <div
                          className="home-product-item__img"
                          style={{ backgroundImage: `url(${p.image})` }}
                        ></div>
                        <h4 className="home-product-item__name">{p.name}</h4>
                        <div className="home-product-item__price">
                          <span className="home-product-item__price-old">
                            {p.price_old.toLocaleString()}đ
                          </span>
                          <span className="home-product-item__price-current">
                            {price.toLocaleString()}đ
                          </span>
                        </div>
                        <div className="home-product-item__action">
                          <span className="home-product-item__rating">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <i
                                  key={i}
                                  className={
                                    i < (p.rating || 4)
                                      ? "home-product-item__star--gold fas fa-star"
                                      : "fas fa-star"
                                  }
                                ></i>
                              ))}
                          </span>
                          <span className="home-product-item__sold">
                            {p.sold || 0} {t("sold")}
                          </span>
                        </div>
                        <div className="home-product-item__origin">
                          <span className="home-product-item__brand">
                            {p.brand}
                          </span>
                          <span className="home-product-item__origin-name">
                            {p.origin}
                          </span>
                        </div>
                        {p.liked && (
                          <div className="home-product-item__favourite">
                            <i className="fas fa-check"></i>
                            <span>{t("favorite")}</span>
                          </div>
                        )}
                        <div className="home-product-item__sale-off">
                          <span className="home-product-item__sale-off-percent">
                            {p.sale_off_percent}%
                          </span>
                          <span className="home-product-item__sale-off-label">
                            <br />
                            {t("off")}
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

export default CartItem;
