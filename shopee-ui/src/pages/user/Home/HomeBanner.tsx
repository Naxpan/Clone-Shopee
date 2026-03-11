import { useState, useEffect, useCallback } from "react";

// ── Paste image URLs vào đây khi có ──────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    image:
      "https://down-vn.img.susercontent.com/file/sg-11134258-8262r-mldl5jaek5q97d@resize_w1594_nl.webp",
    alt: "Banner 1",
  },
  {
    id: 2,
    image:
      "https://down-vn.img.susercontent.com/file/sg-11134258-825zv-mlemmcl2ibdb9d@resize_w1594_nl.webp",
    alt: "Banner 2",
  },
  {
    id: 3,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134258-81ztc-ml7fhkndj37me3@resize_w1594_nl.webp",
    alt: "Banner 3",
  },
  {
    id: 4,
    image:
      "https://down-vn.img.susercontent.com/file/sg-11134258-8260l-mlm3hpwtkao257@resize_w1594_nl.webp",
    alt: "Banner 4",
  },
  {
    id: 5,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134258-81ztc-mlm3au2rfym951@resize_w1594_nl.webp",
    alt: "Banner 5",
  },
];

const MINI_BANNERS = [
  {
    id: 1,
    image:
      "https://down-vn.img.susercontent.com/file/sg-11134258-8262u-mldc8ldtl8n9f9@resize_w796_nl.webp",
    alt: "Mini Banner 1",
  },
  {
    id: 2,
    image:
      "https://down-vn.img.susercontent.com/file/sg-11134258-82634-mldd4hy2xm3349@resize_w796_nl.webp",
    alt: "Mini Banner 2",
  },
];

const MINI_ICON = [
  {
    id: 1,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mesa7k74mh35b5@resize_w90_nl.webp",
    tilte: "Deal từ 1.000Đ",
  },
  {
    id: 2,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mesa9g3ee4g214@resize_w90_nl.webp",
    tilte: "Shopee xử lý",
  },
  {
    id: 3,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-mb6e1ufaxoldb9@resize_w90_nl.webp",
    tilte: "Deal Hot Giờ Vàng",
  },
  {
    id: 4,
    image:
      "https://down-vn.img.susercontent.com/file/vn-50009109-c02353c969d19918c53deaa4ea15bdbe@resize_w90_nl.webp",
    tilte: "Shopee Style Voucher 30%",
  },
  {
    id: 5,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134258-820l4-miwh9c6vkmx0bc@resize_w90_nl.webp",
    tilte: "Khách Hàng Thân Thiết",
  },
  {
    id: 6,
    image:
      "https://down-vn.img.susercontent.com/file/vn-50009109-8a387d78a7ad954ec489d3ef9abd60b4@resize_w90_nl.webp",
    tilte: "Mã Giảm Giá",
  },
];

const AUTO_PLAY_INTERVAL = 3000;

export default function HomeBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((index + SLIDES.length) % SLIDES.length);
      setTimeout(() => setAnimating(false), 400);
    },
    [animating],
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="home-banner-section">
      {/* ── Banner row ── */}
      <div className="home-banner">
        {/* ── Main slider ── */}
        <div className="home-banner__main">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`home-banner__slide${
                i === current ? " home-banner__slide--active" : ""
              }`}
            >
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="home-banner__img"
                />
              ) : (
                <div className="home-banner__placeholder">
                  <span>{slide.alt}</span>
                </div>
              )}
            </div>
          ))}

          <button
            className="home-banner__arrow home-banner__arrow--prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            &#8249;
          </button>
          <button
            className="home-banner__arrow home-banner__arrow--next"
            onClick={next}
            aria-label="Next slide"
          >
            &#8250;
          </button>

          <div className="home-banner__dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                className={`home-banner__dot${
                  i === current ? " home-banner__dot--active" : ""
                }`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Mini banners ── */}
        <div className="home-banner__mini-col">
          {MINI_BANNERS.map((m) => (
            <div key={m.id} className="home-banner__mini">
              {m.image ? (
                <img src={m.image} alt={m.alt} className="home-banner__img" />
              ) : (
                <div className="home-banner__placeholder">
                  <span>{m.alt}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mini icon shortcuts (bên dưới banner) ── */}
      <div className="home-banner__mini-icon">
        {MINI_ICON.map((m) => (
          <a key={m.id} className="home-banner__mini-icon-link">
            <img
              src={m.image}
              alt={m.tilte}
              className="home-banner__mini-icon-img"
            />
            <span className="home-banner__mini-icon-title">{m.tilte}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
