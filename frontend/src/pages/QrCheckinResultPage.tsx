import { useLocation, useNavigate } from "react-router-dom";

type ResultState = {
    tipo: "exito" | "error";
    titulo: string;
    descripcion: string;
    eventoNombre?: string;
    usuarioNombre?: string;
};

export function QrCheckinResultPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state as ResultState | null) ?? null;
    const esExito = state?.tipo === "exito";

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.icon}>{esExito ? "✓" : "⚠️"}</div>
                <h1 style={styles.title}>{state?.titulo ?? "Resultado del check-in"}</h1>
                <p style={styles.subtitle}>{state?.descripcion ?? "Sin detalles disponibles."}</p>

                {state?.eventoNombre ? (
                    <div style={styles.meta}>
                        <strong>Evento:</strong> {state.eventoNombre}
                    </div>
                ) : null}

                {state?.usuarioNombre ? (
                    <div style={styles.meta}>
                        <strong>Asistente:</strong> {state.usuarioNombre}
                    </div>
                ) : null}

                <div style={styles.actions}>
                    <button
                        onClick={() => navigate("/checkin/escanear")}
                        style={styles.primaryButton}
                    >
                        Volver al escáner
                    </button>
                    <button onClick={() => navigate("/app")} style={styles.secondaryButton}>
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#f5f7fb",
    },
    card: {
        width: "100%",
        maxWidth: 640,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 10px 35px rgba(16, 24, 40, 0.12)",
        padding: 28,
        textAlign: "center",
    },
    icon: {
        fontSize: 48,
        marginBottom: 8,
    },
    title: {
        margin: "0 0 8px",
        fontSize: 28,
    },
    subtitle: {
        marginBottom: 18,
        color: "#475467",
        fontSize: 16,
    },
    meta: {
        marginBottom: 10,
        padding: 12,
        borderRadius: 12,
        background: "#f9fafb",
        border: "1px solid #eaecf0",
        textAlign: "left",
    },
    actions: {
        display: "flex",
        gap: 12,
        marginTop: 20,
        justifyContent: "center",
        flexWrap: "wrap",
    },
    primaryButton: {
        border: "none",
        background: "#7c3aed",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 600,
    },
    secondaryButton: {
        border: "1px solid #d0d5dd",
        background: "#fff",
        color: "#344054",
        padding: "10px 16px",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 600,
    },
};
