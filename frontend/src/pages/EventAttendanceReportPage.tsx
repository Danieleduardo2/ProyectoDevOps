import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventoReporte, type EventoReporteResponse } from "../api/eventos";

export function EventAttendanceReportPage() {
    const { eventoId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<EventoReporteResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!eventoId) {
                setError("No se encontró el ID del evento.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await getEventoReporte(eventoId);
                setData(res);
            } catch (e: any) {
                setError(
                    e?.response?.data?.message ??
                    "No fue posible cargar el reporte del evento."
                );
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [eventoId]);

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>Cargando reporte...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Reporte de asistencia</h1>
                    <p style={{ color: "#b42318" }}>{error}</p>
                    <button onClick={() => navigate("/app")} style={styles.primaryButton}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    const inscritos = data?.inscritos ?? [];

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Reporte de asistencia</h1>
                <p style={styles.subtitle}>
                    Resumen de inscritos y asistentes del evento.
                </p>

                <div style={styles.statsGrid}>
                    <div style={styles.statBox}>
                        <span style={styles.statLabel}>Total de inscritos</span>
                        <strong style={styles.statValue}>
                            {data?.totalInscritos ?? 0}
                        </strong>
                    </div>

                    <div style={styles.statBox}>
                        <span style={styles.statLabel}>Total de asistentes</span>
                        <strong style={styles.statValue}>
                            {data?.totalAsistentes ?? 0}
                        </strong>
                    </div>

                    <div style={styles.statBox}>
                        <span style={styles.statLabel}>Total de ausentes</span>
                        <strong style={styles.statValue}>
                            {data?.totalAusentes ?? 0}
                        </strong>
                    </div>

                    <div style={styles.statBox}>
                        <span style={styles.statLabel}>Porcentaje de asistencia</span>
                        <strong style={styles.statValue}>
                            {data?.porcentajeAsistencia ?? 0}%
                        </strong>
                    </div>
                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID inscripción</th>
                            <th style={styles.th}>Asistente</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Estado inscripción</th>
                            <th style={styles.th}>Asistió</th>
                            <th style={styles.th}>Check-in</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inscritos.length === 0 ? (
                            <tr>
                                <td style={styles.td} colSpan={6}>
                                    No hay inscritos para este evento.
                                </td>
                            </tr>
                        ) : (
                            inscritos.map((item) => (
                                <tr key={item.inscripcionId}>
                                    <td style={styles.td}>{item.inscripcionId}</td>
                                    <td style={styles.td}>{item.nombreCompleto}</td>
                                    <td style={styles.td}>{item.email}</td>
                                    <td style={styles.td}>{item.estadoInscripcion}</td>
                                    <td style={styles.td}>
                                        {item.asistio ? "Sí" : "No"}
                                    </td>
                                    <td style={styles.td}>
                                        {item.checkinAt
                                            ? new Date(item.checkinAt).toLocaleString("es-CO")
                                            : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div style={styles.actions}>
                    <button
                        onClick={() => navigate("/checkin/escanear/1")}
                        style={styles.primaryButton}
                    >
                        Ir al escáner QR
                    </button>
                    <button onClick={() => navigate("/app")} style={styles.secondaryButton}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 20,
        display: "flex",
        justifyContent: "center",
    },
    card: {
        width: "100%",
        maxWidth: 1100,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 10px 35px rgba(16, 24, 40, 0.12)",
        padding: 24,
    },
    title: {
        margin: "0 0 8px",
        fontSize: 28,
    },
    subtitle: {
        marginBottom: 16,
        color: "#475467",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
        marginBottom: 18,
    },
    statBox: {
        border: "1px solid #eaecf0",
        borderRadius: 16,
        padding: 16,
        background: "#f9fafb",
    },
    statLabel: {
        display: "block",
        color: "#475467",
        marginBottom: 6,
    },
    statValue: {
        fontSize: 28,
    },
    tableWrapper: {
        overflowX: "auto",
        border: "1px solid #eaecf0",
        borderRadius: 16,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: 800,
    },
    th: {
        textAlign: "left",
        padding: 12,
        background: "#f2f4f7",
        borderBottom: "1px solid #eaecf0",
    },
    td: {
        padding: 12,
        borderBottom: "1px solid #eaecf0",
    },
    actions: {
        display: "flex",
        gap: 12,
        marginTop: 18,
        justifyContent: "flex-end",
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
