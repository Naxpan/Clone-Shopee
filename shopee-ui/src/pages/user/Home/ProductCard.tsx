import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Product = {
  id: number;
  name: string;
  image?: string;
  price_old: number;
  sale_off_percent: number;
  sold?: number;
  brand?: string;
  origin?: string;
  liked?: boolean;
  // ...bổ sung các trường khác nếu có
};

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: any) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

function ProductCard({
  product,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const { t } = useTranslation();

  // Kiểm tra product có tồn tại không
  if (!product) return null;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
      // Có thể thêm toast notification ở đây
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  };

  // Format giá an toàn
  const formatPrice = (price: number) => {
    return price ? price.toLocaleString("vi-VN") : "0";
  };

  return (
    <div className="col l-2 m-4 c-6">
      <Link className="home-product-item" to={`/detail/${product.id}`}>
        <div
          className="home-product-item__img"
          style={{ backgroundImage: `url(${product.image || ""})` }}
        ></div>
        <h4 className="home-product-item__name">
          {product.name || "Sản phẩm"}
        </h4>
        <div className="home-product-item__price">
          <span className="home-product-item__price-old">
            {formatPrice(product.price_old)}đ
          </span>
          <span className="home-product-item__price-current">
            {formatPrice(
              product.price_old * (1 - product.sale_off_percent / 100),
            )}
            đ
          </span>
        </div>
        <div className="home-product-item__action">
          <span
            className={`home-product-item__like ${
              isFavorite ? "home-product-item__like--liked" : ""
            }`}
            onClick={handleLike}
          >
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
            {product.sold || 0} {t("sold")}
          </span>
        </div>
        <div className="home-product-item__origin">
          <span className="home-product-item__brand">
            {product.brand || ""}
          </span>
          <span className="home-product-item__origin-name">
            {product.origin || ""}
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
            {product.sale_off_percent || 0}%
          </span>
          <span className="home-product-item__sale-off-label">
            <br />
            {t("off")}
          </span>
        </div>
        <div onClick={handleAddToCart} className="add-to-cart adddd">
          <span>{t("add_to_cart")}</span>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
