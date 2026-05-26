import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppHome() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
            <h2>Bienvenido al sistema de eventos</h2>
            <p>Selecciona una acción para comenzar.</p>

            <div style={{ display: "grid", gap: 16, margin: "24px 0" }}>
                <button
                    onClick={() => navigate("/events")}
                    style={buttonStyle}
                >
                    Ver eventos
                </button>
                <button
                    onClick={() => navigate("/admin/users")}
                    style={buttonStyle}
                >
                    Administración de usuarios
                </button>
                <button
                    onClick={() => navigate("/admin/actions")}
                    style={buttonStyle}
                >
                    Historial de acciones
                </button>
            </div>

            <button
                onClick={() => {
                    logout();
                    navigate("/login", { replace: true });
                }}
                style={{ ...buttonStyle, background: "#ef4444" }}
            >
                Cerrar sesión
            </button>
        </div>
    );
}

const buttonStyle: React.CSSProperties = {
    padding: "14px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#7c3aed",
    color: "#fff",
    fontSize: 16,
    textAlign: "left",
};
