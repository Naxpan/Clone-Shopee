import { useState } from "react";
import { authService } from "../../../../api/services/authService";

const AdminHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const user = authService.getStoredUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  return (
    <header className="admin-header">
      {/* Search */}
      <div className="admin-header__search">
        <i className="fa-solid fa-magnifying-glass admin-header__search-icon" />
        <input
          className="admin-header__search-input"
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Admin user */}
      <div className="admin-header__user">
        <div
          className="admin-header__user-info"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="admin-header__avatar">
            <i className="fa-solid fa-user admin-header__avatar-icon" />
          </div>
          <span className="admin-header__user-name">
            {user?.username || "Admin"}
          </span>
          <i
            className={`fa-solid fa-chevron-${menuOpen ? "up" : "down"} admin-header__user-chevron`}
          />
        </div>

        {menuOpen && (
          <ul className="admin-header__user-menu">
            <li className="admin-header__user-menu-item">
              <button onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket" />
                Đăng xuất
              </button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
