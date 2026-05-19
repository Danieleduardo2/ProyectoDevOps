package com.backend.demo.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckinResponse {
    private Long inscripcionId;
    private Long usuarioId;
    private String usuarioNombre;
    private Long eventoId;
    private String eventoNombre;
    private LocalDateTime checkinAt;
    private String mensaje;
}