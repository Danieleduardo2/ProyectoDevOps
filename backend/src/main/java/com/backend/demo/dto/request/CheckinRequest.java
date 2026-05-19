package com.backend.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckinRequest {

    @NotBlank(message = "El token QR no puede estar vacío")
    private String token;
}
