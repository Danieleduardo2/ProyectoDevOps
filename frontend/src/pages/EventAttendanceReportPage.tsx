import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventoReporte, type EventoReporteResponse } from "../api/eventos";

const P = {
    bgFrom: "#0d1b2e",
    bgMid: "#0f2240",
    bgTo: "#091528",
    surface: "#162035",
    surfaceAlt: "#1c2a45",
    border: "rgba(99,149,210,0.18)",
    borderMid: "rgba(99,149,210,0.3)",
    accent: "#2563eb",
    accentLight: "#93c5fd",
    accentSoft: "rgba(37,99,235,0.12)",
    text: "#f0f6ff",
    textMuted: "rgba(200,220,255,0.55)",
    textFaint: "rgba(200,220,255,0.28)",
    green: "#4ade80",
    greenSoft: "rgba(74,222,128,0.12)",
    red: "#f87171",
    redSoft: "rgba(248,113,113,0.12)",
    amber: "#fbbf24",
    amberSoft: "rgba(251,191,36,0.12)",
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
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, #1a3a6e 0%, ${P.bgMid} 45%, ${P.bgTo} 100%)`,
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
            {/* HEADER */}
            <header
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    borderBottom: `1px solid ${P.border}`,
                    background: "rgba(9,21,40,0.6)",
                    backdropFilter: "blur(16px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    padding: "1rem 1.5rem",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                background:
                                    "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <path
                                    d="M7 1.5L12 4.5v5L7 12.5 2 9.5v-5L7 1.5z"
                                    stroke="white"
                                    strokeWidth="1.2"
                                    fill="none"
                                    strokeLinejoin="round"
                                />

                                <circle
                                    cx="7"
                                    cy="7"
                                    r="1.5"
                                    fill="white"
                                />
                            </svg>
                        </div>

                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: P.text,
                            }}
                        >
                            Sistema de Eventos
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            onClick={() => navigate("/events")}
                            style={btnSecondary}
                        >
                            ← Eventos
                        </button>

                        <button
                            onClick={() => navigate("/app")}
                            style={btnSecondary}
                        >
                            Inicio
                        </button>
                    </div>
                </div>
            </header>

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
                                    "rgba(255,255,255,0.06)",
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
                                                "rgba(255,255,255,0.03)",
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
                                                            ? "rgba(255,255,255,0.015)"
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
                            onClick={() => navigate("/events")}
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
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    padding: "10px 22px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
};

const btnSecondary: React.CSSProperties = {
    background: "transparent",
    border: "1px solid rgba(99,149,210,0.3)",
    borderRadius: "10px",
    color: "rgba(200,220,255,0.7)",
    fontSize: "14px",
    fontWeight: 500,
    padding: "10px 22px",
    cursor: "pointer",
};