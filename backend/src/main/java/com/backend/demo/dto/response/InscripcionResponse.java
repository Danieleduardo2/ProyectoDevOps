package com.backend.demo.dto.response;

import com.backend.demo.model.enums.InscripcionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscripcionResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private Long eventoId;
    private String eventoNombre;
    private java.time.LocalDate eventoFecha;
    private InscripcionStatus estado;
    private LocalDateTime createdAt;
    private Integer cuposRestantes;
    private String qrUrl;

}