import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent, registerToEvent, type Event } from "../api/eventos";
import { getErrorMessage } from "../api/errorMessage";

const P = {
    bgMid: "#0f2240",
    bgTo: "#091528",
    surface: "#162035",
    surfaceHover: "#1c2a45",
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
    amberSoft: "rgba(251,191,36,0.1)",
    purple: "#a78bfa",
    purpleSoft: "rgba(167,139,250,0.12)",
};

const pageBg: React.CSSProperties = {
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    border: "none",
    background: `radial-gradient(ellipse 80% 60% at 50% -10%, #1a3a6e 0%, ${P.bgMid} 45%, ${P.bgTo} 100%)`,
    color: P.text,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    boxSizing: "border-box",
};

const btnPrimary: React.CSSProperties = {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    padding: "11px 24px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
    letterSpacing: "0.01em",
    transition: "all 0.18s ease",
};

const btnSecondary: React.CSSProperties = {
    background: "transparent",
    border: `1px solid ${P.borderMid}`,
    borderRadius: "10px",
    color: P.accentLight,
    fontSize: "14px",
    fontWeight: 500,
    padding: "11px 24px",
    cursor: "pointer",
    transition: "all 0.18s ease",
};

const btnGhost: React.CSSProperties = {
    background: P.purpleSoft,
    border: `1px solid rgba(167,139,250,0.25)`,
    borderRadius: "10px",
    color: P.purple,
    fontSize: "14px",
    fontWeight: 500,
    padding: "11px 24px",
    cursor: "pointer",
    transition: "all 0.18s ease",
};

function StatusBadge({ estado }: { estado: string }) {
    const map: Record<
        string,
        { color: string; soft: string; label: string }
    > = {
        PUBLISHED: {
            color: P.green,
            soft: P.greenSoft,
            label: "Publicado",
        },
        DRAFT: {
            color: P.amber,
            soft: P.amberSoft,
            label: "Borrador",
        },
        CANCELLED: {
            color: P.red,
            soft: P.redSoft,
            label: "Cancelado",
        },
        FINISHED: {
            color: P.textFaint,
            soft: "rgba(255,255,255,0.05)",
            label: "Finalizado",
        },
    };

    const s =
        map[estado] ?? {
            color: P.accentLight,
            soft: P.accentSoft,
            label: estado,
        };

    return (
        <span
            style={{
                fontSize: "11.5px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: "20px",
                background: s.soft,
                border: `1px solid ${s.color}35`,
                color: s.color,
            }}
        >
            {s.label}
        </span>
    );
}

function InfoField({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: P.surface,
                border: `1px solid ${P.border}`,
                borderRadius: "12px",
                padding: "1rem 1.2rem",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                }}
            >
                <span
                    style={{
                        color: P.textFaint,
                        display: "flex",
                    }}
                >
                    {icon}
                </span>

                <span
                    style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: P.textFaint,
                    }}
                >
                    {label}
                </span>
            </div>

            <div
                style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: P.text,
                }}
            >
                {value}
            </div>
        </div>
    );
}

