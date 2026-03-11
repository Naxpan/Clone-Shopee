import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { createPortal } from "react-dom";

type AuthLayoutProps = {
  onClose: () => void;
  initialForm?: "login" | "register";
};

function AuthLayout({ onClose, initialForm = "login" }: AuthLayoutProps) {
  const [showLogin, setShowLogin] = useState(initialForm === "login");

  return createPortal(
    <div className="modal" id="auth-modal">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__body">
        {showLogin ? (
          <Login
            onClose={onClose}
            onSwitchToRegister={() => setShowLogin(false)}
          />
        ) : (
          <Register
            onClose={onClose}
            onSwitchToLogin={() => setShowLogin(true)}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}
export default AuthLayout;
