import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserActions, type UserAction } from "../api/userActions";

const P = {
    bgFrom: "#0d1b2e",
    bgMid: "#0f2240",
    bgTo: "#091528",

    surface: "#162035",
    surfaceHover: "#1c2a45",

    border: "rgba(99,149,210,0.18)",
    borderMid: "rgba(99,149,210,0.3)",

    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentLight: "#93c5fd",
    accentSoft: "rgba(37,99,235,0.12)",

    text: "#f0f6ff",
    textMuted: "rgba(200,220,255,0.55)",
    textFaint: "rgba(200,220,255,0.3)",

    green: "#4ade80",
    greenSoft: "rgba(74,222,128,0.12)",

    red: "#f87171",
    redSoft: "rgba(248,113,113,0.12)",

    purple: "#a78bfa",
    purpleSoft: "rgba(167,139,250,0.12)",
};

const btnPrimary: React.CSSProperties = {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    padding: "9px 18px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
    letterSpacing: "0.01em",
};

const btnSecondary: React.CSSProperties = {
    background: "transparent",
    border: `1px solid ${P.borderMid}`,
    borderRadius: "8px",
    color: P.accentLight,
    fontSize: "13px",
    fontWeight: 500,
    padding: "9px 18px",
    cursor: "pointer",
    transition: "all 0.18s ease",
};

