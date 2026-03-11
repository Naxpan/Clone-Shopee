import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__body">
        <AdminHeader />
        <main className="admin-layout__content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
