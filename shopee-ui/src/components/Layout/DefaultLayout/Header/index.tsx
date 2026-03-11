import { useTranslation } from "react-i18next";
import HeaderNavbar from "./HeaderNavbar";
import HeaderSearch from "./HeaderSearch";
import HeaderCart from "./HeaderCart";
import HeaderLogo from "./HeaderLogo";

type CartItem = {
  id: number;
  name: string;
  image: string;
  price_old: number;
  sale_off_percent: number;
  quantity: number;
};

type DefaultLayoutProps = {
  onShowAuth: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  originFilter: string;
  setOriginFilter: React.Dispatch<React.SetStateAction<string>>;
  cart: CartItem[];
  onRemoveFromCart: (id: number) => void;
};

const Header = ({
  onShowAuth,
  searchTerm,
  setSearchTerm,
  originFilter,
  setOriginFilter,
  cart,
  onRemoveFromCart,
}: DefaultLayoutProps) => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="grid wide">
        <HeaderNavbar onShowAuth={onShowAuth} />
        <div className="header-with-search">
          <label
            htmlFor="mobile-search-checkbox"
            className="header__mobile-search"
          >
            <i className="mobile__search-icon fas fa-search"></i>
          </label>
          <HeaderLogo />

          <input
            type="checkbox"
            hidden
            id="mobile-search-checkbox"
            className="header__search-checkbox"
          />

          <HeaderSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            originFilter={originFilter}
            setOriginFilter={setOriginFilter}
          />

          <HeaderCart cart={cart} onRemoveFromCart={onRemoveFromCart} />
        </div>
      </div>
      <ul className="header__sort-bar">
        <li className="header__sort-item header__sort-item--active">
          <a href="" className="header__sort-link">
            {t("related")}
          </a>
        </li>
        <li className="header__sort-item">
          <a href="" className="header__sort-link">
            {t("latest")}
          </a>
        </li>
        <li className="header__sort-item">
          <a href="" className="header__sort-link">
            {t("sell-well")}
          </a>
        </li>
        <li className="header__sort-item">
          <a href="" className="header__sort-link">
            {t("price")}
          </a>
        </li>
      </ul>
    </header>
  );
};

export type { CartItem };
export default Header;
