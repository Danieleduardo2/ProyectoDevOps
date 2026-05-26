import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents, registerToEvent, type Event, type EventStatus, type PageResponse } from "../api/eventos";
import { getErrorMessage } from "../api/errorMessage";

const eventStatuses: EventStatus[] = ["DRAFT", "PUBLISHED", "CLOSED", "CANCELLED"];

export function EventListPage() {
    const navigate = useNavigate();
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

    const items = useMemo(() => data?.content ?? [], [data]);

    async function onRegister(eventoId: number) {
        setError(null);
        setSuccess(null);
        setRegisteringId(eventoId);

        try {
            await registerToEvent(eventoId);
            setSuccess("Inscripción realizada correctamente.");
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setRegisteringId(null);
        }
    }

    return (
        <div style={{ maxWidth: 1120, margin: "30px auto", fontFamily: "system-ui", padding: 16 }}>
            <h2>Eventos disponibles</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                <div>
                    <label>Buscar por nombre</label>
                    <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre del evento"
                        style={{ width: "100%", padding: 10, marginTop: 6 }}
                    />
                </div>
                <div>
                    <label>Filtrar por estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value as EventStatus | "")}
                        style={{ width: "100%", padding: 10, marginTop: 6 }}
                    >
                        <option value="">Todos</option>
                        {eventStatuses.map((estadoItem) => (
                            <option key={estadoItem} value={estadoItem}>
                                {estadoItem}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button onClick={applyFilters} style={{ width: "100%", padding: 12 }}>
                        Aplicar filtros
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ marginBottom: 16, background: "#fee", border: "1px solid #f99", padding: 12 }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ marginBottom: 16, background: "#efe", border: "1px solid #9f9", padding: 12 }}>
                    {success}
                </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                <button onClick={() => navigate("/app")} style={{ padding: "10px 16px" }}>
                    Volver al inicio
                </button>
                <button onClick={() => navigate("/admin/users")} style={{ padding: "10px 16px" }}>
                    Ir a administración
                </button>
            </div>

            <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
                    <thead>
                        <tr>
                            {[
                                "ID",
                                "Nombre",
                                "Fecha",
                                "Hora",
                                "Ubicación",
                                "Estado",
                                "Cupos",
                                "Parking",
                                "Acciones",
                            ].map((head) => (
                                <th key={head} style={{ textAlign: "left", padding: 14, background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} style={{ padding: 16 }}>
                                    Cargando eventos...
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ padding: 16 }}>
                                    No se encontraron eventos.
                                </td>
                            </tr>
                        ) : (
                            items.map((evento) => (
                                <tr key={evento.id}>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{evento.id}</td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{evento.nombre}</td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{evento.fecha}</td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{evento.hora}</td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{evento.ubicacion}</td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{evento.estado}</td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                                        {evento.capacidadMaxima ?? "-"}
                                    </td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                                        {evento.parkingAvailable ? `Sí (${evento.parkingSpots ?? 0})` : "No"}
                                    </td>
                                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9", display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <button onClick={() => navigate(`/events/${evento.id}`)} style={{ padding: "8px 12px" }}>
                                            Ver
                                        </button>
                                        <button onClick={() => onRegister(evento.id)} disabled={evento.estado !== "PUBLISHED" || registeringId === evento.id} style={{ padding: "8px 12px" }}>
                                            {evento.estado !== "PUBLISHED" ? "No disponible" : registeringId === evento.id ? "Inscribiendo..." : "Inscribirse"}
                                        </button>
                                        <button onClick={() => navigate(`/checkin/escanear/${evento.id}`)} style={{ padding: "8px 12px" }}>
                                            Escáner
                                        </button>
                                        <button onClick={() => navigate(`/eventos/${evento.id}/reporte`)} style={{ padding: "8px 12px" }}>
                                            Reporte
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                <button disabled={loading || page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} style={{ padding: "10px 16px" }}>
                    Anterior
                </button>
                <span>
                    Página <strong>{page + 1}</strong> de <strong>{data?.totalPages ?? 1}</strong>
                </span>
                <button
                    disabled={loading || !data || page + 1 >= data.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    style={{ padding: "10px 16px" }}
                >
                    Siguiente
                </button>
                <label style={{ marginLeft: "auto" }}>
                    Mostrar
                    <select value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ marginLeft: 8, padding: 8 }}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    eventos
                </label>
            </div>
        </div>
    );
}
