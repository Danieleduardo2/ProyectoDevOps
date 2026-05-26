import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppHome } from "./pages/AppHome";
import { EventDetailPage } from "./pages/EventDetailPage";
import { EventListPage } from "./pages/EventListPage";
import { EventAttendanceReportPage } from "./pages/EventAttendanceReportPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage } from "./pages/LoginPage";
import { QrCheckinScannerPage } from "./pages/QrCheckinScannerPage";
import { QrCheckinResultPage } from "./pages/QrCheckinResultPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { useAuth } from "./auth/AuthContext";
import { UserActionsPage } from "./pages/UserActionsPage";
import { UsersAdminPage } from "./pages/UsersAdminPage";
import { RequireAdmin } from "./auth/RequireAdmin";

export default function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/app" : "/login"} replace />}
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Rutas protegidas (login) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<AppHome />} />
                <Route path="/user" element={<UserProfilePage />} />
                <Route path="/events" element={<EventListPage />} />
                <Route path="/events/:eventoId" element={<EventDetailPage />} />

                {/* Rutas del check-in / Reporte */}
                <Route path="/checkin/escanear/:eventoId" element={<QrCheckinScannerPage />} />
                <Route path="/checkin/resultado" element={<QrCheckinResultPage />} />
                <Route path="/eventos/:eventoId/reporte" element={<EventAttendanceReportPage />} />

                {/* SOLO ADMIN */}
                <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/users" element={<UsersAdminPage />} />
                    <Route path="/admin/actions" element={<UserActionsPage />} />
                </Route>
            </Route>

            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
