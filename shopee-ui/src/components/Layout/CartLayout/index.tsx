import CartHeader from "./CartHeader";
import Footer from "../DefaultLayout/Footer";

type CartLayoutProps = {
  children: React.ReactNode;
  onShowAuth: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  originFilter: string;
  setOriginFilter: React.Dispatch<React.SetStateAction<string>>;
};

function CartLayout({
  children,
  onShowAuth,
  searchTerm,
  setSearchTerm,
  originFilter,
  setOriginFilter,
}: CartLayoutProps) {
  return (
    <div className="app cart-layout">
      <CartHeader
        onShowAuth={onShowAuth}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        originFilter={originFilter}
        setOriginFilter={setOriginFilter}
      />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}
export default CartLayout;
