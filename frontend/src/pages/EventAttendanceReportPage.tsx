import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventoReporte, type EventoReporteResponse } from "../api/eventos";

const P = {
    bgFrom: "#ffffff",
    bgMid: "#f8fafc",
    bgTo: "#f1f5f9",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    border: "rgba(0,0,0,0.08)",
    borderMid: "rgba(0,0,0,0.15)",
    accent: "#e11d48",
    accentLight: "#fb7185",
    accentSoft: "rgba(225,29,72,0.12)",
    text: "#1e293b",
    textMuted: "#64748b",
    textFaint: "#94a3b8",
    green: "#10b981",
    greenSoft: "rgba(16,185,129,0.12)",
    red: "#ef4444",
    redSoft: "rgba(239,68,68,0.12)",
    amber: "#f59e0b",
    amberSoft: "rgba(245,158,11,0.12)",
};

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

    const bg = {
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        border: "none",
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225,29,72,0.08) 0%, rgba(139,92,246,0.05) 45%, #f8fafc 100%)`,
        color: P.text,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        boxSizing: "border-box" as const,
    };

    if (loading) {
        return (
            <div style={bg}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                border: `2px solid ${P.border}`,
                                borderTopColor: P.accentLight,
                                margin: "0 auto 16px",
                                animation: "spin 0.8s linear infinite",
                            }}
                        />

                        <style>
                            {`@keyframes spin { to { transform: rotate(360deg); } }`}
                        </style>

                        <p
                            style={{
                                color: P.textMuted,
                                fontSize: "14px",
                            }}
                        >
                            Cargando reporte...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={bg}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        padding: "2rem",
                    }}
                >
                    <div
                        style={{
                            background: P.surface,
                            border: `1px solid ${P.border}`,
                            borderRadius: "16px",
                            padding: "2rem",
                            maxWidth: "420px",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: P.redSoft,
                                border: `1px solid rgba(248,113,113,0.25)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1rem",
                            }}
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="9"
                                    stroke={P.red}
                                    strokeWidth="1.5"
                                />

                                <path
                                    d="M11 7v5M11 15v.5"
                                    stroke={P.red}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h2
                            style={{
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                margin: "0 0 0.5rem",
                                color: P.text,
                            }}
                        >
                            Error al cargar
                        </h2>

                        <p
                            style={{
                                fontSize: "14px",
                                color: P.textMuted,
                                margin: "0 0 1.5rem",
                            }}
                        >
                            {error}
                        </p>

                        <button
                            onClick={() => navigate("/app")}
                            style={btnPrimary}
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const inscritos = data?.inscritos ?? [];
    const pct = data?.porcentajeAsistencia ?? 0;

    return (
        <div style={bg}>


            {/* MAIN */}
            <main
                style={{
                    width: "100%",
                    minHeight: "calc(100vh - 80px)",
                    display: "flex",
                    justifyContent: "center",
                    padding: "2.5rem 1.5rem",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1100px",
                    }}
                >
                    {/* TITLE */}
                    <div
                        style={{
                            marginBottom: "2rem",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "11px",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                fontWeight: 600,
                                color: P.accentLight,
                                background: "rgba(37,99,235,0.14)",
                                border:
                                    "1px solid rgba(59,130,246,0.3)",
                                borderRadius: "20px",
                                padding: "5px 14px",
                                marginBottom: "1rem",
                            }}
                        >
                            <span style={{ fontSize: "10px" }}>●</span>
                            Reporte
                        </div>

                        <h1
                            style={{
                                fontSize:
                                    "clamp(1.6rem, 4vw, 2.4rem)",
                                fontWeight: 700,
                                margin: "0 0 0.4rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Reporte de asistencia
                        </h1>

                        <p
                            style={{
                                fontSize: "0.95rem",
                                color: P.textMuted,
                                margin: 0,
                                maxWidth: "650px",
                            }}
                        >
                            Resumen de inscritos y asistentes del
                            evento.
                        </p>
                    </div>

                    {/* STATS */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "16px",
                            marginBottom: "2rem",
                        }}
                    >
                        {[
                            {
                                label: "Total inscritos",
                                value: data?.totalInscritos ?? 0,
                                color: P.accentLight,
                            },
                            {
                                label: "Asistentes",
                                value: data?.totalAsistentes ?? 0,
                                color: P.green,
                            },
                            {
                                label: "Ausentes",
                                value: data?.totalAusentes ?? 0,
                                color: P.red,
                            },
                            {
                                label: "Asistencia",
                                value: `${pct}%`,
                                color: P.amber,
                            },
                        ].map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    background: P.surface,
                                    border: `1px solid ${P.border}`,
                                    borderRadius: "14px",
                                    padding: "1.4rem",
                                    textAlign: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: P.textMuted,
                                        display: "block",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {s.label}
                                </span>

                                <strong
                                    style={{
                                        fontSize: "2rem",
                                        color: s.color,
                                    }}
                                >
                                    {s.value}
                                </strong>
                            </div>
                        ))}
                    </div>

                    {/* PROGRESS */}
                    <div
                        style={{
                            background: P.surface,
                            border: `1px solid ${P.border}`,
                            borderRadius: "14px",
                            padding: "1.25rem 1.5rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                }}
                            >
                                Tasa de asistencia
                            </span>

                            <span
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: P.amber,
                                }}
                            >
                                {pct}%
                            </span>
                        </div>

                        <div
                            style={{
                                height: "8px",
                                borderRadius: "999px",
                                background:
                                    "rgba(0,0,0,0.06)",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${Math.min(pct, 100)}%`,
                                    borderRadius: "999px",
                                    background:
                                        pct >= 75
                                            ? `linear-gradient(90deg, ${P.green}, #86efac)`
                                            : pct >= 40
                                                ? `linear-gradient(90deg, ${P.amber}, #fde68a)`
                                                : `linear-gradient(90deg, ${P.red}, #fca5a5)`,
                                }}
                            />
                        </div>
                    </div>

                    {/* TABLE */}
                    <div
                        style={{
                            background: P.surface,
                            border: `1px solid ${P.border}`,
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "2rem",
                        }}
                    >
                        <div
                            style={{
                                overflowX: "auto",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    maxWidth: "1000px",
                                    borderCollapse: "collapse",
                                    minWidth: "700px",
                                    margin: "0 auto",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            background:
                                                "rgba(0,0,0,0.03)",
                                            borderBottom:
                                                `1px solid ${P.border}`,
                                        }}
                                    >
                                        {[
                                            "ID inscripción",
                                            "Asistente",
                                            "Email",
                                            "Estado",
                                            "Asistió",
                                            "Check-in",
                                        ].map((h, i) => (
                                            <th
                                                key={i}
                                                style={{
                                                    textAlign: "left",
                                                    padding: "14px 16px",
                                                    fontSize: "11px",
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                    color: P.textFaint,
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {inscritos.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                style={{
                                                    padding: "3rem",
                                                    textAlign:
                                                        "center",
                                                    color: P.textMuted,
                                                }}
                                            >
                                                No hay inscritos para
                                                este evento.
                                            </td>
                                        </tr>
                                    ) : (
                                        inscritos.map((item, idx) => (
                                            <tr
                                                key={item.inscripcionId}
                                                style={{
                                                    borderBottom:
                                                        `1px solid ${P.border}`,
                                                    background:
                                                        idx % 2 === 1
                                                            ? "rgba(0,0,0,0.015)"
                                                            : "transparent",
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        padding:
                                                            "14px 16px",
                                                        color:
                                                            P.textFaint,
                                                        fontFamily:
                                                            "monospace",
                                                    }}
                                                >
                                                    #
                                                    {
                                                        item.inscripcionId
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px 16px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {
                                                        item.nombreCompleto
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px 16px",
                                                        color:
                                                            P.textMuted,
                                                    }}
                                                >
                                                    {item.email}
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px 16px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "11px",
                                                            fontWeight: 600,
                                                            letterSpacing:
                                                                "0.06em",
                                                            textTransform:
                                                                "uppercase",
                                                            padding:
                                                                "4px 10px",
                                                            borderRadius:
                                                                "20px",
                                                            background:
                                                                P.accentSoft,
                                                            border:
                                                                `1px solid rgba(59,130,246,0.25)`,
                                                            color:
                                                                P.accentLight,
                                                            display:
                                                                "inline-flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            minWidth:
                                                                "90px",
                                                        }}
                                                    >
                                                        {
                                                            item.estadoInscripcion
                                                        }
                                                    </span>
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px 16px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "12px",
                                                            fontWeight: 600,
                                                            color:
                                                                item.asistio
                                                                    ? P.green
                                                                    : P.red,
                                                            background:
                                                                item.asistio
                                                                    ? P.greenSoft
                                                                    : P.redSoft,
                                                            border: `1px solid ${
                                                                item.asistio
                                                                    ? "rgba(74,222,128,0.25)"
                                                                    : "rgba(248,113,113,0.25)"
                                                            }`,
                                                            padding:
                                                                "4px 10px",
                                                            borderRadius:
                                                                "20px",
                                                            display:
                                                                "inline-flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            minWidth:
                                                                "75px",
                                                        }}
                                                    >
                                                        {item.asistio
                                                            ? "✓ Sí"
                                                            : "✗ No"}
                                                    </span>
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px 16px",
                                                        color:
                                                            P.textMuted,
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {item.checkinAt
                                                        ? new Date(
                                                            item.checkinAt
                                                        ).toLocaleString(
                                                            "es-CO"
                                                        )
                                                        : "—"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap",
                            width: "100%",
                        }}
                    >
                        <button
                            onClick={() => navigate("/app")}
                            style={btnSecondary}
                        >
                            Volver al inicio
                        </button>

                        <button
                            onClick={() => navigate("/my-events")}
                            style={btnPrimary}
                        >
                            ← Volver a eventos
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

const btnPrimary: React.CSSProperties = {
    background: "linear-gradient(135deg, #e11d48, #be123c)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    padding: "10px 22px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(225,29,72,0.3)",
};

const btnSecondary: React.CSSProperties = {
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: "10px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 600,
    padding: "10px 18px",
    cursor: "pointer",
};