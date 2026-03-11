import Home from "../pages/user/Home";
import Detail from "../pages/user/Detail";
import Cart from "../pages/user/Cart";
import AdminDashboard from "../pages/admin/adminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminSellers from "../pages/admin/AdminSellers";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminBanners from "../pages/admin/AdminBanners";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminVouchers from "../pages/admin/AdminVouchers";

import AdminSettings from "../pages/admin/AdminSettings";
import RegisterSeller from "../pages/seller/RegisterSeller";
import {
  DefaultLayout,
  CartLayout,
  RegisterSellerLayout,
  AdminLayout,
} from "../components/Layout";

const publicRoutes = [
  { path: "/", component: Home, layout: DefaultLayout },
  { path: "/detail/:id", component: Detail, layout: DefaultLayout },
  { path: "/pages/Cart", component: Cart, layout: CartLayout },
  {
    path: "/register-seller",
    component: RegisterSeller,
    layout: RegisterSellerLayout,
  },
];

// Admin routes - không dùng JSX ở đây, sẽ wrap trong App.tsx
const privateRoutes = [
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    layout: AdminLayout,
    requireAdmin: true,
  },
  {
    path: "/admin/users",
    component: AdminUsers,
    layout: AdminLayout,
    requireAdmin: true,
  },
  {
    path: "/admin/sellers",
    component: AdminSellers,
    layout: AdminLayout,
    requireAdmin: true,
  },
  {
    path: "/admin/categories",
    component: AdminCategories,
    layout: AdminLayout,
    requireAdmin: true,
  },
  {
    path: "/admin/products",
    component: AdminProducts,
    layout: AdminLayout,
    requireAdmin: true,
  },
  {
    path: "/admin/banners",
    component: AdminBanners,
    layout: AdminLayout,
    requireAdmin: true,
  },
  {
    path: "/admin/settings",
    component: AdminSettings,
    layout: AdminLayout,
    requireAdmin: true,
  },
  {
    path: "/admin/vouchers",
    component: AdminVouchers,
    layout: AdminLayout,
    requireAdmin: true,
  },
];

export { publicRoutes, privateRoutes };
