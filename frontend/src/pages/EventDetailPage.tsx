import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent, registerToEvent, type Event } from "../api/eventos";
import { getErrorMessage } from "../api/errorMessage";

export function EventDetailPage() {
    const navigate = useNavigate();
    const { eventoId } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        async function load() {
            if (!eventoId) {
                setError("No se encontró el ID del evento.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const res = await getEvent(eventoId);
                setEvent(res);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [eventoId]);

    async function onRegister() {
        if (!event) return;
        setError(null);
        setSuccess(null);
        setRegistering(true);
        try {
            await registerToEvent(event.id);
            setSuccess("Inscripción realizada correctamente.");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setRegistering(false);
        }
    }

    return (
        <div style={{ maxWidth: 900, margin: "30px auto", fontFamily: "system-ui", padding: 16 }}>
            <button onClick={() => navigate("/events")} style={{ marginBottom: 16, padding: "10px 16px" }}>
                Volver a eventos
            </button>

            {loading ? (
                <div>Cargando información del evento...</div>
            ) : error ? (
                <div style={{ background: "#fee", border: "1px solid #f99", padding: 16 }}>{error}</div>
            ) : event ? (
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)" }}>
                    <h1 style={{ marginTop: 0 }}>{event.nombre}</h1>
                    <p style={{ color: "#475467" }}>{event.descripcion}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }}>
                        <div>
                            <strong>Fecha</strong>
                            <div>{event.fecha}</div>
                        </div>
                        <div>
                            <strong>Hora</strong>
                            <div>{event.hora}</div>
                        </div>
                        <div>
                            <strong>Ubicación</strong>
                            <div>{event.ubicacion}</div>
                        </div>
                        <div>
                            <strong>Estado</strong>
                            <div>{event.estado}</div>
                        </div>
                        <div>
                            <strong>Cupo máximo</strong>
                            <div>{event.capacidadMaxima}</div>
                        </div>
                        <div>
                            <strong>Parking</strong>
                            <div>{event.parkingAvailable ? `Sí (${event.parkingSpots ?? 0})` : "No"}</div>
                        </div>
                        <div>
                            <strong>Creador</strong>
                            <div>{event.createdByNombre ? `${event.createdByNombre} ${event.createdByApellido}` : "No disponible"}</div>
                        </div>
                        <div>
                            <strong>Actualizado</strong>
                            <div>{event.updatedAt ?? "Sin información"}</div>
                        </div>
                    </div>

                    {error && (
                        <div style={{ marginTop: 20, background: "#fee", border: "1px solid #f99", padding: 12 }}>{error}</div>
                    )}
                    {success && (
                        <div style={{ marginTop: 20, background: "#efe", border: "1px solid #9f9", padding: 12 }}>{success}</div>
                    )}

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                        <button
                            onClick={onRegister}
                            disabled={event.estado !== "PUBLISHED" || registering}
                            style={{ padding: "12px 18px" }}
                        >
                            {event.estado !== "PUBLISHED" ? "Solo eventos publicados" : registering ? "Inscribiendo..." : "Inscribirme"}
                        </button>
                        <button onClick={() => navigate(`/checkin/escanear/${event.id}`)} style={{ padding: "12px 18px" }}>
                            Escáner QR
                        </button>
                        <button onClick={() => navigate(`/eventos/${event.id}/reporte`)} style={{ padding: "12px 18px" }}>
                            Ver reporte
                        </button>
                    </div>
                </div>
            ) : (
                <div>No se encontró el evento.</div>
            )}
        </div>
    );
}
