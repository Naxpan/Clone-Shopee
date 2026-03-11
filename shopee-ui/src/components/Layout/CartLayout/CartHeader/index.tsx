import CartHeaderNavbar from "./CartHeaderNavbar";
import CartHeaderSearch from "./CartHeaderSearch";
import CartHeaderLogo from "./CartHeaderLogo";

type CartHeaderProps = {
  onShowAuth: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  originFilter: string;
  setOriginFilter: React.Dispatch<React.SetStateAction<string>>;
};

const CartHeader = ({
  onShowAuth,
  searchTerm,
  setSearchTerm,
  originFilter,
  setOriginFilter,
}: CartHeaderProps) => {
  return (
    <header className="header">
      <div className="grid wide">
        <CartHeaderNavbar onShowAuth={onShowAuth} />
        <div className="header-with-search">
          <CartHeaderLogo />

          <CartHeaderSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            originFilter={originFilter}
            setOriginFilter={setOriginFilter}
          />
        </div>
      </div>
    </header>
  );
};

export default CartHeader;
