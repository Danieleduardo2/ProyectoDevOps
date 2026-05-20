import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppHome() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
            <h2>Área principal</h2>
            <p>Login exitoso. Aquí irá el contenido del sistema.</p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "20px 0" }}>
                <button
                    onClick={() => navigate("/checkin/escanear")}
                    style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        background: "#7c3aed",
                        color: "#fff",
                        textDecoration: "none",
                        display: "inline-block",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Escanear QR
                </button>
            </div>

            <button
                onClick={() => {
                    logout();
                    navigate("/login", { replace: true });
                }}
            >
                Cerrar sesión
            </button>
        </div>
    );
}
