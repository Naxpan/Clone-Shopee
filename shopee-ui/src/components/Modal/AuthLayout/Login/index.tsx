import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../../../api/services/authService";

type LoginProps = {
  onClose: () => void;
  onSwitchToRegister: () => void;
};

const Login = ({ onClose, onSwitchToRegister }: LoginProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^\S+@\S+\.\S+$/;

  const validateField = (name: string, value: string): string => {
    if (name === "email") {
      if (!value.trim()) return "Vui lòng nhập email";
      if (!emailRegex.test(value)) return "Email không đúng định dạng";
    }
    if (name === "password") {
      if (!value) return "Vui lòng nhập mật khẩu";
      if (value.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    }
    return "";
  };

  const validate = (): boolean => {
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGlobalError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log("Login success:", response);

      onClose();
      authService.redirectAfterLogin();
    } catch (err: any) {
      setGlobalError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__container">
        <div className="auth-form__header">
          <h3 className="auth-form__heading">{t("login")}</h3>
          <span
            className="auth-form__switch-btn"
            onClick={onSwitchToRegister}
            style={{ cursor: "pointer" }}
          >
            {t("register")}
          </span>
        </div>

        <div className="auth-form__form">
          {globalError && (
            <div
              style={{
                color: "#ee4d2d",
                marginBottom: "10px",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              {globalError}
            </div>
          )}

          <div className={`auth-form__group${errors.email ? " error" : ""}`}>
            <input
              type="text"
              placeholder="Email"
              className="auth-form__input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {errors.email && (
              <span
                className="error-message"
                style={{ color: "#ee4d2d", fontSize: "12px" }}
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className={`auth-form__group${errors.password ? " error" : ""}`}>
            <input
              type="password"
              placeholder={t("enter-pass") as string}
              className="auth-form__input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
            />
            {errors.password && (
              <span
                className="error-message"
                style={{ color: "#ee4d2d", fontSize: "12px" }}
              >
                {errors.password}
              </span>
            )}
          </div>

          {/* Quick admin login helper (chỉ dùng trong dev) */}
          {process.env.NODE_ENV === "development" && (
            <div
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "10px",
                textAlign: "center",
              }}
            ></div>
          )}
        </div>

        <div className="auth-form__aside">
          <div className="auth-form__help">
            <a href="" className="auth-form__help-link auth-form__help-forgot">
              {t("forget-pass")}
            </a>
            <span className="auth-form__help-separate"></span>
            <a href="" className="auth-form__help-link auth-form__help-support">
              {t("help_ques")}
            </a>
          </div>
        </div>

        <div className="auth-form__controls">
          <button
            type="button"
            className="btn btn--normal auth-form__controls-back"
            onClick={onClose}
          >
            {t("back")}
          </button>
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : t("login")}
          </button>
        </div>
      </div>

      <div className="auth-form__socials">
        <a
          href=""
          className="btn auth-form__socials-fb btn--size-S btn--with-icon"
        >
          <i className="auth-form__socials-icon fa-brands fa-square-facebook"></i>
          <span className="auth-form__socials-text">{t("fb")}</span>
        </a>

        <a
          href=""
          className="btn auth-form__socials-gg btn--size-S btn--with-icon"
        >
          <i className="auth-form__socials-icon fa-brands fa-google"></i>
          <span className="auth-form__socials-text">{t("gg")}</span>
        </a>
      </div>
    </form>
  );
};

export default Login;
