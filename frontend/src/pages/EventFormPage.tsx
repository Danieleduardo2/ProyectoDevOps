import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent, createEvent, updateEvent, uploadEventImage, type Event } from "../api/eventos";

export function EventFormPage() {
    const { eventoId } = useParams();
    const navigate = useNavigate();
    const isEditing = !!eventoId;

    const [formData, setFormData] = useState<Partial<Event>>({
        nombre: "", descripcion: "", categoria: "Música", fecha: "", hora: "", ubicacion: "", capacidadMaxima: 10, parkingAvailable: false, parkingSpots: 0,
    });
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && eventoId) {
            getEvent(Number(eventoId))
                .then((data) => { 
                    setFormData(data); 
                    if (data.imageUrl) setPreviewUrl(import.meta.env.VITE_API_BASE_URL + data.imageUrl);
                    setInitialLoading(false); 
                })
                .catch((e) => { setError("No se pudo cargar el evento: " + e.message); setInitialLoading(false); });
        }
    }, [eventoId, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let finalFormData = { ...formData };
            if (selectedFile) {
                const uploadRes = await uploadEventImage(selectedFile);
                finalFormData.imageUrl = uploadRes.url;
            }

            if (isEditing && eventoId) {
                await updateEvent(Number(eventoId), finalFormData);
            } else {
                await createEvent(finalFormData);
            }
            navigate("/my-events");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Error al guardar el evento");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>Cargando...</div>;

    const inputStyle = {
        width: '100%', 
        padding: '14px 18px', 
        border: '1px solid #e5e7eb', 
        borderRadius: '12px', 
        outline: 'none', 
        fontSize: '1rem', 
        background: '#f9fafb',
        color: '#1f2937',
        transition: 'all 0.2s'
    };

    const labelStyle = {
        display: 'block', 
        fontWeight: 600, 
        marginBottom: '8px', 
        color: '#4b5563',
        fontSize: '0.95rem'
    };

    const sectionTitleStyle = {
        fontSize: '1.2rem', 
        fontWeight: 700, 
        color: '#1f2937', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div onClick={() => navigate(-1)} style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', color: '#6b7280', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="pi pi-arrow-left"></i>
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{isEditing ? "Editar Evento" : "Crear Nuevo Evento"}</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>Completa el formulario para {isEditing ? "actualizar los detalles del" : "publicar tu"} evento.</p>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                {error && <div style={{ padding: '15px', background: '#fef2f2', color: '#991b1b', borderRadius: '12px', marginBottom: '25px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px' }}><i className="pi pi-exclamation-triangle"></i> {error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    {/* Section 1 */}
                    <div>
                        <h3 style={sectionTitleStyle}>
                            <div style={{ background: '#fff0f5', color: '#e11d48', width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="pi pi-info-circle"></i></div>
                            Detalles Principales
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Nombre del Evento *</label>
                                <input required type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} style={inputStyle} placeholder="Ej: Concierto de Verano, Conferencia Tech..." />
                            </div>

                            <div>
                                <label style={labelStyle}>Categoría del Evento *</label>
                                <select required value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
                                    <option value="Música">Música</option>
                                    <option value="Deportes">Deportes</option>
                                    <option value="Tecnología">Tecnología</option>
                                    <option value="Arte y Cultura">Arte y Cultura</option>
                                    <option value="Negocios">Negocios</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Descripción</label>
                                <textarea required value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Escribe los detalles, qué pasará, quiénes estarán..." />
                            </div>

                            <div>
                                <label style={labelStyle}>Foto de Portada</label>
                                <div style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '20px', textAlign: 'center', background: '#f9fafb', position: 'relative', cursor: 'pointer' }}>
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                                    {previewUrl ? (
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <p style={{ margin: '10px 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>Haz clic para cambiar la imagen</p>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '20px 0', color: '#9ca3af' }}>
                                            <i className="pi pi-image" style={{ fontSize: '2rem', marginBottom: '10px', color: '#d1d5db' }}></i>
                                            <p style={{ margin: 0, color: '#6b7280' }}>Haz clic para subir una imagen</p>
                                            <span style={{ fontSize: '0.8rem' }}>Recomendado: 800x400 (PNG, JPG)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#f3f4f6' }}></div>

                    {/* Section 2 */}
                    <div>
                        <h3 style={sectionTitleStyle}>
                            <div style={{ background: '#f3e8ff', color: '#8b5cf6', width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="pi pi-map-marker"></i></div>
                            Cuándo y Dónde
                        </h3>
                        
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={labelStyle}>Fecha *</label>
                                <input required type="date" value={formData.fecha} onChange={e => setFormData({ ...formData, fecha: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={labelStyle}>Hora *</label>
                                <input required type="time" value={formData.hora} onChange={e => setFormData({ ...formData, hora: e.target.value })} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 2, minWidth: '300px' }}>
                                <label style={labelStyle}>Ubicación / Dirección *</label>
                                <input required type="text" value={formData.ubicacion} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} style={inputStyle} placeholder="Ej: Auditorio Principal, Ciudad de México" />
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#f3f4f6' }}></div>

                    {/* Section 3 */}
                    <div>
                        <h3 style={sectionTitleStyle}>
                            <div style={{ background: '#d1fae5', color: '#10b981', width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="pi pi-sliders-h"></i></div>
                            Logística y Capacidad
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ maxWidth: '300px' }}>
                                <label style={labelStyle}>Capacidad Máxima de Asistentes *</label>
                                <div style={{ position: 'relative' }}>
                                    <i className="pi pi-users" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
                                    <input required type="number" min="1" value={formData.capacidadMaxima} onChange={e => setFormData({ ...formData, capacidadMaxima: Number(e.target.value) })} style={{ ...inputStyle, paddingLeft: '45px' }} />
                                </div>
                            </div>

                            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 600, color: '#374151', cursor: 'pointer', margin: 0 }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: formData.parkingAvailable ? 'none' : '2px solid #d1d5db', background: formData.parkingAvailable ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        {formData.parkingAvailable && <i className="pi pi-check" style={{ fontSize: '0.8rem' }}></i>}
                                    </div>
                                    <input type="checkbox" checked={formData.parkingAvailable} onChange={e => setFormData({ ...formData, parkingAvailable: e.target.checked })} style={{ display: 'none' }} />
                                    <span>¿El evento ofrece estacionamiento?</span>
                                </label>

                                {formData.parkingAvailable && (
                                    <div style={{ marginTop: '20px', paddingLeft: '40px' }}>
                                        <label style={labelStyle}>Cantidad de cupos de estacionamiento</label>
                                        <input type="number" min="0" value={formData.parkingSpots} onChange={e => setFormData({ ...formData, parkingSpots: Number(e.target.value) })} style={{ ...inputStyle, maxWidth: '200px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
                        <button type="button" className="btn-outline-pink" onClick={() => navigate(-1)} style={{ padding: '12px 30px' }}>Cancelar</button>
                        <button type="submit" className="btn-solid-pink" disabled={loading} style={{ padding: '12px 40px', fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(225,29,72,0.2)' }}>
                            {loading ? "Guardando..." : isEditing ? "Actualizar Evento" : "Crear Evento"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
