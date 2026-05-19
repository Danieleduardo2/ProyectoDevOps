package com.backend.demo.model.entity;

import com.backend.demo.model.enums.InscripcionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "inscripciones",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_usuario_evento",
                        columnNames = {"usuario_id", "evento_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Event evento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InscripcionStatus estado = InscripcionStatus.PENDIENTE;

    //QR / Check-in
    //Token único por inscripción — se genera al crear, nunca cambia.
    @Column(name = "qr_token", unique = true, nullable = false, updatable = false)
    private String qrToken;

    //Indica si el asistente ya realizó check-in.
    @Column(name = "asistio", nullable = false)
    private boolean asistio = false;

    // Fecha/hora en que se registró el check-in.
    @Column(name = "checkin_at")
    private LocalDateTime checkinAt;

    // Auditoría
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        // Garantiza token aunque el builder no lo haya pasado
        if (this.qrToken == null || this.qrToken.isBlank()) {
            this.qrToken = UUID.randomUUID().toString();
        }
    }

}