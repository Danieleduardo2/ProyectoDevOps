import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents, registerToEvent, type Event, type EventStatus, type PageResponse } from "../api/eventos";
import { getInscripcionesByUser } from "../api/inscripciones";
import { getErrorMessage } from "../api/errorMessage";
import { useAuth } from "../auth/AuthContext";

const eventStatuses: EventStatus[] = ["DRAFT", "PUBLISHED", "CLOSED", "CANCELLED"];

const gradients = [
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #a735c4 0%, #ff007f 100%)"
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

export function EventListPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [data, setData] = useState<PageResponse<Event> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [registeringId, setRegisteringId] = useState<number | null>(null);
    const [registeredEventIds, setRegisteredEventIds] = useState<Set<number>>(new Set());

    async function load(pageNumber: number = page) {
        setError(null);
        try {
            setLoading(true);
            const res = await getEvents({ page: pageNumber, size, nombre: nombre.trim() || undefined, categoria: categoria || undefined, estado: "PUBLISHED" });
            setData(res);

            if (user?.id) {
                const insc = await getInscripcionesByUser(user.id, { size: 200 });
                const activeIds = insc.content.filter((i) => i.estado === "CONFIRMADA" || i.estado === "ASISTIDA").map((i) => i.eventoId);
                setRegisteredEventIds(new Set(activeIds));
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [page, size]);

    async function applyFilters() {
        setPage(0);
        setSuccess(null);
        await load(0);
    }

    async function onRegister(eventoId: number) {
        setError(null);
        setSuccess(null);
        setRegisteringId(eventoId);
        try {
            await registerToEvent(eventoId);
            setSuccess("Inscripción realizada. Revisa tu correo para recibir el QR de invitación.");
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setRegisteringId(null);
        }
    }

    return (
        <div>
            <div className="dash-card-header">
                <h2>Explorar Eventos</h2>
                <p>Revisa los próximos eventos, su estado y regístrate para recibir tu invitación con QR.</p>
            </div>

            <div className="dash-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 250px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Buscar por nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                            placeholder="Nombre del evento..."
                            style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '50px', outline: 'none' }}
                        />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Categoría</label>
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '50px', outline: 'none', background: '#fff', cursor: 'pointer' }}
                        >
                            <option value="">Todas</option>
                            <option value="Tecnología">Tecnología</option>
                            <option value="Música">Música</option>
                            <option value="Deportes">Deportes</option>
                            <option value="Educación">Educación</option>
                            <option value="Negocios">Negocios</option>
                            <option value="Arte">Arte</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <button className="btn-solid-pink" onClick={applyFilters} style={{ padding: '10px 25px', borderRadius: '50px', fontWeight: 600, border: 'none', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)' }}>
                        <i className="pi pi-search" style={{ marginRight: '8px' }}></i> Buscar
                    </button>
                </div>
            </div>

            {error && <div style={{ padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>{error}</div>}
            {success && <div style={{ padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>{success}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>Cargando eventos...</div>
            ) : !data?.content.length ? (
                <div className="dash-card" style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                    <i className="pi pi-calendar-times" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '15px' }}></i>
                    <h3>No se encontraron eventos</h3>
                    <p>Intenta cambiar los filtros de búsqueda.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                    {data.content.map((evt, idx) => {
                        const isRegistered = registeredEventIds.has(evt.id);
                        const isRegistering = registeringId === evt.id;
                        const dateObj = parseDate(evt.fecha);
                        const bgGradient = gradients[idx % gradients.length];
                        
                        return (
                            <div key={evt.id} className="ev-card">
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
                                    <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '20px', marginTop: '10px', lineHeight: 1.5 }}>
                                        {evt.descripcion?.substring(0, 80)}{evt.descripcion?.length > 80 ? '...' : ''}
                                    </p>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                                        {evt.createdById === user?.id ? (
                                            <button className="btn-solid-pink" onClick={() => navigate(`/events/${evt.id}`)} style={{ flex: 1, padding: '10px 15px', borderRadius: '50px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.2)' }}>
                                                <i className="pi pi-cog"></i> Administrar
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn-outline-pink" onClick={() => navigate(`/events/${evt.id}`)} style={{ flex: 1, padding: '8px', borderRadius: '50px', fontWeight: 600 }}>
                                                    Ver Detalles
                                                </button>
                                                
                                                {evt.estado === "PUBLISHED" && (
                                                    isRegistered ? (
                                                        <button disabled style={{ flex: 1, padding: '8px', background: '#dcfce7', color: '#166534', border: '1px solid #166534', borderRadius: '50px', fontWeight: 600, cursor: 'not-allowed' }}>
                                                            Inscrito <i className="pi pi-check"></i>
                                                        </button>
                                                    ) : (
                                                        <button className="btn-solid-pink" onClick={() => onRegister(evt.id)} disabled={isRegistering} style={{ flex: 1, padding: '8px' }}>
                                                            {isRegistering ? "..." : "Inscribirse"}
                                                        </button>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            
            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                    <button className="btn-dash-outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>&lt;</button>
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>Página {page + 1} de {data.totalPages}</span>
                    <button className="btn-dash-outline" disabled={page >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>&gt;</button>
                </div>
            )}
        </div>
    );
}