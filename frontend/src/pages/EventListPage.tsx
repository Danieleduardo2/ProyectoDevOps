import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents, registerToEvent, type Event, type EventStatus, type PageResponse } from "../api/eventos";
import { getErrorMessage } from "../api/errorMessage";
import { useAuth } from "../auth/AuthContext";

const eventStatuses: EventStatus[] = ["DRAFT", "PUBLISHED", "CLOSED", "CANCELLED"];

export function EventListPage() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [nombre, setNombre] = useState("");
    const [estado, setEstado] = useState<EventStatus | "">("");
    const [data, setData] = useState<PageResponse<Event> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [registeringId, setRegisteringId] = useState<number | null>(null);

    async function load(pageNumber: number = page) {
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);
            const res = await getEvents({
                page: pageNumber,
                size,
                nombre: nombre.trim() || undefined,
                estado: estado || undefined,
            });
            setData(res);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size]);

    async function applyFilters() {
        setPage(0);
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
        <div className="page-shell">
            <header className="page-header card-panel">
                <div>
                    <span className="badge">Explorar</span>
                    <h1>Eventos disponibles</h1>
                    <p>Revisa los próximos eventos, su estado y regístrate para recibir tu invitación con QR.</p>
                </div>
                <div className="page-actions">
                    <button className="secondary-button" onClick={() => navigate("/app")}>Inicio</button>
                    <button className="secondary-button" onClick={() => navigate("/user")}>Mi perfil</button>
                    {isAdmin && <button className="secondary-button" onClick={() => navigate("/admin")}>Admin</button>}
                </div>
            </header>

            <section className="filter-panel card-panel card-panel-alt">
                <div className="filter-group">
                    <label>Buscar por nombre</label>
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del evento" />
                </div>
                <div className="filter-group">
                    <label>Filtrar por estado</label>
                    <select value={estado} onChange={(e) => setEstado(e.target.value as EventStatus | "")}> 
                        <option value="">Todos</option>
                        {eventStatuses.map((estadoItem) => (
                            <option key={estadoItem} value={estadoItem}>{estadoItem}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group filter-group-action">
                    <button className="primary-button" onClick={applyFilters}>Aplicar filtros</button>
                </div>
            </section>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            <section className="event-grid">
                {loading ? (
                    <div className="loading-card">Cargando eventos...</div>
                ) : data?.content.length ? (
                    data.content.map((evento) => (
                        <article key={evento.id} className="event-card">
                            <div className="event-card-header">
                                <div>
                                    <span className="event-badge">{evento.estado}</span>
                                    <h2>{evento.nombre}</h2>
                                </div>
                                <div className="event-meta">{evento.fecha} · {evento.hora}</div>
                            </div>
                            <p className="event-description">{evento.descripcion || "Sin descripción disponible."}</p>
                            <div className="event-tags">
                                <span className="chip">{evento.ubicacion}</span>
                                <span className="chip">Cupos: {evento.capacidadMaxima ?? "-"}</span>
                                <span className="chip">Parking: {evento.parkingAvailable ? `Sí (${evento.parkingSpots ?? 0})` : "No"}</span>
                            </div>
                            <div className="event-actions">
                                <button className="ghost-button" onClick={() => navigate(`/events/${evento.id}`)}>Ver</button>
                                <button
                                    className="primary-button"
                                    disabled={evento.estado !== "PUBLISHED" || registeringId === evento.id}
                                    onClick={() => onRegister(evento.id)}
                                >
                                    {evento.estado !== "PUBLISHED" ? "No disponible" : registeringId === evento.id ? "Inscribiendo..." : "Inscribirse"}
                                </button>
                            </div>
                            <div className="event-actions secondary">
                                <button className="ghost-button" onClick={() => navigate(`/checkin/escanear/${evento.id}`)}>Escáner</button>
                                <button className="ghost-button" onClick={() => navigate(`/eventos/${evento.id}/reporte`)}>Reporte</button>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="empty-state">No se encontraron eventos con los filtros seleccionados.</div>
                )}
            </section>

            <footer className="pagination-panel card-panel card-panel-alt">
                <button className="ghost-button" disabled={loading || page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
                    Anterior
                </button>
                <div className="pagination-summary">
                    Página <strong>{page + 1}</strong> de <strong>{data?.totalPages ?? 1}</strong>
                </div>
                <button className="ghost-button" disabled={loading || !data || page + 1 >= data.totalPages} onClick={() => setPage((current) => current + 1)}>
                    Siguiente
                </button>
                <div className="page-size">
                    <label>Mostrar</label>
                    <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    eventos
                </div>
            </footer>
        </div>
    );
}
