import { http } from "./http";

export type CheckinRequest = {
    token: string;
};

export type CheckinResponse = {
    inscripcionId?: number;
    usuarioId?: number;
    usuarioNombre?: string;
    eventoId?: number;
    eventoNombre?: string;
    checkinAt?: string;
    mensaje?: string;
};

export async function registrarCheckin(
    eventoId: string | number,
    token: string
): Promise<CheckinResponse> {
    const { data } = await http.post<CheckinResponse>(
        `/api/inscripciones/eventos/${eventoId}/checkin`,
        {
            token,
        } satisfies CheckinRequest
    );

    return data;
}
