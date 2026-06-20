import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getEventsByUser, type Event } from "../api/eventos";

const gradients = [
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
];

function parseDate(dateStr?: string) {
    if (!dateStr) return { month: "N/A", day: "00" };
    try {
        const d = new Date(dateStr);
        return {
            month: d.toLocaleString('es-ES', { month: 'short' }).replace('.', ''),
            day: d.getDate().toString().padStart(2, '0')
        };
    } catch {
        return { month: "N/A", day: "00" };
    }
}

export function AppHome() {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [misEventos, setMisEventos] = useState<Event[]>([]);

    useEffect(() => {
        if (user?.id) {
            getEventsByUser(user.id).then(data => {
                setMisEventos(data.slice(0, 4)); // Mostrar los primeros 4 para llenar la fila
            }).catch(e => console.error("Error loading events", e));
        }
    }, [user]);

    return (
        <div>
            {/* Welcome Section */}
            <div className="welcome-section">
                <h1 className="welcome-title">Te damos la bienvenida{user ? `, ${user.nombre}` : ""} 👋</h1>
                <p className="welcome-subtitle">Accede a tus eventos, gestiona tu cuenta y navega por las funciones administrativas.</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="btn-solid-pink" onClick={() => navigate("/events")}>Ver eventos →</button>
                <button className="btn-outline-pink" onClick={() => navigate("/events/create")}>+ Crear Evento</button>
                <a className="text-link" onClick={() => navigate("/user")} style={{ marginLeft: '10px' }}>Mi perfil</a>
            </div>

            {/* Action Cards */}
            <div className="action-cards-grid">
                <div className="action-card pink" onClick={() => navigate("/events")}>
                    <div className="ac-icon pink"><i className="pi pi-compass"></i></div>
                    <h3 className="ac-title">Explorar eventos</h3>
                    <p className="ac-desc">Encuentra eventos recientes, revisa estados y regístrate con un solo clic.</p>
                    <div className="ac-link pink">Ir a eventos →</div>
                </div>

                <div className="action-card purple" onClick={() => navigate("/user")}>
                    <div className="ac-icon purple"><i className="pi pi-user"></i></div>
                    <h3 className="ac-title">Mi módulo de usuario</h3>
                    <p className="ac-desc">Revisa tus inscripciones, tu perfil y los eventos que tienes pendientes.</p>
                    <div className="ac-link purple">Mi usuario →</div>
                </div>

                <div className="action-card green" onClick={() => isAdmin && navigate("/admin")} style={{ opacity: isAdmin ? 1 : 0.7, cursor: isAdmin ? 'pointer' : 'not-allowed' }}>
                    <div className="ac-icon green"><i className="pi pi-cog"></i></div>
                    <h3 className="ac-title">Administración</h3>
                    <p className="ac-desc">{isAdmin ? "Acceso completo a la gestión de la plataforma." : "Acceso restringido para administradores."}</p>
                    <div className="ac-link green" style={{ color: isAdmin ? '#10b981' : '#9ca3af' }}>{isAdmin ? 'Ir al admin →' : 'Sin acceso'}</div>
                </div>
            </div>

            {/* Mis Eventos Section */}
            <div className="section-header">
                <div>
                    <h3>Mis Eventos</h3>
                    <p>Administra y revisa los eventos que has creado.</p>
                </div>
                <a className="view-all-link" onClick={() => navigate('/my-events')} style={{ cursor: 'pointer' }}>
                    Ver todos mis eventos →
                </a>
            </div>

            <div className="events-horizontal-grid">
                {misEventos.length === 0 ? (
                    <div style={{ padding: '30px', color: '#6b7280', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
                        No tienes eventos creados recientemente. <a className="text-link" style={{ color: '#e11d48', cursor: 'pointer' }} onClick={() => navigate('/events/create')}>Crea uno ahora</a>.
                    </div>
                ) : (
                    misEventos.map((evt, idx) => {
                        const dateObj = parseDate(evt.fecha);
                        const bgGradient = gradients[idx % gradients.length];
                        return (
                            <div key={evt.id} className="ev-card" onClick={() => navigate(`/events/${evt.id}`)} style={{ cursor: 'pointer' }}>
                                <div className="ev-banner" style={{ background: evt.imageUrl ? `url(${import.meta.env.VITE_API_BASE_URL || ''}${evt.imageUrl}) center/cover no-repeat` : bgGradient }}></div>
                                <div className="ev-content">
                                    <div className="ev-info-row">
                                        <div className="ev-date">
                                            <div className="ev-date-month">{dateObj.month}</div>
                                            <div className="ev-date-day">{dateObj.day}</div>
                                        </div>
                                        <div className="ev-details">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <span style={{ background: 'rgba(225,29,72,0.1)', color: '#e11d48', padding: '4px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {evt.categoria || 'Otro'}
                                                </span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: evt.estado === 'PUBLISHED' ? '#10b981' : '#6b7280', background: evt.estado === 'PUBLISHED' ? '#d1fae5' : '#f3f4f6', padding: '4px 10px', borderRadius: '10px' }}>
                                                    {evt.estado === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </div>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#1f2937' }}>{evt.nombre}</h4>
                                            <div className="ev-location">
                                                <i className="pi pi-map-marker" style={{ color: '#9ca3af' }}></i> {evt.ubicacion}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ev-footer">
                                        <div className="ev-footer-item"><i className="pi pi-eye"></i> 320</div>
                                        <div className="ev-footer-item"><i className="pi pi-users"></i> {evt.capacidadMaxima}</div>
                                        <div className="ev-footer-action"><i className="pi pi-share-alt"></i></div>
                                        <div className="ev-footer-action"><i className="pi pi-ellipsis-h"></i></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Categories Section */}
            <div className="section-header" style={{ marginTop: '20px' }}>
                <h3>Explorar por categorías</h3>
                <a className="view-all-link" onClick={() => navigate('/events')} style={{ cursor: 'pointer' }}>
                    Ver todas las categorías →
                </a>
            </div>

            <div className="categories-container">
                <div className="cat-pill" onClick={() => navigate('/events')}><i className="pi pi-music cat-pink cat-icon"></i> <span className="cat-pink">Música</span></div>
                <div className="cat-pill" onClick={() => navigate('/events')}><i className="pi pi-bolt cat-green cat-icon"></i> <span className="cat-green">Deportes</span></div>
                <div className="cat-pill" onClick={() => navigate('/events')}><i className="pi pi-desktop cat-purple cat-icon"></i> <span className="cat-purple">Tecnología</span></div>
                <div className="cat-pill" onClick={() => navigate('/events')}><i className="pi pi-palette cat-yellow cat-icon"></i> <span className="cat-yellow">Arte y Cultura</span></div>
                <div className="cat-pill" onClick={() => navigate('/events')}><i className="pi pi-briefcase cat-blue cat-icon"></i> <span className="cat-blue">Negocios</span></div>
                <div className="cat-pill" onClick={() => navigate('/events')}><i className="pi pi-th-large cat-grey cat-icon"></i> <span className="cat-grey">Más</span></div>
            </div>

        </div>
    );
}