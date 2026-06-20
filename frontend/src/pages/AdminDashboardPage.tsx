import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const P = {
    bgFrom: "#ffffff",
    bgMid: "#f8fafc",
    bgTo: "#f1f5f9",

    surface: "#ffffff",
    surfaceHover: "#f8fafc",

    border: "rgba(0,0,0,0.08)",
    borderMid: "rgba(0,0,0,0.15)",

    accent: "#e11d48",
    accentHover: "#be123c",
    accentLight: "#fb7185",
    accentSoft: "rgba(225,29,72,0.12)",

    text: "#1e293b",
    textMuted: "#64748b",
    textFaint: "#94a3b8",

    green: "#10b981",
    red: "#ef4444",
    purple: "#8b5cf6",
};

export function AdminDashboardPage() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    return (
        <div
            style={{
                minHeight: "100vh",
                margin: 0,
                padding: 0,
                border: "none",
                outline: "none",
                boxSizing: "border-box",
                background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225,29,72,0.08) 0%, rgba(139,92,246,0.05) 45%, #f8fafc 100%)`,
                color: P.text,
                fontFamily: "'Segoe UI', system-ui, sans-serif",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >

            {/* Header */}
            <header
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    borderBottom: `1px solid ${P.border}`,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(16px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1200px",
                        padding: "1rem 2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        flexWrap: "wrap",
                        boxSizing: "border-box",
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
                                width: "30px",
                                height: "30px",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: "0 6px 18px rgba(37,99,235,0.35)",
                            }}
                        >
                            <svg
                                width="15"
                                height="15"
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
                                letterSpacing: "0.01em",
                            }}
                        >
                            Sistema de Eventos
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            flexWrap: "wrap",
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
                            <div
                                style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "50%",
                                    background: P.green,
                                    boxShadow:
                                        "0 0 8px rgba(74,222,128,0.7)",
                                }}
                            />

                            <span
                                style={{
                                    fontSize: "13px",
                                    color: P.textMuted,
                                }}
                            >
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    padding: "3rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxSizing: "border-box",
                }}
            >

                {/* Hero */}
                <section
                    style={{
                        width: "100%",
                        maxWidth: "850px",
                        textAlign: "center",
                        marginBottom: "3rem",
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
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span style={{ fontSize: "10px" }}>●</span>
                        Administración
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3.3rem)",
                            fontWeight: 700,
                            lineHeight: 1.1,
                            margin: "0 0 1rem",
                            letterSpacing: "-0.03em",
                            color: P.text,
                        }}
                    >
                        Panel de administración
                    </h1>

                    <p
                        style={{
                            fontSize: "1rem",
                            lineHeight: 1.8,
                            color: P.textMuted,
                            maxWidth: "650px",
                            margin: "0 auto",
                        }}
                    >
                        Gestiona usuarios, revisa actividades y administra los
                        módulos internos del sistema desde un único panel
                        centralizado.
                    </p>
                </section>

                {/* Cards */}
                <section
                    style={{
                        width: "100%",
                        maxWidth: "1100px",
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "18px",
                        marginBottom: "2.5rem",
                    }}
                >
                    {[
                        {
                            num: "01",
                            title: "Gestión de usuarios",
                            desc: "Administra cuentas, revisa permisos y controla roles de acceso.",
                            label: "Ver usuarios",
                            path: "/admin/users",
                            color: "#60a5fa",
                            icon: (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <circle
                                        cx="7"
                                        cy="7"
                                        r="3"
                                        stroke="#60a5fa"
                                        strokeWidth="1.4"
                                    />
                                    <circle
                                        cx="14"
                                        cy="8"
                                        r="2.2"
                                        stroke="#60a5fa"
                                        strokeWidth="1.4"
                                    />
                                    <path
                                        d="M2.5 17c0-3 2.2-5 5-5s5 2 5 5"
                                        stroke="#60a5fa"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ),
                        },
                        {
                            num: "02",
                            title: "Historial de acciones",
                            desc: "Consulta auditorías, acciones recientes y eventos del sistema.",
                            label: "Ver acciones",
                            path: "/admin/actions",
                            color: "#a78bfa",
                            icon: (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M5 3.5h10v13H5z"
                                        stroke="#a78bfa"
                                        strokeWidth="1.4"
                                    />
                                    <path
                                        d="M7 7h6M7 10h6M7 13h4"
                                        stroke="#a78bfa"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ),
                        },
                    ].map((card, i) => (
                        <article
                            key={i}
                            style={{
                                background: P.surface,
                                border: `1px solid ${P.border}`,
                                borderRadius: "20px",
                                padding: "1.8rem",
                                display: "flex",
                                flexDirection: "column",
                                transition: "all 0.22s ease",
                                position: "relative",
                                overflow: "hidden",
                                boxSizing: "border-box",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    P.surfaceHover;
                                e.currentTarget.style.borderColor = `${card.color}55`;
                                e.currentTarget.style.transform =
                                    "translateY(-4px)";
                                e.currentTarget.style.boxShadow =
                                    "0 16px 40px rgba(0,0,0,0.35)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = P.surface;
                                e.currentTarget.style.borderColor = P.border;
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "15%",
                                    right: "15%",
                                    height: "1px",
                                    background: `linear-gradient(90deg, transparent, ${card.color}60, transparent)`,
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "1.3rem",
                                }}
                            >
                                <div
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "14px",
                                        background: `${card.color}14`,
                                        border: `1px solid ${card.color}30`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {card.icon}
                                </div>

                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: P.textFaint,
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    {card.num}
                                </span>
                            </div>

                            <h2
                                style={{
                                    fontSize: "1.08rem",
                                    fontWeight: 700,
                                    color: P.text,
                                    margin: "0 0 0.7rem",
                                }}
                            >
                                {card.title}
                            </h2>

                            <p
                                style={{
                                    fontSize: "0.92rem",
                                    lineHeight: 1.7,
                                    color: P.textMuted,
                                    margin: "0 0 1.5rem",
                                    flexGrow: 1,
                                }}
                            >
                                {card.desc}
                            </p>

                            <button
                                onClick={() => navigate(card.path)}
                                style={{
                                    alignSelf: "center",
                                    background: `${card.color}16`,
                                    border: `1px solid ${card.color}45`,
                                    borderRadius: "10px",
                                    color: card.color,
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    padding: "9px 18px",
                                    cursor: "pointer",
                                    transition: "all 0.18s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `${card.color}28`;
                                    e.currentTarget.style.borderColor = `${card.color}80`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = `${card.color}16`;
                                    e.currentTarget.style.borderColor = `${card.color}45`;
                                }}
                            >
                                {card.label} →
                            </button>
                        </article>
                    ))}
                </section>

                {/* Footer */}
                <footer
                    style={{
                        width: "100%",
                        maxWidth: "1100px",
                        padding: "1rem 1.5rem",
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: "14px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        boxSizing: "border-box",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: P.green,
                            boxShadow:
                                "0 0 6px rgba(74,222,128,0.6)",
                            flexShrink: 0,
                        }}
                    />

                    <span
                        style={{
                            fontSize: "13px",
                            color: P.textFaint,
                        }}
                    >
                        Sesión activa como
                    </span>

                    <span
                        style={{
                            fontSize: "13px",
                            color: P.text,
                            fontWeight: 600,
                        }}
                    >
                        {user?.email ?? "—"}
                    </span>

                    {user?.roles && user.roles.length > 0 && (
                        <>
                            <span
                                style={{
                                    color: P.border,
                                    fontSize: "18px",
                                    lineHeight: 1,
                                }}
                            >
                                ·
                            </span>

                            {user.roles.map((rol, i) => (
                                <span
                                    key={i}
                                    style={{
                                        fontSize: "11px",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        color: P.accentLight,
                                        background:
                                            "rgba(37,99,235,0.15)",
                                        border:
                                            "1px solid rgba(59,130,246,0.25)",
                                        borderRadius: "6px",
                                        padding: "4px 10px",
                                    }}
                                >
                                    {rol.replace("ROLE_", "")}
                                </span>
                            ))}
                        </>
                    )}
                </footer>
            </main>
        </div>
    );
}

const btnSecondary: React.CSSProperties = {
    background: "transparent",
    border: `1px solid ${P.borderMid}`,
    borderRadius: "10px",
    color: P.accentLight,
    fontSize: "13px",
    fontWeight: 500,
    padding: "8px 18px",
    cursor: "pointer",
    transition: "all 0.18s ease",
};

const btnDanger: React.CSSProperties = {
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: "10px",
    color: P.red,
    fontSize: "13px",
    fontWeight: 500,
    padding: "8px 18px",
    cursor: "pointer",
    transition: "all 0.18s ease",
};