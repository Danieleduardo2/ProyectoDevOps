package com.backend.demo.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActionResponse {
    private Long id;
    private String usuario;
    private String accion;
    private LocalDateTime fecha;

}