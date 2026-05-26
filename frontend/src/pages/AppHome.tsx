import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppHome() {
    const navigate = useNavigate();
    const { logout, user, isAdmin } = useAuth();

    return (
        <div className="page-shell">
            <section className="page-header card-panel">
                <div>
                    <span className="badge">Bienvenida</span>
                    <h1>Bienvenido{user ? `, ${user.nombre}` : ""}</h1>
                    <p>Accede a tus eventos, gestiona tu cuenta y navega por las funciones administrativas si tienes permisos.</p>
                </div>
                <div className="page-actions">
                    <button className="ghost-button" onClick={() => navigate("/events")}>
                        Ver eventos
                    </button>
                    <button className="secondary-button" onClick={() => navigate("/user")}>
                        Mi perfil
                    </button>
                </div>
            </section>

            <section className="grid-cards">
                <article className="module-card">
                    <h2>Explorar eventos</h2>
                    <p>Encuentra eventos recientes, revisa estados y regístrate con un solo clic.</p>
                    <button className="primary-button" onClick={() => navigate("/events")}>Ir a eventos</button>
                </article>

                <article className="module-card">
                    <h2>Mi módulo de usuario</h2>
                    <p>Revisa tus inscripciones, tu perfil y los eventos que tienes pendientes.</p>
                    <button className="primary-button" onClick={() => navigate("/user")}>Mi usuario</button>
                </article>

                <article className="module-card">
                    <h2>Administración</h2>
                    <p>{isAdmin ? "Gestiona usuarios y revisa acciones del sistema." : "Acceso restringido para administradores."}</p>
                    <button
                        className="primary-button"
                        onClick={() => navigate("/admin")}
                        disabled={!isAdmin}
                    >
                        Ir al admin
                    </button>
                </article>
            </section>

            <section className="card-panel card-panel-alt">
                <div>
                    <h3>Estado</h3>
                    <p>Tu correo es <strong>{user?.email ?? "-"}</strong> y tienes {user?.roles?.join(", ") ?? "sin roles registrados"}.</p>
                </div>
                <button className="secondary-button" onClick={() => { logout(); navigate("/login", { replace: true }); }}>
                    Cerrar sesión
                </button>
            </section>
        </div>
    );
}
