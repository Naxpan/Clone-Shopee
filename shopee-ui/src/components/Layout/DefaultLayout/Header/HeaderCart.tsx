import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cartImage from "../../../../assets/Images/cart.png";

type CartItem = {
  id: number;
  name: string;
  image: string;
  price_old: number;
  sale_off_percent: number;
  quantity: number;
  brand?: string;
  origin?: string;
};

type HeaderCartProps = {
  cart: CartItem[];
  onRemoveFromCart: (id: number) => void;
};

const HeaderCart = ({ cart = [], onRemoveFromCart }: HeaderCartProps) => {
  const { t } = useTranslation();

  const handleRemove = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFromCart) {
      onRemoveFromCart(productId);
    }
  };
  return (
    <div className="header__cart">
      <div className="header__cart-wrap">
        <Link to="/pages/Cart">
          <i className="fa-solid fa-cart-shopping header__cart-icon"></i>
        </Link>
        <span className="header__cart-badge">{cart.length}</span>
        <div className="header__cart-list">
          {cart.length === 0 ? (
            <div className="header__cart-list--no-items">
              <img
                src={cartImage}
                alt="empty cart"
                style={{
                  width: "220px",
                  height: "220px",
                  objectFit: "contain",
                  marginBottom: "8px",
                }}
              />
              <span className="header__cart-list-no-cart-msg">
                {t("empty-cart")}
              </span>
            </div>
          ) : (
            <>
              <h4 className="header__cart-heading">{t("added")}</h4>
              <ul className="header__cart-list-item">
                {cart.map((item) => {
                  const priceOld =
                    typeof item.price_old === "number" && !isNaN(item.price_old)
                      ? item.price_old
                      : 0;
                  const saleOff =
                    typeof item.sale_off_percent === "number" &&
                    !isNaN(item.sale_off_percent)
                      ? item.sale_off_percent
                      : 0;
                  const finalPrice = priceOld * (1 - saleOff / 100);

                  return (
                    <li key={item.id} className="header__cart-item">
                      <img
                        src={item.image || ""}
                        alt={item.name || "Sản phẩm"}
                        className="header__cart-img"
                      />
                      <Link
                        to={`/detail/${item.id}`}
                        className="header__cart-item-info"
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "block",
                        }}
                      >
                        <div className="header__cart-item-head">
                          <h5 className="header__cart-item-name">
                            {item.name || "Sản phẩm"}
                          </h5>
                          <div className="header__cart-item-price-wrap">
                            <span className="header__cart-item-price">
                              {finalPrice.toLocaleString("vi-VN")}đ
                            </span>
                            <span className="header__cart-item-multiply">
                              x
                            </span>
                            <span className="header__cart-item-quantity">
                              {item.quantity || 1}
                            </span>
                          </div>
                        </div>
                        <div className="header__cart-item-body">
                          <span className="header__cart-item-description">
                            {item.brand || ""}{" "}
                            {item.brand && item.origin ? "-" : ""}{" "}
                            {item.origin || ""}
                          </span>
                          <span
                            className="header__cart-item-delete"
                            onClick={(e) => handleRemove(e, item.id)}
                            style={{ cursor: "pointer" }}
                          >
                            {t("delete")}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="/pages/Cart"
                className="header__cart-item-view-cart btn btn--primary"
              >
                {t("see-cart")}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderCart;
