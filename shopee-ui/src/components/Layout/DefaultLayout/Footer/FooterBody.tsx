import React from "react";
import { useTranslation } from "react-i18next";
import qr from "../../../../assets/Images/QR-code.png";
import ggplay from "../../../../assets/Images/ggplay.png";
import appstore from "../../../../assets/Images/appstore.png";
import categoriesData from "../../../../assets/data/categories.json";

const FooterBody = () => {
  const { t } = useTranslation();
  const categories = categoriesData.categories.slice(0, 6);

  return (
    <div className="grid wide footer__content">
      <div className="row">
        <div className="col l-2-4 m-4 c-6">
          <h3 className="footer__heading">
            {t("customer_service")}
          </h3>
          <ul className="footer__list">
            <li className="footer__list-item">
              <a href="" className="footer__list-item-link">
                {t("help")}
              </a>
            </li>
            <li className="footer__list-item">
              <a href="" className="footer__list-item-link">
                {t("mail")}
              </a>
            </li>
            <li className="footer__list-item">
              <a href="" className="footer__list-item-link">
                {t("guide")}
              </a>
            </li>
          </ul>
        </div>
        <div className="col l-2-4 m-4 c-6">
          <h3 className="footer__heading">
            {t("about_me")}
          </h3>
          <ul className="footer__list">
            <li className="footer__list-item">
              <a
                href=""
                className="footer__list-item-link"
              >
                {t("about_Man")}
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href=""
                className="footer__list-item-link"
              >
                {t("recruitment")}
              </a>
            </li>
            <li className="footer__list-item">
              <a href="" className="footer__list-item-link">
                {t("clause")}
              </a>
            </li>
          </ul>
        </div>
        <div className="col l-2-4 m-4 c-6">
          <h3 className="footer__heading">
            {t("category")}
          </h3>
          <ul className="footer__list">
            {categories.map((category, index) => (
              <li key={index} className="footer__list-item">
                <a href="" className="footer__list-item-link">
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col l-2-4 m-4 c-6">
          <h3 className="footer__heading">
            {t("follow_me")}
          </h3>
          <ul className="footer__list">
            <li className="footer__list-item">
              <a
                href="https://www.facebook.com/pham.man.1203/?locale=vi_VN"
                className="footer__list-item-link footer__list-item-link-fb"
              >
                <i className="footer__list-item-icon fab fa-facebook"></i>
                Facebook
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="https://www.instagram.com/_man.pn/"
                className="footer__list-item-link footer__list-item-link-ig"
              >
                <i className="footer__list-item-icon fab fa-instagram"></i>
                Instagram
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="https://github.com/Naxpan"
                className="footer__list-item-link footer__list-item-link-gh"
              >
                <i className="footer__list-item-icon fab fa-github"></i>
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <div className="col l-2-4 m-8 c-12">
          <h3 className="footer__heading">
            {t("go_to_the_app_store")}
          </h3>
          <div className="footer__download">
            <img src={qr} alt="Download QR" className="footer__download-qr" />
            <div className="footer__download-apps">
              <a
                href="https://www.apple.com/vn/app-store/"
                className="footer__download-app-link"
              >
                <img
                  src={appstore}
                  alt="App Store"
                  className="footer__download-app-img"
                />
              </a>
              <a
                href="https://play.google.com/store/games?hl=vi"
                className="footer__download-app-link"
              >
                <img
                  src={ggplay}
                  alt="Google Play"
                  className="footer__download-app-img"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBody;
