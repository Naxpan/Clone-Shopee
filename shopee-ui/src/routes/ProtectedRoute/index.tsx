import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../api/services/authService";
import { UserRole } from "../../api/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getStoredUser();

  // Nếu chưa đăng nhập, redirect về trang chủ
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Nếu yêu cầu admin nhưng user không phải admin
  if (requireAdmin && user?.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
