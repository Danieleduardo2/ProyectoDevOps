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
            <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 className="welcome-title">Te damos la bienvenida{user ? `, ${user.nombre}` : ""} 👋</h1>
                    <p className="welcome-subtitle">Administra tus eventos y mantente al día con tus actividades.</p>
                </div>
                <button className="btn-solid-pink" onClick={() => navigate("/events/create")} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1.05rem', borderRadius: '50px', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)' }}>
                    <i className="pi pi-plus" style={{ fontWeight: 'bold' }}></i> Crear Evento
                </button>
            </div>
            
            <div style={{ height: '60px' }}></div>

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
                                <div className="ev-banner-container">
                                    <div className="ev-banner" style={{ background: evt.imageUrl ? `url(${import.meta.env.VITE_API_BASE_URL || ''}${evt.imageUrl}) center/cover no-repeat` : bgGradient }}></div>
                                    <div className="ev-date-floating">
                                        <div className="month">{dateObj.month}</div>
                                        <div className="day">{dateObj.day}</div>
                                    </div>
                                </div>
                                <div className="ev-content">
                                    <div className="ev-details" style={{ marginTop: '5px' }}>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#1f2937', fontWeight: 700 }}>{evt.nombre}</h4>
                                        <div className="ev-location" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.85rem' }}>
                                            <i className="pi pi-map-marker" style={{ color: '#e11d48' }}></i> {evt.ubicacion}
                                        </div>
                                    </div>
                                    <div className="ev-footer" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '15px', marginTop: 'auto' }}>
                                        <div className="ev-footer-item"><i className="pi pi-users" style={{ color: '#8b5cf6', fontSize: '1.1rem' }}></i> <span style={{ fontWeight: 600 }}>{evt.capacidadMaxima}</span> <span style={{fontSize: '0.8rem'}}>cupos</span></div>
                                        <div className="ev-footer-action" style={{ background: '#fff0f5', color: '#e11d48', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            Ver <i className="pi pi-arrow-right" style={{ fontSize: '0.7rem' }}></i>
                                        </div>
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