import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getEventsByUser, type Event } from "../api/eventos";
import { getInscripcionesByUser, cancelInscripcion, getInscripcionQr, type InscripcionResponse } from "../api/inscripciones";

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

export function MyEventsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tab, setTab] = useState<"inscripciones" | "organizados">("organizados");
    
    // Inscriptions state
    const [inscripciones, setInscripciones] = useState<InscripcionResponse[]>([]);
    const [loadingInsc, setLoadingInsc] = useState(false);

    // Organized events state
    const [organizados, setOrganizados] = useState<Event[]>([]);
    const [loadingOrg, setLoadingOrg] = useState(false);

    // Modal state for QR
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        if (tab === "inscripciones") {
            loadInscripciones();
        } else {
            loadOrganizados();
        }
    }, [tab, user]);

    const loadInscripciones = async () => {
        setLoadingInsc(true);
        try {
            if (user?.id) {
                const res = await getInscripcionesByUser(user.id, { size: 100 });
                setInscripciones(res.content);
            }
        } catch (e) {
            console.error("Error cargando inscripciones", e);
        } finally {
            setLoadingInsc(false);
        }
    };

    const loadOrganizados = async () => {
        setLoadingOrg(true);
        try {
            if (user?.id) {
                const data = await getEventsByUser(user.id);
                setOrganizados(data);
            }
        } catch (e) {
            console.error("Error cargando eventos organizados", e);
        } finally {
            setLoadingOrg(false);
        }
    };

    const handleCancelInscripcion = async (id: number) => {
        if (!confirm("¿Estás seguro de cancelar tu inscripción?")) return;
        try {
            await cancelInscripcion(id);
            loadInscripciones();
        } catch (e) {
            alert("Error al cancelar la inscripción.");
        }
    };

    const handleShowQr = async (id: number) => {
        try {
            const data = await getInscripcionQr(id);
            setQrUrl(data.qrUrl);
        } catch (e) {
            alert("No se pudo cargar el QR.");
        }
    };

    return (
        <div>
            <div className="dash-card-header">
                <h2>Mis Eventos</h2>
                <p>Aquí puedes ver los eventos a los que asistirás y los que estás organizando.</p>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button 
                    onClick={() => setTab("organizados")} 
                    style={{ 
                        flex: 1, padding: '15px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                        background: tab === "organizados" ? 'linear-gradient(135deg, #ff007f, #d5006a)' : '#f5f5f5',
                        color: tab === "organizados" ? '#fff' : '#666',
                        transition: 'all 0.3s',
                        boxShadow: tab === "organizados" ? '0 4px 15px rgba(255, 0, 127, 0.3)' : 'none'
                    }}
                >
                    <i className="pi pi-calendar" style={{ marginRight: '8px' }}></i> Eventos que Organizo
                </button>
                <button 
                    onClick={() => setTab("inscripciones")} 
                    style={{ 
                        flex: 1, padding: '15px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                        background: tab === "inscripciones" ? 'linear-gradient(135deg, #a735c4, #832ab9)' : '#f5f5f5',
                        color: tab === "inscripciones" ? '#fff' : '#666',
                        transition: 'all 0.3s',
                        boxShadow: tab === "inscripciones" ? '0 4px 15px rgba(167, 53, 196, 0.3)' : 'none'
                    }}
                >
                    <i className="pi pi-ticket" style={{ marginRight: '8px' }}></i> Mis Inscripciones
                </button>
            </div>

            <div>
                {tab === "inscripciones" && (
                    <>
                        {loadingInsc ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Cargando inscripciones...</div>
                        ) : inscripciones.length === 0 ? (
                            <div className="dash-card" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                                <h3>No tienes inscripciones activas</h3>
                                <button 
                                    onClick={() => navigate('/events')} 
                                    style={{ 
                                        marginTop: '20px', 
                                        padding: '12px 28px', 
                                        borderRadius: '50px', 
                                        border: 'none', 
                                        background: 'linear-gradient(135deg, #e11d48, #be123c)', 
                                        color: '#fff', 
                                        fontWeight: 600, 
                                        fontSize: '1rem', 
                                        cursor: 'pointer', 
                                        boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    Explorar eventos
                                </button>
                            </div>
                        ) : (
                            <div className="events-horizontal-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                                {inscripciones.map((i, idx) => {
                                    const bgGradient = gradients[idx % gradients.length];
                                    const dateObj = parseDate(i.eventoFecha); // Utilizar la fecha real del evento
                                    
                                    return (
                                        <div key={i.id} className="ev-card">
                                            <div className="ev-banner-container" style={{ height: '120px' }}>
                                                <div className="ev-banner" style={{ background: i.eventoImageUrl ? `url(${import.meta.env.VITE_API_BASE_URL || ''}${i.eventoImageUrl}) center/cover no-repeat` : bgGradient }}></div>
                                                <div className="ev-date-floating">
                                                    <div className="month">{dateObj.month}</div>
                                                    <div className="day">{dateObj.day}</div>
                                                </div>
                                            </div>
                                            <div className="ev-content">
                                                <div className="ev-details" style={{ marginTop: '5px' }}>
                                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#1f2937', fontWeight: 700 }}>{i.eventoNombre || "Evento Desconocido"}</h4>
                                                    <div className={`ev-pill ${i.estado === 'ACTIVO' ? 'published' : 'draft'}`} style={{ display: 'inline-block' }}>
                                                        {i.estado === 'ACTIVO' ? 'Asistiré' : i.estado}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                                                    <button className="btn-outline-pink" onClick={() => handleShowQr(i.id)} style={{ flex: 1, padding: '8px' }}>
                                                        <i className="pi pi-qrcode"></i> Ver QR
                                                    </button>
                                                    <button onClick={() => handleCancelInscripcion(i.id)} style={{ background: 'transparent', border: '1px solid #dc3545', color: '#dc3545', padding: '8px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s', flex: 1 }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#dc3545'; e.currentTarget.style.color = 'white'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#dc3545'; }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {tab === "organizados" && (
                    <>
                        {loadingOrg ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Cargando eventos...</div>
                        ) : organizados.length === 0 ? (
                            <div className="dash-card" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                <i className="pi pi-calendar-plus" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                                <h3>No has organizado ningún evento</h3>
                                <button 
                                    onClick={() => navigate('/events/create')} 
                                    style={{ 
                                        marginTop: '20px', 
                                        padding: '12px 28px', 
                                        borderRadius: '50px', 
                                        border: 'none', 
                                        background: 'linear-gradient(135deg, #e11d48, #be123c)', 
                                        color: '#fff', 
                                        fontWeight: 600, 
                                        fontSize: '1rem', 
                                        cursor: 'pointer', 
                                        boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    Crear mi primer evento
                                </button>
                            </div>
                        ) : (
                            <div className="events-horizontal-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                                {organizados.map((evt, idx) => {
                                    const bgGradient = gradients[idx % gradients.length];
                                    const dateObj = parseDate(evt.fecha);
                                    return (
                                        <div key={evt.id} className="ev-card" onClick={() => navigate(`/events/${evt.id}`)} style={{ cursor: 'pointer' }}>
                                            <div className="ev-banner-container" style={{ height: '120px' }}>
                                                <div className="ev-banner" style={{ background: evt.imageUrl ? `url(${import.meta.env.VITE_API_BASE_URL || ''}${evt.imageUrl}) center/cover no-repeat` : bgGradient }}></div>
                                                <div className="ev-date-floating">
                                                    <div className="month">{dateObj.month}</div>
                                                    <div className="day">{dateObj.day}</div>
                                                </div>
                                            </div>
                                            <div className="ev-content">
                                                <div className="ev-details" style={{ marginTop: '5px' }}>
                                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#1f2937', fontWeight: 700 }}>{evt.nombre}</h4>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                        <span style={{ background: 'rgba(225,29,72,0.1)', color: '#e11d48', padding: '4px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                            {evt.categoria || 'Otro'}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: evt.estado === 'PUBLISHED' ? '#10b981' : '#6b7280', background: evt.estado === 'PUBLISHED' ? '#d1fae5' : '#f3f4f6', padding: '4px 10px', borderRadius: '10px' }}>
                                                            {evt.estado === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', marginTop: 'auto', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                                                    <button className="btn-solid-pink" onClick={(e) => { e.stopPropagation(); navigate(`/events/${evt.id}`); }} style={{ width: '100%', padding: '10px 15px', borderRadius: '50px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.2)' }}>
                                                        <i className="pi pi-cog"></i> Administrar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* QR Modal */}
            {qrUrl && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: "30px", borderRadius: "20px", textAlign: "center", border: '1px solid #eee', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%' }}>
                        <h2 style={{ margin: "0 0 20px 0", color: '#1a1a3a' }}>Tu Código QR</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Muestra este código en la entrada del evento.</p>
                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', display: 'inline-block' }}>
                            <img src={qrUrl} alt="QR Code" style={{ width: "220px", height: "220px", objectFit: "contain" }} />
                        </div>
                        <br/>
                        <button 
                            onClick={() => setQrUrl(null)} 
                            style={{ 
                                marginTop: "25px", 
                                width: '100%',
                                padding: '12px',
                                borderRadius: '50px',
                                background: '#f1f5f9',
                                color: '#1e293b',
                                border: '1px solid #cbd5e1',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
