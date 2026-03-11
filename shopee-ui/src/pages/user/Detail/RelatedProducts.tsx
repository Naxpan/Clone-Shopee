import { useTranslation } from "react-i18next";
import ProductCard from "../../../pages/user/Home/ProductCard";

type Product = {
  id: number;
  name: string;
  price_old: number;
  sale_off_percent: number;
};

type RelatedProductsProps = {
  products: Product[];
  onAddToCart: (product: any) => void;
};

function RelatedProducts({ products, onAddToCart }: RelatedProductsProps) {
  const { t } = useTranslation();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-detail__related">
      <h2 className="related-title">{t("related-prdct")}</h2>

      <div className="row">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={false}
            onToggleFavorite={() => {}}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
