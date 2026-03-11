import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const isHomeGroupActive =
    location.pathname.startsWith("/admin/categories") ||
    location.pathname.startsWith("/admin/banners") ||
    location.pathname.startsWith("/admin/vouchers");

  const [homeMenuOpen, setHomeMenuOpen] = useState(isHomeGroupActive);

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="admin-sidebar__brand">
        <i className="fa-solid fa-person-shelter admin-sidebar__brand-icon"></i>
        <span className="admin-sidebar__brand-text">Shopee Admin</span>
      </div>

      {/* Nav */}
      <nav className="admin-sidebar__nav">
        <NavLink to="/admin/dashboard" className="admin-sidebar__item">
          <i className="fa-solid fa-gauge-high admin-sidebar__item-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/users" className="admin-sidebar__item">
          <i className="fa-solid fa-users admin-sidebar__item-icon" />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin/sellers" className="admin-sidebar__item">
          <i className="fa-solid fa-user-tie admin-sidebar__item-icon" />
          <span>Sellers</span>
        </NavLink>
        <NavLink to="/admin/products" className="admin-sidebar__item">
          <i className="fa-brands fa-trello admin-sidebar__item-icon" />
          <span>Products</span>
        </NavLink>

        {/* HomePage group với submenu */}
        <div
          className={`admin-sidebar__item admin-sidebar__item--group${isHomeGroupActive ? " active" : ""}`}
          onClick={() => setHomeMenuOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-house admin-sidebar__item-icon" />
          <span>HomePage</span>
          <i
            className={`fa-solid fa-chevron-${homeMenuOpen ? "up" : "down"} admin-sidebar__item-chevron`}
          />
        </div>

        {homeMenuOpen && (
          <div className="admin-sidebar__submenu">
            <NavLink to="/admin/categories" className="admin-sidebar__subitem">
              <i className="fa-solid fa-list admin-sidebar__item-icon" />
              <span>Categories</span>
            </NavLink>
            <NavLink to="/admin/banners" className="admin-sidebar__subitem">
              <i className="fa-solid fa-image admin-sidebar__item-icon" />
              <span>Banner Images</span>
            </NavLink>
            <NavLink to="/admin/vouchers" className="admin-sidebar__subitem">
              <i className="fa-solid fa-tags admin-sidebar__item-icon" />
              <span>Voucher</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Settings ở dưới cùng */}
      <div className="admin-sidebar__footer">
        <NavLink to="/admin/settings" className="admin-sidebar__item">
          <i className="fa-solid fa-gear admin-sidebar__item-icon" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
