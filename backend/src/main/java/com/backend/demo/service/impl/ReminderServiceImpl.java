package com.backend.demo.service.impl;

import com.backend.demo.model.entity.Inscripcion;
import com.backend.demo.model.enums.EventStatus;
import com.backend.demo.model.enums.InscripcionStatus;
import com.backend.demo.repository.InscripcionRepository;
import com.backend.demo.service.IEmailNotificationService;
import com.backend.demo.service.IReminderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReminderServiceImpl implements IReminderService {

    private final InscripcionRepository inscripcionRepository;
    private final IEmailNotificationService emailNotificationService;

    @Override
    @Scheduled(cron = "0 0 7 * * ?")
    public void sendPendingReminders() {
        LocalDate targetDate = LocalDate.now().plusDays(1);
        List<Inscripcion> inscripciones = inscripcionRepository
                .findByEvento_FechaAndEvento_EstadoAndEstado(
                        targetDate,
                        EventStatus.PUBLISHED,
                        InscripcionStatus.CONFIRMADA
                );

        log.info("Reminders programados: {} inscripciones para evento en {}", inscripciones.size(), targetDate);
        emailNotificationService.sendEventReminders(inscripciones);
    }
}
