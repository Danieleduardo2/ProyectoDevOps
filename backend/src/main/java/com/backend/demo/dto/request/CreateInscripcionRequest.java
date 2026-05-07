package com.backend.demo.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInscripcionRequest {
    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;
}
