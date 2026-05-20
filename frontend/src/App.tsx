import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppHome } from "./pages/AppHome";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { useAuth } from "./auth/AuthContext";
import { UsersAdminPage } from "./pages/UsersAdminPage";
import { UserActionsPage } from "./pages/UserActionsPage";
import { RequireAdmin } from "./auth/RequireAdmin";
import { QrCheckinScannerPage } from "./pages/QrCheckinScannerPage";
import { QrCheckinResultPage } from "./pages/QrCheckinResultPage";
import { EventAttendanceReportPage } from "./pages/EventAttendanceReportPage";

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

                {/* Rutas del check-in / Reporte */}
                <Route path="/checkin/escanear/:eventoId" element={<QrCheckinScannerPage />} />
                <Route path="/checkin/resultado" element={<QrCheckinResultPage />} />
                <Route path="/eventos/:eventoId/reporte" element={<EventAttendanceReportPage />} />

                {/* SOLO ADMIN */}
                <Route element={<RequireAdmin />}>
                    <Route path="/admin/users" element={<UsersAdminPage />} />
                    <Route path="/admin/actions" element={<UserActionsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
