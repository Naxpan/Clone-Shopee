import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productsData from "../../../assets/data/products.json";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import ProductDescription from "./ProductDescription";
import RelatedProducts from "./RelatedProducts";

type Product = {
  id: number;
  name: string;
  price_old: number;
  sale_off_percent: number;
  rating: number;
  sold: number;
  brand: string;
  origin: string;
  image: string;
  category: string;
  description?: string;
  liked?: boolean;
  favorite?: boolean;
};

type DetailProps = {
  onAddToCart: (product: any) => void;
};

function Detail({ onAddToCart }: DetailProps) {
  // Lấy product ID từ URL params (/detail/123)
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = parseInt(String(id));

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load sản phẩm khi component mount hoặc ID thay đổi
  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = () => {
    setLoading(true);

    // Tìm sản phẩm theo ID
    const foundProduct = (productsData.products as Product[]).find(
      (p) => p.id === productId,
    );

    if (!foundProduct) {
      // Redirect về home nếu không tìm thấy
      navigate("/");
      return;
    }

    setProduct(foundProduct);

    // Load sản phẩm liên quan (cùng category, khác ID)
    const related = (productsData.products as Product[])
      .filter((p) => p.category === foundProduct.category && p.id !== productId)
      .slice(0, 10);

    setRelatedProducts(related);
    setLoading(false);

    // Cập nhật document title
    document.title = foundProduct.name;
  };

  // Tăng số lượng
  const handleIncreaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  // Giảm số lượng
  const handleDecreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (product && onAddToCart) {
      // Truyền đầy đủ thông tin sản phẩm
      onAddToCart({
        ...product,
        quantity,
      });

      // Hiển thị notification
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);

      // Reset quantity
      setQuantity(1);
    }
  };

  // Mua ngay
  const handleBuyNow = () => {
    // Thêm vào giỏ hàng trước
    handleAddToCart();

    // Redirect sang trang Cart
    navigate("/pages/Cart");
  };

  return (
    <div className="app__container">
      <div className="grid wide">
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="product-detail__breadcrumb">
              <a href="/" className="breadcrumb__link">
                Shopee
              </a>
              <i className="fa-solid fa-angle-right breadcrumb__icon"></i>
              <span className="breadcrumb__current">{product?.category}</span>
              <i className="fa-solid fa-angle-right breadcrumb__icon"></i>
              <span className="breadcrumb__current">{product?.name}</span>
            </div>

            {/* Product Container */}
            <div className="product-detail__container">
              <div className="row">
                {/* Images - Bên trái */}
                <div className="col l-5 m-12 c-12">
                  {product && (
                    <ProductImages image={product.image} name={product.name} />
                  )}
                </div>

                {/* Info - Bên phải */}
                <div className="col l-7 m-12 c-12">
                  {product && <ProductInfo product={product} />}
                  <ProductActions
                    quantity={quantity}
                    onIncrease={handleIncreaseQty}
                    onDecrease={handleDecreaseQty}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            {product && product.description && (
              <ProductDescription description={product.description} />
            )}

            {/* Related Products */}
            <RelatedProducts
              products={relatedProducts}
              onAddToCart={onAddToCart}
            />
          </>
        )}
      </div>
    </div>
  );
}
export default Detail;