export function UserActionsPage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const [data, setData] = useState<{
        actions: UserAction[];
        totalPages: number;
        totalElements: number;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            setLoading(true);

            const res = await getUserActions({ page, size });

            setData({
                actions: res.content,
                totalPages: res.totalPages,
                totalElements: res.totalElements,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [page, size]);

    return (
        <div
            style={{
                minHeight: "100vh",
                margin: 0,
                padding: 0,
                border: "none",
                outline: "none",
                boxSizing: "border-box",
                background: `radial-gradient(ellipse 80% 60% at 50% -10%, #1a3a6e 0%, ${P.bgMid} 45%, ${P.bgTo} 100%)`,
                color: P.text,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}
        >
            {/* HEADER */}
            <header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 2.5rem",
                    borderBottom: `1px solid ${P.border}`,
                    background: "rgba(9,21,40,0.6)",
                    backdropFilter: "blur(16px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    flexWrap: "wrap",
                    gap: "12px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M7 1.5L12 4.5v5L7 12.5 2 9.5v-5L7 1.5z"
                                stroke="white"
                                strokeWidth="1.2"
                                fill="none"
                                strokeLinejoin="round"
                            />
                            <circle cx="7" cy="7" r="1.5" fill="white" />
                        </svg>
                    </div>

                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: P.text,
                            letterSpacing: "0.01em",
                        }}
                    >
                        Sistema de Eventos
                    </span>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                        onClick={() => navigate("/admin")}
                        style={btnSecondary}
                    >
                        ← Volver al panel
                    </button>
                </div>
            </header>

            {/* CONTENIDO */}
            <main
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "2.5rem",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1200px",
                    }}
                >
                    {/* HERO */}
                    <section
                        style={{
                            marginBottom: "2rem",
                            textAlign: "center",
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
                                color: P.purple,
                                background: "rgba(167,139,250,0.12)",
                                border: "1px solid rgba(167,139,250,0.3)",
                                borderRadius: "20px",
                                padding: "5px 14px",
                                marginBottom: "1.2rem",
                            }}
                        >
                            <span style={{ fontSize: "10px" }}>●</span>
                            Auditoría
                        </div>

                        <h1
                            style={{
                                fontSize: "clamp(2rem, 5vw, 3rem)",
                                fontWeight: 700,
                                lineHeight: 1.1,
                                margin: "0 0 1rem",
                                letterSpacing: "-0.03em",
                                color: P.text,
                            }}
                        >
                            Historial de acciones
                        </h1>

                        <p
                            style={{
                                fontSize: "1rem",
                                lineHeight: 1.7,
                                color: P.textMuted,
                                maxWidth: "650px",
                                margin: "0 auto",
                            }}
                        >
                            Consulta las actividades realizadas dentro del sistema,
                            incluyendo acciones de usuarios y movimientos administrativos.
                        </p>
                    </section>

                    {/* TABLA CARD */}
                    <section
                        style={{
                            background: P.surface,
                            border: `1px solid ${P.border}`,
                            borderRadius: "18px",
                            overflow: "hidden",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
                        }}
                    >
                        {/* TOP BAR */}
                        <div
                            style={{
                                padding: "1.2rem 1.5rem",
                                borderBottom: `1px solid ${P.border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "14px",
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        color: P.text,
                                    }}
                                >
                                    Registro de actividad
                                </h2>

                                <p
                                    style={{
                                        margin: "4px 0 0",
                                        fontSize: "13px",
                                        color: P.textMuted,
                                    }}
                                >
                                    {data?.totalElements ?? 0} acciones registradas
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: P.textFaint,
                                    }}
                                >
                                    Mostrar
                                </span>

                                <select
                                    value={size}
                                    onChange={(e) => setSize(Number(e.target.value))}
                                    style={{
                                        background: "#162035",
                                        border: `1px solid ${P.border}`,
                                        borderRadius: "8px",
                                        color: P.text,
                                        fontSize: "13px",
                                        padding: "7px 10px",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>

                        {/* LOADING */}
                        {loading && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: "260px",
                                }}
                            >
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "50%",
                                            border: `2px solid ${P.border}`,
                                            borderTopColor: P.accentLight,
                                            margin: "0 auto 12px",
                                            animation: "spin 0.8s linear infinite",
                                        }}
                                    />

                                    <style>
                                        {`
                                            @keyframes spin {
                                                to {
                                                    transform: rotate(360deg);
                                                }
                                            }
                                        `}
                                    </style>

                                    <p
                                        style={{
                                            color: P.textMuted,
                                            fontSize: "14px",
                                        }}
                                    >
                                        Cargando historial...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* EMPTY */}
                        {!loading && data && data.actions.length === 0 && (
                            <div
                                style={{
                                    padding: "4rem 2rem",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "2.5rem",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    📄
                                </div>

                                <p
                                    style={{
                                        color: P.textMuted,
                                        fontSize: "14px",
                                        margin: 0,
                                    }}
                                >
                                    No hay registros de acciones disponibles.
                                </p>
                            </div>
                        )}

                        {/* TABLE */}
                        {!loading && data && data.actions.length > 0 && (
                            <>
                                <div
                                    style={{
                                        overflowX: "auto",
                                        width: "100%",
                                    }}
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            minWidth: "700px",
                                        }}
                                    >
                                        <thead>
                                            <tr
                                                style={{
                                                    background: "rgba(255,255,255,0.03)",
                                                }}
                                            >
                                                {["Usuario", "Acción", "Fecha"].map((h) => (
                                                    <th
                                                        key={h}
                                                        style={{
                                                            padding: "16px",
                                                            textAlign: "left",
                                                            fontSize: "11px",
                                                            letterSpacing: "0.1em",
                                                            textTransform: "uppercase",
                                                            color: P.textFaint,
                                                            fontWeight: 700,
                                                            borderBottom: `1px solid ${P.border}`,
                                                        }}
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {data.actions.map((a, i) => (
                                                <tr
                                                    key={i}
                                                    style={{
                                                        transition: "all 0.18s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background =
                                                            "rgba(255,255,255,0.03)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background =
                                                            "transparent";
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "16px",
                                                            borderBottom: `1px solid ${P.border}`,
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
                                                                    width: "36px",
                                                                    height: "36px",
                                                                    borderRadius: "10px",
                                                                    background:
                                                                        "rgba(37,99,235,0.12)",
                                                                    border:
                                                                        "1px solid rgba(59,130,246,0.25)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: P.accentLight,
                                                                    fontWeight: 700,
                                                                    fontSize: "13px",
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {a.usuario?.charAt(0)?.toUpperCase() ??
                                                                    "U"}
                                                            </div>

                                                            <div>
                                                                <div
                                                                    style={{
                                                                        color: P.text,
                                                                        fontWeight: 600,
                                                                        fontSize: "14px",
                                                                    }}
                                                                >
                                                                    {a.usuario}
                                                                </div>

                                                                <div
                                                                    style={{
                                                                        color: P.textFaint,
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    Usuario del sistema
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "16px",
                                                            borderBottom: `1px solid ${P.border}`,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                                padding: "6px 12px",
                                                                borderRadius: "999px",
                                                                background:
                                                                    "rgba(167,139,250,0.12)",
                                                                border:
                                                                    "1px solid rgba(167,139,250,0.25)",
                                                                color: P.purple,
                                                                fontSize: "12px",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            ● {a.accion}
                                                        </span>
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "16px",
                                                            borderBottom: `1px solid ${P.border}`,
                                                            color: P.textMuted,
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {new Date(a.fecha).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* PAGINATION */}
                                <div
                                    style={{
                                        padding: "1rem 1.5rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: "12px",
                                        borderTop: `1px solid ${P.border}`,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "13px",
                                            color: P.textMuted,
                                        }}
                                    >
                                        Página{" "}
                                        <strong style={{ color: P.text }}>
                                            {page + 1}
                                        </strong>{" "}
                                        de{" "}
                                        <strong style={{ color: P.text }}>
                                            {data.totalPages || 1}
                                        </strong>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                        }}
                                    >
                                        <button
                                            disabled={page === 0}
                                            onClick={() => setPage((p) => p - 1)}
                                            style={{
                                                ...btnSecondary,
                                                opacity: page === 0 ? 0.4 : 1,
                                                cursor:
                                                    page === 0
                                                        ? "not-allowed"
                                                        : "pointer",
                                            }}
                                        >
                                            ← Anterior
                                        </button>

                                        <button
                                            disabled={
                                                !data ||
                                                page + 1 >= data.totalPages
                                            }
                                            onClick={() =>
                                                setPage((p) => p + 1)
                                            }
                                            style={{
                                                ...btnPrimary,
                                                opacity:
                                                    !data ||
                                                    page + 1 >= data.totalPages
                                                        ? 0.4
                                                        : 1,
                                                cursor:
                                                    !data ||
                                                    page + 1 >= data.totalPages
                                                        ? "not-allowed"
                                                        : "pointer",
                                            }}
                                        >
                                            Siguiente →
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}