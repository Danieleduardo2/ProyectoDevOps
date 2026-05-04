package com.backend.demo.model.entity;

import com.backend.demo.model.enums.InscripcionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}