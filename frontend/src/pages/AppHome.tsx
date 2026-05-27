import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const P = {
    bgFrom: "#0d1b2e",
    bgMid: "#0f2240",
    bgTo: "#091528",
    // Card surface
    surface: "#162035",
    surfaceHover: "#1c2a45",
    // Bordes
    border: "rgba(99,149,210,0.18)",
    borderMid: "rgba(99,149,210,0.3)",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentLight: "#93c5fd",
    accentSoft: "rgba(37,99,235,0.12)",
    // Texto
    text: "#f0f6ff",
    textMuted: "rgba(200,220,255,0.55)",
    textFaint: "rgba(200,220,255,0.3)",
    // Verde sesión activa
    green: "#4ade80",
};

export function AppHome() {
    const navigate = useNavigate();
    const { logout, user, isAdmin } = useAuth();

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
            {/* Header */}
            <header style={{
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
                boxSizing: "border-box",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "28px", height: "28px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.5L12 4.5v5L7 12.5 2 9.5v-5L7 1.5z" stroke="white" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
                            <circle cx="7" cy="7" r="1.5" fill="white" />
                        </svg>
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: P.text, letterSpacing: "0.01em" }}>
                        Sistema de Eventos
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <div style={{
                            width: "7px", height: "7px", borderRadius: "50%",
                            background: P.green,
                            boxShadow: `0 0 8px rgba(74,222,128,0.7)`,
                        }} />
                        <span style={{ fontSize: "13px", color: P.textMuted }}>{user?.email}</span>
                    </div>
                    <button
                        onClick={() => { logout(); navigate("/login", { replace: true }); }}
                        style={{
                            background: "transparent",
                            border: `1px solid ${P.borderMid}`,
                            borderRadius: "8px",
                            color: P.textMuted,
                            fontSize: "13px",
                            fontWeight: 500,
                            padding: "7px 18px",
                            cursor: "pointer",
                            transition: "all 0.18s ease",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = P.accentSoft;
                            e.currentTarget.style.borderColor = P.accentLight;
                            e.currentTarget.style.color = P.text;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = P.borderMid;
                            e.currentTarget.style.color = P.textMuted;
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>

            

            {/* Hero */}
            <section
    style={{
        padding: "4rem 2.5rem 2.5rem",
        maxWidth: "860px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    }}
>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: P.accentLight,
                    background: "rgba(37,99,235,0.14)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: "20px",
                    padding: "5px 14px",
                    marginBottom: "1.5rem",
                }}>
                    <span style={{ fontSize: "10px" }}>●</span>
                    Bienvenida
                </div>

                <h1 style={{
                    fontSize: "clamp(2rem, 5vw, 3.2rem)",
                    fontWeight: 700,
                    lineHeight: 1.12,
                    margin: "0 0 1rem",
                    letterSpacing: "-0.03em",
                    color: P.text,
                }}>
                    Te damos la bienvenida{user ? (
                        <span style={{
                            background: "linear-gradient(90deg, #60a5fa, #93c5fd)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>, {user.nombre}</span>
                    ) : ""} 👋
                </h1>

                <p style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: P.textMuted,
                    maxWidth: "480px",
                    margin: "0 auto 2rem",
                }}>
                    Accede a tus eventos, gestiona tu cuenta y navega por las funciones administrativas si tienes permisos.
                </p>

                <div
    style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "center",
    }}
>
                    <button
                        onClick={() => navigate("/events")}
                        style={{
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 600,
                            padding: "12px 28px",
                            cursor: "pointer",
                            boxShadow: "0 4px 18px rgba(37,99,235,0.45)",
                            transition: "all 0.18s ease",
                            letterSpacing: "0.01em",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = "0 6px 26px rgba(37,99,235,0.65)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = "0 4px 18px rgba(37,99,235,0.45)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Ver eventos →
                    </button>
                    <button
                        onClick={() => navigate("/user")}
                        style={{
                            background: "transparent",
                            border: `1px solid ${P.borderMid}`,
                            borderRadius: "10px",
                            color: P.accentLight,
                            fontSize: "14px",
                            fontWeight: 500,
                            padding: "12px 28px",
                            cursor: "pointer",
                            transition: "all 0.18s ease",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = P.accentSoft;
                            e.currentTarget.style.borderColor = "#3b82f6";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = P.borderMid;
                        }}
                    >
                        Mi perfil
                    </button>
                </div>
            </section>

            {/* Cards */}
            <section
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px",
        padding: "0 2.5rem 2.5rem",
        maxWidth: "1060px",
        margin: "0 auto",
        boxSizing: "border-box",
        width: "100%",
    }}
>
                {[
                    {
                        num: "01",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="2" y="4" width="16" height="14" rx="2" stroke="#60a5fa" strokeWidth="1.4" />
                                <path d="M2 8h16" stroke="#60a5fa" strokeWidth="1.4" />
                                <path d="M6 2v3M14 2v3" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                        ),
                        title: "Explorar eventos",
                        desc: "Encuentra eventos recientes, revisa estados y regístrate con un solo clic.",
                        label: "Ir a eventos",
                        path: "/events",
                        disabled: false,
                        color: "#60a5fa",
                    },
                    {
                        num: "02",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="7" r="3.5" stroke="#a78bfa" strokeWidth="1.4" />
                                <path d="M3.5 17c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="#a78bfa" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                        ),
                        title: "Mi módulo de usuario",
                        desc: "Revisa tus inscripciones, tu perfil y los eventos que tienes pendientes.",
                        label: "Mi usuario",
                        path: "/user",
                        disabled: false,
                        color: "#a78bfa",
                    },
                    {
                        num: "03",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="2.5" stroke="#34d399" strokeWidth="1.4" />
                                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                        ),
                        title: "Administración",
                        desc: isAdmin
                            ? "Gestiona usuarios y revisa acciones del sistema."
                            : "Acceso restringido para administradores.",
                        label: "Ir al admin",
                        path: "/admin",
                        disabled: !isAdmin,
                        color: "#34d399",
                    },
                ].map((card, i) => (
                    <article
                        key={i}
                        style={{
                            background: P.surface,
                            border: `1px solid ${P.border}`,
                            borderRadius: "16px",
                            padding: "1.6rem",
                            display: "flex",
                            flexDirection: "column",
                            opacity: card.disabled ? 0.38 : 1,
                            transition: "all 0.2s ease",
                            position: "relative",
                            overflow: "hidden",
                            boxSizing: "border-box",
                        }}
                        onMouseEnter={e => {
                            if (!card.disabled) {
                                e.currentTarget.style.background = P.surfaceHover;
                                e.currentTarget.style.borderColor = `${card.color}55`;
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = `0 10px 36px rgba(0,0,0,0.3)`;
                            }
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = P.surface;
                            e.currentTarget.style.borderColor = P.border;
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {/* top accent line */}
                        <div style={{
                            position: "absolute", top: 0, left: "15%", right: "15%",
                            height: "1px",
                            background: `linear-gradient(90deg, transparent, ${card.color}60, transparent)`,
                        }} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
                            <div style={{
                                width: "44px", height: "44px",
                                borderRadius: "12px",
                                background: `${card.color}14`,
                                border: `1px solid ${card.color}30`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                {card.icon}
                            </div>
                            <span style={{ fontSize: "11px", color: P.textFaint, fontWeight: 600, letterSpacing: "0.1em" }}>
                                {card.num}
                            </span>
                        </div>

                        <h2 style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: P.text,
                            margin: "0 0 0.5rem",
                            letterSpacing: "-0.01em",
                        }}>{card.title}</h2>

                        <p style={{
                            fontSize: "0.875rem",
                            lineHeight: 1.65,
                            color: P.textMuted,
                            margin: "0 0 1.4rem",
                            flexGrow: 1,
                        }}>{card.desc}</p>

                        <button
                            onClick={() => !card.disabled && navigate(card.path)}
                            disabled={card.disabled}
                            style={{
                                alignSelf: "flex-start",
                                background: card.disabled ? "transparent" : `${card.color}16`,
                                border: `1px solid ${card.disabled ? P.border : card.color + "45"}`,
                                borderRadius: "8px",
                                color: card.disabled ? P.textFaint : card.color,
                                fontSize: "12.5px",
                                fontWeight: 600,
                                padding: "7px 16px",
                                cursor: card.disabled ? "not-allowed" : "pointer",
                                transition: "all 0.18s ease",
                                letterSpacing: "0.01em",
                            }}
                            onMouseEnter={e => {
                                if (!card.disabled) {
                                    e.currentTarget.style.background = `${card.color}28`;
                                    e.currentTarget.style.borderColor = `${card.color}80`;
                                }
                            }}
                            onMouseLeave={e => {
                                if (!card.disabled) {
                                    e.currentTarget.style.background = `${card.color}16`;
                                    e.currentTarget.style.borderColor = `${card.color}45`;
                                }
                            }}
                        >
                            {card.label} →
                        </button>
                    </article>
                ))}
            </section>

            {/* Status footer */}
           <footer
    style={{
        margin: "0 auto 2.5rem",
        width: "calc(100% - 5rem)",
                padding: "0.9rem 1.4rem",
                background: P.surface,
                border: `1px solid ${P.border}`,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                maxWidth: "calc(1060px - 5rem)",
                boxSizing: "border-box",
            }}>
                <div style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: P.green,
                    boxShadow: `0 0 6px rgba(74,222,128,0.6)`,
                    flexShrink: 0,
                }} />
                <span style={{ fontSize: "13px", color: P.textFaint }}>Sesión activa como</span>
                <span style={{ fontSize: "13px", color: P.text, fontWeight: 500 }}>{user?.email ?? "—"}</span>
                {user?.roles && user.roles.length > 0 && (
                    <>
                        <span style={{ color: P.border, fontSize: "18px", lineHeight: 1 }}>·</span>

                        {user.roles.map((rol, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: "11px",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontWeight: 700,
                                    color: P.accentLight,
                                    background: "rgba(37,99,235,0.15)",
                                    border: "1px solid rgba(59,130,246,0.25)",
                                    borderRadius: "5px",
                                    padding: "3px 10px",
                                }}
                            >
                                {rol.replace("ROLE_", "")}
                            </span>
                        ))}
                    </>
                )}
            </footer>
        </div>
    );
}