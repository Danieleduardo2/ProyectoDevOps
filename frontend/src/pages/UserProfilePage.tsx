import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function UserProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className="page-shell">
            <section className="page-header card-panel">
                <div>
                    <span className="badge">Mi perfil</span>
                    <h1>Perfil de usuario</h1>
                    <p>Revisa tus datos, roles y acceso dentro del sistema.</p>
                </div>
                <div className="page-actions">
                    <button className="secondary-button" onClick={() => navigate("/app")}>Volver</button>
                    <button className="ghost-button" onClick={() => logout()}>Cerrar sesión</button>
                </div>
            </section>

            <section className="card-panel card-panel-alt">
                <h2>Información de cuenta</h2>
                <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
                    <div>
                        <strong>Nombre:</strong>
                        <p>{user?.nombre ?? "-"} {user?.apellido ?? ""}</p>
                    </div>
                    <div>
                        <strong>Correo:</strong>
                        <p>{user?.email ?? "-"}</p>
                    </div>
                    <div>
                        <strong>Roles:</strong>
                        <p>{user?.roles?.join(", ") ?? "Sin roles"}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
