import Header from "./Header";
import Footer from "./Footer";
import type { CartItem } from "../DefaultLayout/Header/index";

type DefaultLayoutProps = {
  children: React.ReactNode;
  onShowAuth: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  originFilter: string;
  setOriginFilter: React.Dispatch<React.SetStateAction<string>>;
  cart: CartItem[];
  onRemoveFromCart: (id: number) => void;
};

function DefaultLayout({
  children,
  onShowAuth,
  searchTerm,
  setSearchTerm,
  originFilter,
  setOriginFilter,
  cart,
  onRemoveFromCart,
}: DefaultLayoutProps) {
  return (
    <div className="app default-layout">
      <Header
        onShowAuth={onShowAuth}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        originFilter={originFilter}
        setOriginFilter={setOriginFilter}
        cart={cart}
        onRemoveFromCart={onRemoveFromCart}
      />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}
export default DefaultLayout;
