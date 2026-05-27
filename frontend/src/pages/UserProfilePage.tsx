import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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

    purple: "#a78bfa",
    purpleSoft: "rgba(167,139,250,0.12)",
};

const roleColors: Record<string, { color: string; soft: string }> = {
    ADMIN: {
        color: P.purple,
        soft: P.purpleSoft,
    },
    USER: {
        color: P.accentLight,
        soft: P.accentSoft,
    },
    STAFF: {
        color: P.green,
        soft: P.greenSoft,
    },
};

function getInitials(nombre?: string, apellido?: string) {
    const a = (nombre?.[0] ?? "").toUpperCase();
    const b = (apellido?.[0] ?? "").toUpperCase();

    return a + b || "?";
}

export function UserProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const initials = getInitials(user?.nombre, user?.apellido);

    return (
        <div
            style={{
                minHeight: "100vh",
                margin: 0,
                padding: 0,
                border: "none",
                background: `radial-gradient(
                    ellipse 80% 60% at 50% -10%,
                    #1a3a6e 0%,
                    ${P.bgMid} 45%,
                    ${P.bgTo} 100%
                )`,
                color: P.text,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <header
                style={{
                    borderBottom: `1px solid ${P.border}`,
                    background: "rgba(9,21,40,0.6)",
                    backdropFilter: "blur(16px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 2rem",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        boxSizing: "border-box",
                        width: "100%",
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
                                <circle cx="7" cy="7" r="1.5" fill="white" />
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
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            onClick={() => navigate("/app")}
                            style={{
                                background: "transparent",
                                border: `1px solid ${P.borderMid}`,
                                borderRadius: "8px",
                                color: P.accentLight,
                                fontSize: "13px",
                                fontWeight: 500,
                                padding: "7px 18px",
                                cursor: "pointer",
                            }}
                        >
                            ← Volver
                        </button>

                        <button
                            onClick={() => logout()}
                            style={{
                                background: "rgba(248,113,113,0.08)",
                                border:
                                    "1px solid rgba(248,113,113,0.2)",
                                borderRadius: "8px",
                                color: P.red,
                                fontSize: "13px",
                                fontWeight: 500,
                                padding: "7px 18px",
                                cursor: "pointer",
                                transition: "all 0.18s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(248,113,113,0.16)";
                                e.currentTarget.style.borderColor =
                                    "rgba(248,113,113,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(248,113,113,0.08)";
                                e.currentTarget.style.borderColor =
                                    "rgba(248,113,113,0.2)";
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main
                style={{
                    padding: "2.5rem",
                    maxWidth: "680px",
                    margin: "0 auto",
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Label */}
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
                        marginBottom: "1.5rem",
                        alignSelf: "center",
                    }}
                >
                    <span style={{ fontSize: "10px" }}>●</span>
                    Mi perfil
                </div>

                {/* Avatar card */}
                <div
                    style={{
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: "20px",
                        padding: "2rem",
                        marginBottom: "16px",
                        position: "relative",
                        overflow: "hidden",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "20%",
                            right: "20%",
                            height: "1px",
                            background:
                                "linear-gradient(90deg, transparent, rgba(147,197,253,0.4), transparent)",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            gap: "1.5rem",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Avatar */}
                        <div
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.6rem",
                                fontWeight: 700,
                                color: "#fff",
                                flexShrink: 0,
                                boxShadow:
                                    "0 6px 24px rgba(37,99,235,0.4)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {initials}
                        </div>

                        <div>
                            <h1
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    margin: "0 0 4px",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {user?.nombre ?? "—"}{" "}
                                {user?.apellido ?? ""}
                            </h1>

                            <p
                                style={{
                                    fontSize: "14px",
                                    color: P.textMuted,
                                    margin: "0 0 10px",
                                }}
                            >
                                {user?.email ?? "—"}
                            </p>

                            {/* Roles */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "6px",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                {user?.roles?.length ? (
                                    user.roles.map((rol, i) => {
                                        const cleanRole =
                                            rol.replace("ROLE_", "");

                                        const rc =
                                            roleColors[
                                                cleanRole.toUpperCase()
                                            ] ?? {
                                                color: P.textMuted,
                                                soft:
                                                    "rgba(255,255,255,0.06)",
                                            };

                                        return (
                                            <span
                                                key={i}
                                                style={{
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    letterSpacing: "0.08em",
                                                    textTransform:
                                                        "uppercase",
                                                    padding: "4px 12px",
                                                    borderRadius: "20px",
                                                    background: rc.soft,
                                                    border: `1px solid ${rc.color}35`,
                                                    color: rc.color,
                                                }}
                                            >
                                                {cleanRole}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: P.textFaint,
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Sin roles asignados
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div
                    style={{
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            padding: "1rem 1.5rem",
                            borderBottom: `1px solid ${P.border}`,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: P.textFaint,
                                margin: 0,
                            }}
                        >
                            Información de cuenta
                        </h2>
                    </div>

                    {[
                        {
                            label: "Nombre completo",
                            value:
                                [user?.nombre, user?.apellido]
                                    .filter(Boolean)
                                    .join(" ") || "—",

                            icon: (
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                >
                                    <circle
                                        cx="7.5"
                                        cy="5.5"
                                        r="2.8"
                                        stroke={P.accentLight}
                                        strokeWidth="1.2"
                                    />
                                    <path
                                        d="M2 13c0-3.038 2.462-5.5 5.5-5.5S13 9.962 13 13"
                                        stroke={P.accentLight}
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ),
                        },
                        {
                            label: "Correo electrónico",
                            value: user?.email ?? "—",

                            icon: (
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                >
                                    <rect
                                        x="1.5"
                                        y="3.5"
                                        width="12"
                                        height="8"
                                        rx="1.5"
                                        stroke={P.accentLight}
                                        strokeWidth="1.2"
                                    />
                                    <path
                                        d="M1.5 5l6 4 6-4"
                                        stroke={P.accentLight}
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ),
                        },
                        {
                            label: "Roles asignados",
                            value:
                                user?.roles
                                    ?.map((r) =>
                                        r.replace("ROLE_", "")
                                    )
                                    .join(", ") || "Sin roles",

                            icon: (
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                >
                                    <path
                                        d="M7.5 1.5l2 4 4.5.65-3.25 3.17.77 4.48L7.5 11.6l-4.02 2.1.77-4.48L1 5.65l4.5-.65 2-4z"
                                        stroke={P.purple}
                                        strokeWidth="1.2"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ),
                        },
                    ].map((field, i, arr) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                padding: "1rem 1.5rem",
                                borderBottom:
                                    i < arr.length - 1
                                        ? `1px solid ${P.border}`
                                        : "none",
                            }}
                        >
                            <div
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "9px",
                                    flexShrink: 0,
                                    background: P.accentSoft,
                                    border:
                                        "1px solid rgba(99,149,210,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {field.icon}
                            </div>

                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        letterSpacing: "0.07em",
                                        textTransform: "uppercase",
                                        color: P.textFaint,
                                        marginBottom: "3px",
                                    }}
                                >
                                    {field.label}
                                </div>

                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: P.text,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {field.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Session */}
                <div
                    style={{
                        marginTop: "16px",
                        width: "100%",
                        boxSizing: "border-box",
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: "12px",
                        padding: "0.9rem 1.4rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: P.green,
                            boxShadow:
                                "0 0 8px rgba(74,222,128,0.7)",
                            flexShrink: 0,
                        }}
                    />

                    <span
                        style={{
                            fontSize: "13px",
                            color: P.textFaint,
                        }}
                    >
                        Sesión activa
                    </span>

                    <span
                        style={{
                            fontSize: "13px",
                            color: P.textMuted,
                            fontWeight: 500,
                        }}
                    >
                        {user?.email ?? "—"}
                    </span>
                </div>
            </main>
        </div>
    );
}

