import { useTranslation } from "react-i18next";

type Product = {
  id: number;
  name: string;
  price_old: number;
  sale_off_percent: number;
  rating: number;
  sold: number;
  brand: string;
  origin: string;
};

type ProductInfoProps = {
  product: Product;
};

function ProductInfo({ product }: ProductInfoProps) {
  const { t } = useTranslation();

  // Tính giá hiện tại
  const currentPrice = Math.floor(
    product.price_old * (1 - product.sale_off_percent / 100)
  );

  // Render rating stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
    }

    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    }

    return stars;
  };

  return (
    <div className="product-detail__info">
      {/* Tên sản phẩm */}
      <h1 className="product-detail__name">{product.name}</h1>

      {/* Rating & Sold */}
      <div className="product-detail__rating-wrapper">
        <div>
          <span className="product-detail__rating-number">
            {product.rating}
          </span>
          <span className="product-detail__rating-stars">
            {renderStars(product.rating)}
          </span>
        </div>
        <span className="product-detail__divider">|</span>
        <span className="product-detail__sold">
          {product.sold} {t("sold")}
        </span>
      </div>

      {/* Giá */}
      <div className="product-detail__price-section">
        <div className="product-detail__price-row">
          <span className="product-detail__price-old">
            ₫{product.price_old.toLocaleString("vi-VN")}
          </span>
          <span className="product-detail__price-current">
            {currentPrice.toLocaleString("vi-VN")}₫
          </span>
          <span className="product-detail__discount">
            -{product.sale_off_percent}%
          </span>
        </div>
      </div>

      {/* Thông tin khác */}
      <div className="product-detail__info-row">
        <span className="product-detail__label">{t("brand")}:</span>
        <span className="product-detail__value">{product.brand}</span>
      </div>

      <div className="product-detail__info-row">
        <span className="product-detail__label">{t("origin")}:</span>
        <span className="product-detail__value">{product.origin}</span>
      </div>
    </div>
  );
}

export default ProductInfo;