export function EventDetailPage() {
    const navigate = useNavigate();
    const { eventoId } = useParams();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        async function load() {
            if (!eventoId) {
                setError("No se encontró el ID del evento.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await getEvent(eventoId);
                setEvent(res);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [eventoId]);

    async function onRegister() {
        if (!event) return;

        setError(null);
        setSuccess(null);
        setRegistering(true);

        try {
            await registerToEvent(event.id);
            setSuccess("Inscripción realizada correctamente.");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setRegistering(false);
        }
    }

    return (
        <div style={pageBg}>
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

                    <button
                        onClick={() => navigate("/events")}
                        style={btnSecondary}
                    >
                        ← Volver a eventos
                    </button>
                </div>
            </header>

            {/* MAIN */}
            <main
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "2.5rem 1.5rem",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "950px",
                    }}
                >
                    {/* LOADING */}
                    {loading && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "50vh",
                            }}
                        >
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "50%",
                                        border: `2px solid ${P.border}`,
                                        borderTopColor:
                                            P.accentLight,
                                        margin:
                                            "0 auto 12px",
                                        animation:
                                            "spin 0.8s linear infinite",
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
                                    Cargando evento...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && !event && (
                        <div
                            style={{
                                background: P.surface,
                                border:
                                    `1px solid rgba(248,113,113,0.2)`,
                                borderRadius: "14px",
                                padding: "1.5rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: P.red,
                                    margin: 0,
                                }}
                            >
                                {error}
                            </p>
                        </div>
                    )}

                    {/* EVENT */}
                    {!loading && event && (
                        <>
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
                                        letterSpacing:
                                            "0.15em",
                                        textTransform:
                                            "uppercase",
                                        fontWeight: 600,
                                        color:
                                            P.accentLight,
                                        background:
                                            "rgba(37,99,235,0.14)",
                                        border:
                                            "1px solid rgba(59,130,246,0.3)",
                                        borderRadius:
                                            "20px",
                                        padding:
                                            "5px 14px",
                                        marginBottom:
                                            "1rem",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize:
                                                "10px",
                                        }}
                                    >
                                        ●
                                    </span>

                                    Detalle del evento
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        alignItems:
                                            "center",
                                        gap: "14px",
                                    }}
                                >
                                    <h1
                                        style={{
                                            fontSize:
                                                "clamp(1.8rem, 4vw, 2.7rem)",
                                            fontWeight:
                                                700,
                                            margin: 0,
                                            letterSpacing:
                                                "-0.02em",
                                            lineHeight:
                                                1.1,
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        {event.nombre}
                                    </h1>

                                    <StatusBadge
                                        estado={
                                            event.estado
                                        }
                                    />
                                </div>

                                {event.descripcion && (
                                    <p
                                        style={{
                                            fontSize:
                                                "1rem",
                                            lineHeight:
                                                1.8,
                                            color:
                                                P.textMuted,
                                            margin:
                                                "1rem 0 0",
                                            maxWidth:
                                                "700px",
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        {
                                            event.descripcion
                                        }
                                    </p>
                                )}
                            </div>

                            {/* INFO GRID */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "14px",
                                    marginBottom:
                                        "1.8rem",
                                }}
                            >
                                <InfoField
                                    label="Fecha"
                                    value={event.fecha}
                                    icon={<span>📅</span>}
                                />

                                <InfoField
                                    label="Hora"
                                    value={event.hora}
                                    icon={<span>⏰</span>}
                                />

                                <InfoField
                                    label="Ubicación"
                                    value={
                                        event.ubicacion
                                    }
                                    icon={<span>📍</span>}
                                />

                                <InfoField
                                    label="Cupo máximo"
                                    value={
                                        event.capacidadMaxima
                                    }
                                    icon={<span>👥</span>}
                                />

                                <InfoField
                                    label="Parking"
                                    value={
                                        event.parkingAvailable
                                            ? `Sí — ${event.parkingSpots ?? 0} espacios`
                                            : "No disponible"
                                    }
                                    icon={<span>🅿️</span>}
                                />

                                <InfoField
                                    label="Creador"
                                    value={
                                        event.createdByNombre
                                            ? `${event.createdByNombre} ${event.createdByApellido}`
                                            : "No disponible"
                                    }
                                    icon={<span>👤</span>}
                                />

                                <InfoField
                                    label="Actualizado"
                                    value={
                                        event.updatedAt ??
                                        "Sin información"
                                    }
                                    icon={<span>🔄</span>}
                                />
                            </div>

                            {/* ALERTS */}
                            {error && (
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "center",
                                        marginBottom:
                                            "1rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            background:
                                                P.redSoft,
                                            border:
                                                `1px solid rgba(248,113,113,0.25)`,
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "12px 16px",
                                            textAlign:
                                                "center",
                                            width:
                                                "100%",
                                            maxWidth:
                                                "650px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize:
                                                    "13.5px",
                                                color:
                                                    P.red,
                                            }}
                                        >
                                            {error}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {success && (
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "center",
                                        marginBottom:
                                            "1rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            background:
                                                P.greenSoft,
                                            border:
                                                `1px solid rgba(74,222,128,0.25)`,
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "12px 16px",
                                            textAlign:
                                                "center",
                                            width:
                                                "100%",
                                            maxWidth:
                                                "650px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize:
                                                    "13.5px",
                                                color:
                                                    P.green,
                                            }}
                                        >
                                            {success}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    flexWrap: "wrap",
                                    justifyContent:
                                        "center",
                                    alignItems:
                                        "center",
                                    width: "100%",
                                }}
                            >
                                <button
                                    onClick={
                                        onRegister
                                    }
                                    disabled={
                                        event.estado !==
                                            "PUBLISHED" ||
                                        registering
                                    }
                                    style={{
                                        ...btnPrimary,
                                        opacity:
                                            event.estado !==
                                                "PUBLISHED" ||
                                            registering
                                                ? 0.45
                                                : 1,
                                        cursor:
                                            event.estado !==
                                                "PUBLISHED" ||
                                            registering
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    {event.estado !==
                                    "PUBLISHED"
                                        ? "Solo eventos publicados"
                                        : registering
                                            ? "Inscribiendo..."
                                            : "Inscribirme →"}
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/checkin/escanear/${event.id}`
                                        )
                                    }
                                    style={
                                        btnSecondary
                                    }
                                >
                                    Escáner QR
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/eventos/${event.id}/reporte`
                                        )
                                    }
                                    style={btnGhost}
                                >
                                    Ver reporte
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}