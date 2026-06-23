import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent, registerToEvent, deleteEvent, updateEventStatus, type Event } from "../api/eventos";
import { getErrorMessage } from "../api/errorMessage";
import { useAuth } from "../auth/AuthContext";
import { getInscripcionesByUser } from "../api/inscripciones";

export function EventDetailPage() {
    const navigate = useNavigate();
    const { eventoId } = useParams();
    const { user, isAdmin } = useAuth();

    const [evt, setEvt] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isInscribed, setIsInscribed] = useState(false);

    const isOrganizer = user?.id === evt?.createdById;
    const canManage = isAdmin || isOrganizer;

    useEffect(() => {
        load();
        checkInscription();
    }, [eventoId, user]);

    async function checkInscription() {
        if (!user || !eventoId) return;
        try {
            const res = await getInscripcionesByUser(user.id, { size: 100 });
            const found = res.content.find(i => i.eventoId === Number(eventoId) && i.estado !== 'CANCELADA');
            setIsInscribed(!!found);
        } catch (e) {
            console.error("Error comprobando inscripción", e);
        }
    }

    async function load() {
        if (!eventoId) return;
        try {
            setLoading(true);
            const data = await getEvent(Number(eventoId));
            setEvt(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function onRegister() {
        if (!evt) return;
        try {
            setActionLoading(true);
            await registerToEvent(evt.id);
            alert("¡Te has inscrito al evento exitosamente! Revisa tu correo o 'Mis Eventos'.");
            await load();
            await checkInscription();
        } catch (err) {
            alert(getErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    }

    async function onDelete() {
        if (!evt) return;
        if (!confirm("¿Estás seguro de eliminar este evento?")) return;
        try {
            setActionLoading(true);
            await deleteEvent(evt.id);
            navigate("/events");
        } catch (err) {
            alert(getErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    }

    async function onPublish() {
        if (!evt) return;
        try {
            setActionLoading(true);
            await updateEventStatus(evt.id, "PUBLISHED");
            await load();
        } catch (err) {
            alert(getErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>Cargando evento...</div>;
    if (error || !evt) return <div style={{ padding: '50px', textAlign: 'center', color: '#dc3545' }}>Error: {error || "Evento no encontrado"}</div>;

    const bannerGradient = "linear-gradient(135deg, #a735c4 0%, #e11d48 100%)";

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                    <i className="pi pi-arrow-left"></i> Volver
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
                {/* Header Banner */}
                <div style={{ background: evt.imageUrl ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${import.meta.env.VITE_API_BASE_URL || ''}${evt.imageUrl}) center/cover no-repeat` : bannerGradient, padding: '40px 40px', color: 'white', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '20px', right: '20px', padding: '6px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: evt.estado === 'PUBLISHED' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.3)', color: evt.estado === 'PUBLISHED' ? '#166534' : 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        {evt.estado === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                    </span>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: 800 }}>{evt.nombre}</h1>
                    <div style={{ display: 'flex', gap: '20px', opacity: 0.9 }}>
                        <div><i className="pi pi-tag"></i> {evt.categoria || 'Otro'}</div>
                        <div><i className="pi pi-calendar"></i> {evt.fecha}</div>
                        <div><i className="pi pi-clock"></i> {evt.hora}</div>
                        <div><i className="pi pi-map-marker"></i> {evt.ubicacion}</div>
                    </div>
                </div>

                <div style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    {/* Left Column (Main Info) */}
                    <div style={{ flex: '2', minWidth: '300px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#1f2937', marginTop: 0, marginBottom: '15px' }}>Acerca del evento</h3>
                        <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                            {evt.descripcion}
                        </p>

                        <h3 style={{ fontSize: '1.2rem', color: '#1f2937', marginTop: '30px', marginBottom: '15px' }}>Detalles logísticos</h3>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1, background: '#f9fafb', padding: '15px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '5px' }}>Estacionamiento</div>
                                <div style={{ color: '#1f2937', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className={`pi ${evt.parkingAvailable ? 'pi-check-circle text-green' : 'pi-times-circle text-red'}`} style={{ color: evt.parkingAvailable ? '#10b981' : '#ef4444' }}></i>
                                    {evt.parkingAvailable ? `${evt.parkingSpots} cupos` : 'No disponible'}
                                </div>
                            </div>
                            <div style={{ flex: 1, background: '#f9fafb', padding: '15px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '5px' }}>Ocupación</div>
                                <div style={{ color: '#1f2937', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="pi pi-users" style={{ color: '#3b82f6' }}></i>
                                    {evt.inscritosCount ?? 0} / {evt.capacidadMaxima}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Actions) */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '25px', border: '1px solid #e5e7eb', position: 'sticky', top: '20px' }}>
                            
                            {!isOrganizer && (
                                <>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Asistencia</h4>
                                    <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.5 }}>
                                        Regístrate para asegurar tu cupo y obtener tu código QR de acceso.
                                    </p>
                                    {isInscribed ? (
                                        <button 
                                            className="btn-outline-pink" 
                                            disabled={true} 
                                            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: '#ecfdf5', color: '#10b981', borderColor: '#10b981', cursor: 'not-allowed' }}
                                        >
                                            <i className="pi pi-check-circle" style={{ marginRight: '8px', fontWeight: 'bold' }}></i> Ya estás inscrito
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn-solid-pink" 
                                            disabled={evt.estado !== 'PUBLISHED' || (evt.inscritosCount ?? 0) >= evt.capacidadMaxima || actionLoading} 
                                            onClick={onRegister}
                                            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(225,29,72,0.2)' }}
                                        >
                                            {actionLoading ? "Procesando..." : "Inscribirme al Evento"}
                                        </button>
                                    )}
                                </>
                            )}

                            {canManage && (
                                <>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>Gestión (Organizador)</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {evt.estado === 'DRAFT' && (
                                            <button className="btn-solid-pink" style={{ background: '#10b981', border: 'none', padding: '12px', width: '100%' }} disabled={actionLoading} onClick={onPublish}>
                                                <i className="pi pi-send"></i> Publicar Evento
                                            </button>
                                        )}
                                        {evt.estado === 'PUBLISHED' && (
                                            <>
                                                <button className="btn-solid-pink" style={{ background: '#8b5cf6', border: 'none', padding: '12px', width: '100%', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)' }} onClick={() => navigate(`/checkin/escanear/${evt.id}`)}>
                                                    <i className="pi pi-camera"></i> Escanear Entradas QR
                                                </button>
                                                <button className="btn-solid-pink" style={{ background: '#3b82f6', border: 'none', padding: '12px', width: '100%', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }} onClick={() => navigate(`/eventos/${evt.id}/reporte`)}>
                                                    <i className="pi pi-chart-bar"></i> Reporte de Asistencia
                                                </button>
                                            </>
                                        )}
                                        <button className="btn-outline-pink" disabled={actionLoading} onClick={() => navigate(`/events/edit/${evt.id}`)} style={{ padding: '12px', width: '100%' }}>
                                            <i className="pi pi-pencil"></i> Editar Información
                                        </button>
                                        <button className="btn-outline-pink" style={{ color: '#dc3545', borderColor: '#fca5a5', padding: '12px', width: '100%', background: '#fef2f2' }} disabled={actionLoading} onClick={onDelete}>
                                            <i className="pi pi-trash"></i> Eliminar Evento
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}