import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../../../api/services/authService";

type RegisterProps = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};

const Register = ({ onClose, onSwitchToLogin }: RegisterProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^\S+@\S+\.\S+$/;

  const validateField = (name: string, value: string): string => {
    if (name === "username") {
      if (!value.trim()) return "Vui lòng nhập tên người dùng";
      if (value.trim().length < 3)
        return "Tên người dùng phải có ít nhất 3 ký tự";
    }
    if (name === "email") {
      if (!value.trim()) return "Vui lòng nhập email";
      if (!emailRegex.test(value)) return "Email không đúng định dạng";
    }
    if (name === "password") {
      if (!value) return "Vui lòng nhập mật khẩu";
      if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (name === "confirm") {
      if (!value) return "Vui lòng xác nhận mật khẩu";
      if (value !== formData.password) return "Mật khẩu xác nhận không khớp";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setGlobalError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {
      username: validateField("username", formData.username),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirm: validateField("confirm", formData.confirm),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success && response.token) {
        // Auto-login: token đã được lưu trong authService.register
        onClose();
        authService.redirectAfterLogin();
      }
    } catch (err: any) {
      const message = err?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__container">
        <div className="auth-form__header">
          <h3 className="auth-form__heading">{t("register")}</h3>
          <span
            className="auth-form__switch-btn"
            onClick={onSwitchToLogin}
            style={{ cursor: "pointer" }}
          >
            {t("login")}
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

          <div className={`auth-form__group${errors.username ? " error" : ""}`}>
            <input
              type="text"
              placeholder="Tên người dùng"
              className="auth-form__input"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="username"
            />
            {errors.username && (
              <span
                className="error-message"
                style={{ color: "#ee4d2d", fontSize: "12px" }}
              >
                {errors.username}
              </span>
            )}
          </div>

          <div className={`auth-form__group${errors.email ? " error" : ""}`}>
            <input
              type="text"
              placeholder={t("enter-email") as string}
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
              autoComplete="new-password"
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

          <div className={`auth-form__group${errors.confirm ? " error" : ""}`}>
            <input
              type="password"
              placeholder={t("enter-pass-again") as string}
              className="auth-form__input"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
            />
            {errors.confirm && (
              <span
                className="error-message"
                style={{ color: "#ee4d2d", fontSize: "12px" }}
              >
                {errors.confirm}
              </span>
            )}
          </div>
        </div>

        <div className="auth-form__aside">
          <p className="auth-form__policy-text">
            <span>{t("agree")}</span>
            <a href="" className="auth-form__text-link">
              {t("term")}
            </a>
            &
            <a href="" className="auth-form__text-link">
              {t("policy")}
            </a>
          </p>
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
            {loading ? "Đang đăng ký..." : t("register")}
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

export default Register;
