import { useState, useEffect } from "react";
import CategoryList from "./CategoryList";
import ProductCard from "./ProductCard";
import SortFilter from "./SortFilter";
import HomeBanner from "./HomeBanner";
import HomeCategoryGrid from "./HomeCategoryGrid";
import NoneProduct from "../../../components/NoneNotify/HomeNoneProduct";
import categoriesData from "../../../assets/data/categories.json";
import productsData from "../../../assets/data/products.json";

type HomeProps = {
  searchTerm: string;
  originFilter: string;
  onAddToCart: (product: { id: number; quantity: number }) => void;
};

function Home({ searchTerm, originFilter, onAddToCart }: HomeProps) {
  const [categories] = useState(categoriesData.categories);
  const [products] = useState(productsData.products);
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(
    productsData.products,
  );

  // Favorites state - load từ localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? (JSON.parse(saved) as any[]).map(Number) : [];
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Lưu favorites vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite
  const handleToggleFavorite = (productId: number) => {
    setFavorites((prev: number[]) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Filter và sort products
  useEffect(() => {
    let filtered =
      activeCategory === ""
        ? products
        : products.filter((product) => product.category === activeCategory);

    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Lọc theo xuất xứ
    const domesticOrigins = ["Việt Nam"];
    if (originFilter === "domestic") {
      filtered = filtered.filter((p) => domesticOrigins.includes(p.origin));
    } else if (originFilter === "international") {
      filtered = filtered.filter((p) => !domesticOrigins.includes(p.origin));
    }

    // Áp dụng sort
    switch (sortBy) {
      case "latest":
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
      case "popular":
        filtered = [...filtered].sort((a, b) => b.sold - a.sold);
        break;
      case "favorite":
        filtered = filtered.filter((p) => favorites.includes(p.id));
        break;
      case "price-asc":
        filtered = [...filtered].sort((a, b) => {
          const priceA = a.price_old * (1 - a.sale_off_percent / 100);
          const priceB = b.price_old * (1 - b.sale_off_percent / 100);
          return priceA - priceB;
        });
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => {
          const priceA = a.price_old * (1 - a.sale_off_percent / 100);
          const priceB = b.price_old * (1 - b.sale_off_percent / 100);
          return priceB - priceA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [activeCategory, sortBy, products, favorites, searchTerm, originFilter]);

  const handleCategoryClick = (category: string) => {
    // Nếu click vào category đang active, reset về tất cả sản phẩm
    if (category === activeCategory) {
      setActiveCategory("");
    } else {
      setActiveCategory(category);
    }
  };

  // Tính toán pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="app__container">
      {/* Full-width white banner strip */}
      <div className="home-banner-section">
        <div className="grid wide">
          <HomeBanner />
        </div>
      </div>

      <div className="grid wide">
        {/* Category Grid */}
        <HomeCategoryGrid
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />

        <div className="row sm-gutter app__content">
          <div className="home-product__heading">
            <h2 className="home-product__heading-text">GỢI Ý HÔM NAY</h2>
          </div>
          {/* Category List */}
          {/* <div className="col l-2 m-0 c-0">
            <CategoryList
              categories={categories}
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div> */}

          {/* Products List */}
          {/* <div className="col l-10 m-12 c-12"> */}
          {/* Sort Filter */}
          {/* <SortFilter sortBy={sortBy} onSortChange={setSortBy} /> */}

          {/* Products Grid */}
          <div className="col l-12 m-12 c-12">
            <div className="row sm-gutter">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToCart={onAddToCart}
                  />
                ))
              ) : (
                <NoneProduct />
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
              <ul className="pagination home-product__pagination">
                <li
                  className={`pagination-item ${
                    currentPage === 1 ? "pagination-item--disabled" : ""
                  }`}
                >
                  <button
                    className="pagination-item__link"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <i className="pagination-item__icon fas fa-angle-left"></i>
                  </button>
                </li>

                {/* Page numbers */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <li
                    key={page}
                    className={`pagination-item ${
                      currentPage === page ? "pagination-item--active" : ""
                    }`}
                  >
                    <button
                      className="pagination-item__link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`pagination-item ${
                    currentPage === totalPages
                      ? "pagination-item--disabled"
                      : ""
                  }`}
                >
                  <button
                    className="pagination-item__link"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <i className="pagination-item__icon fas fa-angle-right"></i>
                  </button>
                </li>
              </ul>
            )}
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
