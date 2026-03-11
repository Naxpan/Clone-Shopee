import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CartItem from "./CartItem";
import CartSuggest from "./CartSuggest";
import HomeNoneProduct from "../../../components/NoneNotify/HomeNoneProduct";
import RemoveAllConfirm from "../../../components/Modal/RemoveAllConfirm";
import RemoveOneConfirm from "../../../components/Modal/RemoveOneConfirm";

type CartItemType = {
  id: number;
  name: string;
  price_old: number;
  sale_off_percent: number;
  quantity: number;
  image: string;
  category: string;
  rating?: number;
  sold?: number;
  brand?: string;
  origin?: string;
  liked?: boolean;
};

function Cart() {
  const { t } = useTranslation();
  // Load cart từ localStorage
  const [cart, setCart] = useState<CartItemType[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // State cho các sản phẩm được chọn
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);
  const [showRemoveOneModal, setShowRemoveOneModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState<CartItemType | null>(
    null,
  );
  const [openSimilarId, setOpenSimilarId] = useState<number | null>(null);

  // Lưu cart vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Chọn/bỏ chọn sản phẩm
  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // Chọn/bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((item) => item.id));
    }
  };

  // Cập nhật số lượng
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // Hiển thị modal xác nhận xóa khi số lượng về 0
      const product = cart.find((item) => item.id === id) || null;
      setProductToRemove(product);
      setShowRemoveOneModal(true);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // Yêu cầu xóa sản phẩm (hiển thị modal)
  const handleRemove = (id: number) => {
    const product = cart.find((item) => item.id === id) || null;
    setProductToRemove(product);
    setShowRemoveOneModal(true);
  };

  // Xác nhận xóa sản phẩm
  const handleConfirmRemoveOne = () => {
    if (productToRemove) {
      setCart((prev) => prev.filter((item) => item.id !== productToRemove.id));
      setSelectedIds((prev) =>
        prev.filter((itemId) => itemId !== productToRemove.id),
      );
    }
    setShowRemoveOneModal(false);
    setProductToRemove(null);
  };

  // Toggle hiển thị sản phẩm tương tự
  const handleToggleSimilar = (productId: number) => {
    setOpenSimilarId((prev) => (prev === productId ? null : productId));
  };

  // Hiển thị modal xác nhận xóa tất cả
  const handleDeleteAll = () => {
    if (cart.length === 0) return;
    setShowRemoveAllModal(true);
  };

  // Xóa tất cả sản phẩm trong giỏ hàng
  const handleConfirmDeleteAll = () => {
    setCart([]);
    setSelectedIds([]);
    setShowRemoveAllModal(false);
  };

  // Thêm sản phẩm vào giỏ (từ CartSuggest)
  const handleAddToCart = (product: Partial<CartItemType>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 } as CartItemType];
      }
    });
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Tính tổng tiền của các sản phẩm đã chọn
  const calculateTotal = () => {
    return cart
      .filter((item) => selectedIds.includes(item.id))
      .reduce((total, item) => {
        const price = item.price_old * (1 - item.sale_off_percent / 100);
        return total + price * item.quantity;
      }, 0);
  };

  const totalAmount = calculateTotal();
  const selectedCount = cart
    .filter((item) => selectedIds.includes(item.id))
    .reduce((total, item) => total + item.quantity, 0);

  // Memoize excludeIds để tránh CartSuggest re-render không cần thiết
  // Chỉ thay đổi khi danh sách ID thay đổi, không phải khi quantity thay đổi
  const excludeIds = useMemo(() => {
    return cart.map((item) => item.id);
  }, [cart.length, cart.map((item) => item.id).join(",")]);

  return (
    <div className="app__container">
      <div className="cart-container">
        {/* Giỏ hàng trống */}
        {cart.length === 0 ? (
          <HomeNoneProduct />
        ) : (
          <>
            {/* Bảng giỏ hàng */}
            <table className="cart-table">
              <thead>
                <tr>
                  <th></th>
                  <th className="cart-table-item">{t("product")}</th>
                  <th className="hide-on-mobile cart-table-item">
                    {t("unit_price")}
                  </th>
                  <th className="cart-table-item">{t("quantity")}</th>
                  <th className="cart-table-item">{t("total")}</th>
                  <th className="hide-on-mobile cart-table-item">
                    {t("operation")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    product={item}
                    quantity={item.quantity}
                    selected={selectedIds.includes(item.id)}
                    onSelect={handleSelect}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                    showSimilar={openSimilarId === item.id}
                    onToggleSimilar={() => handleToggleSimilar(item.id)}
                  />
                ))}
              </tbody>
            </table>

            {/* Footer giỏ hàng */}
            <div className="cart-footer">
              <div className="cart-footer-select-all">
                <input
                  className="cart-footer-select-all-checkbox"
                  type="checkbox"
                  checked={
                    cart.length > 0 && selectedIds.length === cart.length
                  }
                  onChange={handleSelectAll}
                />
                <span
                  className="cart-footer-select-all-text"
                  onClick={handleSelectAll}
                  style={{ cursor: "pointer" }}
                >
                  {t("choose_all")}
                </span>
                <span
                  className="cart-footer-delete hide-on-mobile"
                  onClick={handleDeleteAll}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {t("delete_all")}
                </span>
              </div>
              <div className="cart-footer-total-all">
                <span className="cart-footer-total">
                  {t("total_items")} ({selectedCount}) :
                  <span> {totalAmount.toLocaleString()}₫</span>
                </span>
                <button
                  className="cart-footer-buy"
                  disabled={selectedIds.length === 0}
                  style={{
                    opacity: selectedIds.length === 0 ? 0.6 : 1,
                    cursor:
                      selectedIds.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {t("buy_now")}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Gợi ý sản phẩm */}
        <CartSuggest excludeIds={excludeIds} onAddToCart={handleAddToCart} />
      </div>

      {/* Modal xác nhận xóa tất cả */}
      <RemoveAllConfirm
        isOpen={showRemoveAllModal}
        onConfirm={handleConfirmDeleteAll}
        onCancel={() => setShowRemoveAllModal(false)}
        productCount={cart.length}
      />

      {/* Modal xác nhận xóa 1 sản phẩm */}
      <RemoveOneConfirm
        isOpen={showRemoveOneModal}
        onConfirm={handleConfirmRemoveOne}
        onCancel={() => {
          setShowRemoveOneModal(false);
          setProductToRemove(null);
        }}
        productName={productToRemove?.name}
      />
    </div>
  );
}

export default Cart;
