import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
        <div>
            <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #e11d48, #be123c)',
                borderRadius: '24px',
                padding: '40px 30px',
                color: '#fff',
                marginBottom: '70px',
                boxShadow: '0 10px 30px rgba(225, 29, 72, 0.2)'
            }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '2.2rem', fontWeight: 800 }}>Mi Perfil</h2>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '1.05rem', fontWeight: 500 }}>Gestiona tu información personal y revisa tus roles en la plataforma.</p>
                
                <div style={{
                    position: 'absolute',
                    bottom: '-45px',
                    left: '40px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '20px'
                }}>
                    <div style={{
                        width: "100px", height: "100px", borderRadius: "50%",
                        background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2.8rem", fontWeight: 800, color: "#e11d48",
                        border: "5px solid #f8fafc",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}>
                        {initials}
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '35px', paddingLeft: '10px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '2.2rem', fontWeight: 800 }}>
                            {user?.nombre ?? "—"} {user?.apellido ?? ""}
                        </h1>
                        <p style={{ margin: '0', color: '#64748b', fontSize: '1.15rem', fontWeight: 500 }}>
                            {user?.email ?? "—"}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: '5px' }}>
                        {user?.roles?.length ? (
                            user.roles.map((rol, i) => {
                                const cleanRole = rol.replace("ROLE_", "");
                                return (
                                    <span key={i} style={{
                                        fontSize: "0.85rem", fontWeight: 700, padding: "6px 14px", borderRadius: "20px",
                                        background: "rgba(225,29,72,0.1)", color: "#e11d48", border: "1px solid rgba(225,29,72,0.2)", letterSpacing: '0.5px'
                                    }}>
                                        {cleanRole}
                                    </span>
                                );
                            })
                        ) : (
                            <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontStyle: "italic" }}>Sin roles asignados</span>
                        )}
                    </div>
                </div>

                <div className="dash-card" style={{ padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', fontWeight: 700 }}>Información de cuenta</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(225,29,72,0.08)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                            <i className="pi pi-id-card"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontWeight: 600 }}>Nombre completo</div>
                            <div style={{ fontWeight: 600, color: '#334155', fontSize: '1.15rem' }}>{[user?.nombre, user?.apellido].filter(Boolean).join(" ") || "—"}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(225,29,72,0.08)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                            <i className="pi pi-envelope"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontWeight: 600 }}>Correo electrónico</div>
                            <div style={{ fontWeight: 600, color: '#334155', fontSize: '1.15rem' }}>{user?.email ?? "—"}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 0 5px' }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(225,29,72,0.08)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                            <i className="pi pi-shield"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontWeight: 600 }}>Permisos del sistema</div>
                            <div style={{ fontWeight: 600, color: '#334155', fontSize: '1.15rem' }}>{user?.roles?.map(r => r.replace("ROLE_", "")).join(", ") || "Usuario estándar"}</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '25px', padding: '20px 30px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px rgba(34, 197, 94, 0.6)' }}></div>
                    <span style={{ color: '#166534', fontWeight: 700, fontSize: '1.1rem' }}>Sesión Activa</span>
                    <span style={{ color: '#15803d', marginLeft: 'auto', fontSize: '0.95rem', fontWeight: 500 }}>Identificador de dispositivo validado</span>
                </div>
            </div>
        </div>
    );
}
