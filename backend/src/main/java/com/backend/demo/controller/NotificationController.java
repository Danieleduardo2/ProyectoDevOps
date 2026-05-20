package com.backend.demo.controller;

import com.backend.demo.dto.notification.CheckInRequest;
import com.backend.demo.exception.ResourceNotFoundException;
import com.backend.demo.model.entity.Inscripcion;
import com.backend.demo.model.enums.InscripcionStatus;
import com.backend.demo.repository.InscripcionRepository;
import com.backend.demo.service.IEmailNotificationService;
import com.backend.demo.service.IReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final IReminderService reminderService;
    private final IEmailNotificationService emailNotificationService;
    private final InscripcionRepository inscripcionRepository;

    @PostMapping("/reminders/run")
    public ResponseEntity<Void> triggerReminders() {
        reminderService.sendPendingReminders();
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @PostMapping("/checkin")
    public ResponseEntity<Void> confirmCheckIn(@Valid @RequestBody CheckInRequest request) {
        Inscripcion inscripcion = inscripcionRepository.findById(request.getInscripcionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inscripción no encontrada con ID: " + request.getInscripcionId()));

        if (inscripcion.getEstado() != InscripcionStatus.CONFIRMADA) {
            throw new ResourceNotFoundException("Solo se puede enviar confirmación de check-in para inscripciones confirmadas");
        }

        emailNotificationService.sendCheckinConfirmation(inscripcion);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
