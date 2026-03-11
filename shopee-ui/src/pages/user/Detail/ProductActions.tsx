import { useTranslation } from "react-i18next";

type ProductActionsProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

function ProductActions({
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="product-detail__actions-container">
      {/* Số lượng */}
      <div className="product-detail__quantity-row">
        <span className="product-detail__label">{t("quantity")}:</span>
        <div className="product-detail__quantity-control">
          <button
            className="quantity-btn"
            onClick={onDecrease}
            disabled={quantity <= 1}
          >
            <i className="fa-solid fa-minus"></i>
          </button>

          <input
            type="number"
            className="quantity-input"
            value={quantity}
            readOnly
          />

          <button className="quantity-btn" onClick={onIncrease}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="product-detail__actions">
        <button className="product-detail__btn-add" onClick={onAddToCart}>
          <i className="fa-solid fa-cart-plus"></i>
          {t("add_to_cart")}
        </button>

        <button className="product-detail__btn-buy" onClick={onBuyNow}>
          {t("buy_now")}
        </button>
      </div>
    </div>
  );
}

export default ProductActions;
