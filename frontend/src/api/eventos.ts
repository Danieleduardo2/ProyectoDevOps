import { http } from "./http";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "CANCELLED";

export type Event = {
    id: number;
    nombre: string;
    descripcion: string;
    fecha: string;
    hora: string;
    ubicacion: string;
    estado: EventStatus;
    capacidadMaxima: number;
    parkingAvailable: boolean;
    parkingSpots?: number;
    createdAt?: string;
    updatedAt?: string;
    createdById?: number;
    createdByNombre?: string;
    createdByApellido?: string;
};

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
};

export type ReporteInscritoItem = {
    inscripcionId: number;
    usuarioId: number;
    nombreCompleto: string;
    email: string;
    estadoInscripcion: string;
    asistio: boolean;
    checkinAt?: string | null;
};

export type EventoReporteResponse = {
    eventoId: number;
    eventoNombre: string;
    totalInscritos: number;
    totalAsistentes: number;
    totalAusentes: number;
    porcentajeAsistencia: number;
    inscritos: ReporteInscritoItem[];
};

export async function getEvents(params: {
    page: number;
    size: number;
    nombre?: string;
    estado?: EventStatus;
}) {
    const { data } = await http.get<PageResponse<Event>>("/api/events", {
        params,
    });
    return data;
}

export async function getEvent(eventoId: string | number) {
    const { data } = await http.get<Event>(`/api/events/${eventoId}`);
    return data;
}

export async function registerToEvent(eventoId: string | number) {
    const { data } = await http.post("/api/inscripciones", {
        eventoId: Number(eventoId),
    });
    return data;
}

export async function getEventoReporte(eventoId: string | number) {
    const { data } = await http.get<EventoReporteResponse>(
        `/api/inscripciones/eventos/${eventoId}/reporte`
    );
    return data;
}
