package com.backend.demo.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteAsistenciaResponse {

    private Long eventoId;
    private String eventoNombre;

    private int totalInscritos;
    private int totalAsistentes;
    private int totalAusentes;

    /** Porcentaje de asistencia, redondeado a 2 decimales. */
    private double porcentajeAsistencia;

    private List<AsistenteDetalleResponse> inscritos;

    // ── Detalle por inscrito ──────────────────────────────────────
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AsistenteDetalleResponse {
        private Long inscripcionId;
        private Long usuarioId;
        private String nombreCompleto;
        private String email;
        private String estadoInscripcion;
        private boolean asistio;
        private java.time.LocalDateTime checkinAt;
    }
}