import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import qr from "../../../../assets/Images/QR-code.png";
import ggplay from "../../../../assets/Images/ggplay.png";
import appstore from "../../../../assets/Images/appstore.png";
import { Link } from "react-router-dom";
import { authService } from "../../../../api/services/authService";

type CartHeaderNavbarProps = {
  onShowAuth: (mode: "login" | "register") => void;
};

const CartHeaderNavbar = ({ onShowAuth }: CartHeaderNavbarProps) => {
  const { t, i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState(authService.getStoredUser());
  const isLoggedIn = authService.isAuthenticated() && !!currentUser;

  useEffect(() => {
    const handleStorage = () => {
      setCurrentUser(authService.getStoredUser());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleSellerClick = (e: MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      onShowAuth("login");
    }
  };

  return (
    <nav className="header__navbar hide-on-mobile-tablet">
      <ul className="header__navbar-list">
        <li className="header__navbar-item header__navbar-item--separate">
          <Link to="/register-seller" onClick={handleSellerClick}>
            {t("seller")}
          </Link>
        </li>
        <li className="header__navbar-item header__navbar-item--has-qr header__navbar-item--separate">
          <span>{t("go_to_the_app_store")}</span>
          <div className="header__qr">
            <img src={qr} alt="QR code" className="header__qr-image" />
            <div className="header__qr-apps">
              <a
                href="https://play.google.com/store/games?hl=vi"
                className="header__qr-link"
              >
                <img
                  src={ggplay}
                  alt="Google Play"
                  className="header__qr-download"
                />
              </a>
              <a
                href="https://www.apple.com/vn/app-store/"
                className="header__qr-link"
              >
                <img
                  src={appstore}
                  alt="App Store"
                  className="header__qr-download"
                />
              </a>
            </div>
          </div>
        </li>
        <li className="header__navbar-item">
          <span className="header__navbar-title--no-pointer">
            {t("connect")}
          </span>
          <a
            href="https://www.facebook.com/pham.man.1203/?locale=vi_VN"
            className="header__navbar-icon-link"
          >
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a
            href="https://www.instagram.com/_man.pn/"
            className="header__navbar-icon-link"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
        </li>
      </ul>

      <ul className="header__navbar-list">
        <li className="header__navbar-item header__navbar-item--has-notify">
          <a href="" className="header__navbar-item-link">
            <i className="far fa-bell"></i>
            <span>{t("notification")}</span>
          </a>
          <div className="header__notify">
            <header className="header__notify-header">
              <h3>{t("notification-new")}</h3>
            </header>
            <ul className="header__notify-list">
              <li className="header__notify-item header__notify-item--viewed">
                <a href="" className="header__notify-link">
                  <img
                    src="./assets/Images/Notify1.jpg"
                    alt=""
                    className="header__notify-img"
                  />
                  <div className="header__notify-info">
                    <span className="header__notify-name">
                      Mỹ phẩm Ohiu chính hãng
                    </span>
                    <span className="header__notify-desc">
                      Mô tả sản phẩm Ohiu chính hãng
                    </span>
                  </div>
                </a>
              </li>

              <li className="header__notify-item header__notify-item--viewed">
                <a href="" className="header__notify-link">
                  <img
                    src="./assets/Images/Notify4.jpg"
                    alt=""
                    className="header__notify-img"
                  />
                  <div className="header__notify-info">
                    <span className="header__notify-name">
                      Sale sốc bộ dưỡng Ohiu THE FIRST Tái tạo trẻ hóa da SALE
                      OFF 70%.
                    </span>
                    <span className="header__notify-desc">
                      Giảm giá cực sốc cho bộ sản phẩm Ohiu THE FIRST Tái tạo
                      trẻ hóa da.
                    </span>
                  </div>
                </a>
              </li>

              <li className="header__notify-item">
                <a href="" className="header__notify-link">
                  <img
                    src="./assets/Images/Notify3.jpg"
                    alt=""
                    className="header__notify-img"
                  />
                  <div className="header__notify-info">
                    <span className="header__notify-name">
                      Xác thực chính hãng nguồn gốc các sản phẩm Ohiu.
                    </span>
                    <span className="header__notify-desc">
                      HiddenTag là giải pháp xác thực chính hãng bằng công nghệ
                      tiên tiến nhất hiện nay.
                    </span>
                  </div>
                </a>
              </li>

              <li className="header__notify-item">
                <a href="" className="header__notify-link">
                  <img
                    src="./assets/Images/Notify2.jpg"
                    alt=""
                    className="header__notify-img"
                  />
                  <div className="header__notify-info">
                    <span className="header__notify-name">
                      Ohiu chính thức ra dòng son lỳ mới THE FIRSTGENITURE
                      LIPSTICK.
                    </span>
                    <span className="header__notify-desc">
                      Một làn môi căn mềm, quyến rủ với sắc màu nổi bậc luôn là
                      điều mà các quý cô ao ước.
                    </span>
                  </div>
                </a>
              </li>
            </ul>
            <footer className="header__notify-footer">
              <a href="" className="header__notify-footer-btn">
                <span>{t("see-all")}</span>
              </a>
            </footer>
          </div>
        </li>
        <li className="header__navbar-item">
          <a href="" className="header__navbar-item-link">
            <i className="fa-solid fa-circle-info"></i>
            <span>{t("help")}</span>
          </a>
        </li>
        <li className="header__navbar-item">
          <div className="header__navbar-item-link">
            <i className="fa-solid fa-earth-americas"></i>
            <span className="language">
              {i18n.language === "vi" ? "Tiếng Việt" : "English"}
            </span>
            <i className="fa-solid fa-angle-down arrow"> </i>
            <i className="fa-solid fa-angle-up" style={{ display: "none" }}></i>
            <div className="header__language">
              <ul className="header__language-list">
                <li
                  className={`header__language-item ${
                    i18n.language === "vi" ? "active" : ""
                  }`}
                  onClick={() => changeLanguage("vi")}
                  style={{ cursor: "pointer" }}
                >
                  Tiếng Việt
                </li>
                <li
                  className={`header__language-item ${
                    i18n.language === "en" ? "active" : ""
                  }`}
                  onClick={() => changeLanguage("en")}
                  style={{ cursor: "pointer" }}
                >
                  English
                </li>
              </ul>
            </div>
          </div>
        </li>
        {isLoggedIn ? (
          <li className="header__navbar-item header__navbar-user">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAaeVfXxyG1sNBohvr-x5NOCzM9lvcF_pTzA&s"
              alt="avatar"
              className="header__navbar-user-img"
            />
            <span className="header__navbar-user-name">
              {currentUser?.username}
            </span>
            <i className="fa-solid fa-angle-down arrow"></i>
            <ul className="header__navbar-user-menu">
              <li className="header__navbar-user-menu-item">
                <a href="#">Tài khoản của tôi</a>
              </li>
              <li className="header__navbar-user-menu-item">
                <a href="#">Địa chỉ của tôi</a>
              </li>
              <li className="header__navbar-user-menu-item">
                <a href="#">Đơn mua</a>
              </li>
              <li className="header__navbar-user-menu-item header__navbar-user-menu-item-saparate">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Đăng xuất
                </a>
              </li>
            </ul>
          </li>
        ) : (
          <>
            <li
              className="header__navbar-item header__navbar-item--strong header__navbar-item--separate"
              style={{ cursor: "pointer" }}
              onClick={() => onShowAuth("register")}
            >
              {t("register")}
            </li>
            <li
              className="header__navbar-item header__navbar-item--strong"
              style={{ cursor: "pointer" }}
              onClick={() => onShowAuth("login")}
            >
              {t("login")}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default CartHeaderNavbar;
