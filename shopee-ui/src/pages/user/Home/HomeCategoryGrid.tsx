import { useState } from "react";
import categoriesData from "../../../assets/data/categories.json";

// Map từng category sang URL ảnh — điền link khi có
const CATEGORY_IMAGES: Record<string, string> = {
  "Sữa rửa mặt":
    "https://down-vn.img.susercontent.com/file/ef1f336ecc6f97b790d5aae9916dcb72@resize_w640_nl.webp",
  "Sữa dưỡng thể":
    "https://down-vn.img.susercontent.com/file/4540f87aa3cbe99db739f9e8dd2cdaf0@resize_w640_nl.webp",
  "Thời trang nam":
    "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp",
  "Thời trang nữ":
    "https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w640_nl.webp",
  "Thiết bị điện tử":
    "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp",
  "Máy tính & Laptop":
    "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp",
  "Đồng hồ":
    "https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp",
  "Sức khỏe":
    "https://down-vn.img.susercontent.com/file/49119e891a44fa135f5f6f5fd4cfc747@resize_w640_nl.webp",
  "Thể thao và du lịch":
    "https://down-vn.img.susercontent.com/file/6cb7e633f8b63757463b676bd19a50e4@resize_w640_nl.webp",
  "Thiết bị đa dụng":
    "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp",
  "Ô tô & xe đạp & xe máy":
    "https://down-vn.img.susercontent.com/file/3fb459e3449905545701b418e8220334@resize_w640_nl.webp",
  "Bách hóa online":
    "https://down-vn.img.susercontent.com/file/c432168ee788f903f1ea024487f2c889@resize_w640_nl.webp",
  "Mẹ và bé":
    "https://down-vn.img.susercontent.com/file/099edde1ab31df35bc255912bab54a5e@resize_w640_nl.webp",
  "Nhà cửa & đời sống":
    "https://down-vn.img.susercontent.com/file/cd8e0d2e6c14c4904058ae20821d0763@resize_w640_nl.webp",
  "Nhà sách online":
    "https://down-vn.img.susercontent.com/file/36013311815c55d303b0e6c62d6a8139@resize_w640_nl.webp",
  "Chăm sóc thú cưng":
    "https://down-vn.img.susercontent.com/file/cdf21b1bf4bfff257efe29054ecea1ec@resize_w640_nl.webp",
};

const ITEMS_PER_PAGE = 16;

type Props = {
  activeCategory: string;
  onCategoryClick: (cat: string) => void;
};

export default function HomeCategoryGrid({
  activeCategory,
  onCategoryClick,
}: Props) {
  const categories = categoriesData.categories;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const visible = categories.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className="home-cats">
      <div className="home-cats__header">
        <span className="home-cats__title">DANH MỤC</span>
      </div>

      <div className="home-cats__grid">
        {visible.map((cat) => {
          const isActive = activeCategory === cat;
          const image = CATEGORY_IMAGES[cat] ?? "";
          return (
            <button
              key={cat}
              className={`home-cats__item${isActive ? " home-cats__item--active" : ""}`}
              onClick={() => onCategoryClick(cat)}
            >
              <div className="home-cats__circle">
                {image ? (
                  <img src={image} alt={cat} className="home-cats__img" />
                ) : (
                  <div className="home-cats__img-placeholder" />
                )}
              </div>
              <span className="home-cats__label">{cat}</span>
            </button>
          );
        })}
      </div>

      {totalPages > 1 && (
        <button
          className="home-cats__arrow"
          onClick={() => setPage((p) => (p + 1) % totalPages)}
          aria-label="Xem thêm danh mục"
        >
          <i className="fas fa-angle-right" />
        </button>
      )}
    </div>
  );
}
