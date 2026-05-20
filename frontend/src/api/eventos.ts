import { http } from "./http";

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

export async function getEventoReporte(eventoId: string | number) {
    const { data } = await http.get<EventoReporteResponse>(
        `/api/inscripciones/eventos/${eventoId}/reporte`
    );
    return data;
}
