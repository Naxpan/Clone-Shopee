import RegisterSellerHeader from "./Header";

type RegisterSellerLayoutProps = {
  children: React.ReactNode;
};

const RegisterSellerLayout = ({ children }: RegisterSellerLayoutProps) => {
  return (
    <div className="register-seller-layout">
      <RegisterSellerHeader />
      <main className="register-seller-layout__content">{children}</main>
    </div>
  );
};

export default RegisterSellerLayout;
