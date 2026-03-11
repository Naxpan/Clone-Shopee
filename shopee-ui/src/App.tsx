import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { publicRoutes, privateRoutes } from "./routes";
import { DefaultLayout, CartLayout } from "./components/Layout";
import AuthLayout from "./components/Modal/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import "leaflet/dist/leaflet.css";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormType, setAuthFormType] = useState<"login" | "register">(
    "login",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [originFilter, setOriginFilter] = useState("");

  type CartItem = {
    id: number;
    name: string;
    category: string;
    image: string;
    price_old: number;
    sale_off_percent: number;
    sold: number;
    brand: string;
    origin: string;
    rating: number;
    liked: boolean;
    favorite: boolean;
    quantity: number;
  };

  // Cart state - load từ localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Lưu cart vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleShowAuth = (type: "login" | "register") => {
    setAuthFormType(type);
    setShowAuthModal(true);
  };

  const handleAddToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Nếu chưa có, thêm mới với quantity = 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = (route.layout ||
              DefaultLayout) as React.ComponentType<any>;
            const Page = route.component as React.ComponentType<any>;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout
                    onShowAuth={handleShowAuth}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    originFilter={originFilter}
                    setOriginFilter={setOriginFilter}
                    cart={cart}
                    onRemoveFromCart={handleRemoveFromCart}
                  >
                    <Page
                      searchTerm={searchTerm}
                      originFilter={originFilter}
                      onAddToCart={handleAddToCart}
                    />
                  </Layout>
                }
              />
            );
          })}

          {/* Private Routes - Admin */}
          {privateRoutes.map((route, index) => {
            const Layout = route.layout as React.ComponentType<any> | null;
            const Page = route.component as React.ComponentType<any>;
            return (
              <Route
                key={`private-${index}`}
                path={route.path}
                element={
                  <ProtectedRoute requireAdmin={route.requireAdmin}>
                    {Layout ? (
                      <Layout>
                        <Page />
                      </Layout>
                    ) : (
                      <Page />
                    )}
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Routes>

        {/* Modal đăng ký/đăng nhập */}
        {showAuthModal && (
          <AuthLayout
            onClose={() => setShowAuthModal(false)}
            initialForm={authFormType}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
