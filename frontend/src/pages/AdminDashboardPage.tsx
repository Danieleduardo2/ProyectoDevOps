import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AdminDashboardPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="page-shell">
            <section className="page-header card-panel">
                <div>
                    <span className="badge">Administración</span>
                    <h1>Panel de administración</h1>
                    <p>Este módulo está restringido a usuarios con rol administrador.</p>
                </div>
                <div className="page-actions">
                    <button className="secondary-button" onClick={() => navigate("/app")}>Inicio</button>
                    <button className="ghost-button" onClick={() => logout()}>Cerrar sesión</button>
                </div>
            </section>

            <section className="grid-cards">
                <article className="module-card">
                    <h2>Gestión de usuarios</h2>
                    <p>Administra cuentas, activa o desactiva usuarios y revisa roles.</p>
                    <button className="primary-button" onClick={() => navigate("/admin/users")}>Ver usuarios</button>
                </article>

                <article className="module-card">
                    <h2>Historial de acciones</h2>
                    <p>Consulta el registro de actividades y auditorías del sistema.</p>
                    <button className="primary-button" onClick={() => navigate("/admin/actions")}>Ver acciones</button>
                </article>
            </section>
        </div>
    );
}
