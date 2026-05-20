package com.backend.demo.service.impl;

import com.backend.demo.dto.notification.EmailNotificationRequest;
import com.backend.demo.model.entity.Event;
import com.backend.demo.model.entity.Inscripcion;
import com.backend.demo.service.IEmailNotificationService;
import com.backend.demo.util.QrCodeGenerator;
import com.google.zxing.WriterException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailNotificationServiceImpl implements IEmailNotificationService {

    private final NotificationQueueService queueService;

    @Override
    public void sendInscripcionConfirmation(@NotNull Inscripcion inscripcion) {
        try {
            byte[] qrBytes = QrCodeGenerator.generateQrCode(
                    buildQrText(inscripcion),
                    300,
                    300
            );
            String body = buildInscripcionHtml(inscripcion);
            queueService.enqueue(EmailNotificationRequest.builder()
                    .to(inscripcion.getUsuario().getEmail())
                    .subject("Confirmación de inscripción al evento: " + inscripcion.getEvento().getNombre())
                    .htmlBody(body)
                    .qrCodeBytes(qrBytes)
                    .build());
        } catch (IOException | WriterException ex) {
            log.error("No se pudo generar el código QR para la inscripción {}", inscripcion.getId(), ex);
            queueService.enqueue(EmailNotificationRequest.builder()
                    .to(inscripcion.getUsuario().getEmail())
                    .subject("Confirmación de inscripción al evento: " + inscripcion.getEvento().getNombre())
                    .htmlBody(buildInscripcionHtml(inscripcion))
                    .build());
        }
    }

    @Override
    public void sendCheckinConfirmation(@NotNull Inscripcion inscripcion) {
        String body = "<p>Hola " + inscripcion.getUsuario().getNombre() + ",</p>"
                + "<p>Tu asistencia al evento <strong>" + inscripcion.getEvento().getNombre() + "</strong> ha sido registrada con éxito.</p>"
                + "<p>Fecha: " + inscripcion.getEvento().getFecha().format(DateTimeFormatter.ISO_DATE) + "</p>"
                + "<p>Hora: " + inscripcion.getEvento().getHora().format(DateTimeFormatter.ISO_TIME) + "</p>"
                + "<p>Ubicación: " + inscripcion.getEvento().getUbicacion() + "</p>";

        queueService.enqueue(EmailNotificationRequest.builder()
                .to(inscripcion.getUsuario().getEmail())
                .subject("Check-in confirmado para " + inscripcion.getEvento().getNombre())
                .htmlBody(body)
                .build());
    }

    @Override
    public void sendEventUpdateNotifications(@NotNull Event event, List<Inscripcion> inscripciones) {
        if (inscripciones == null || inscripciones.isEmpty()) {
            return;
        }

        int batchSize = 50;
        for (int start = 0; start < inscripciones.size(); start += batchSize) {
            int end = Math.min(start + batchSize, inscripciones.size());
            List<Inscripcion> batch = inscripciones.subList(start, end);
            log.info("Encolando actualización de evento {} para {} asistentes", event.getId(), batch.size());
            batch.forEach(inscripcion -> {
                queueService.enqueue(EmailNotificationRequest.builder()
                        .to(inscripcion.getUsuario().getEmail())
                        .subject("Actualización importante del evento: " + event.getNombre())
                        .htmlBody(buildEventUpdateHtml(event, inscripcion))
                        .build());
            });
        }
    }

    @Override
    public void sendEventReminders(@NotNull List<Inscripcion> inscripciones) {
        if (inscripciones == null || inscripciones.isEmpty()) {
            return;
        }

        inscripciones.forEach(inscripcion -> {
            queueService.enqueue(EmailNotificationRequest.builder()
                    .to(inscripcion.getUsuario().getEmail())
                    .subject("Recordatorio: tu evento es en 24 horas")
                    .htmlBody(buildReminderHtml(inscripcion))
                    .build());
        });
    }

    private String buildQrText(Inscripcion inscripcion) {
        return "inscripcion:" + inscripcion.getId()
                + "|evento:" + inscripcion.getEvento().getNombre()
                + "|usuario:" + inscripcion.getUsuario().getEmail();
    }

    private String buildInscripcionHtml(Inscripcion inscripcion) {
        return "<p>Hola " + inscripcion.getUsuario().getNombre() + ",</p>"
                + "<p>Tu inscripción al evento <strong>" + inscripcion.getEvento().getNombre() + "</strong> ha sido confirmada.</p>"
                + "<p>Fecha: " + inscripcion.getEvento().getFecha().format(DateTimeFormatter.ISO_DATE) + "</p>"
                + "<p>Hora: " + inscripcion.getEvento().getHora().format(DateTimeFormatter.ISO_TIME) + "</p>"
                + "<p>Ubicación: " + inscripcion.getEvento().getUbicacion() + "</p>"
                + "<p>Presenta este código QR en el acceso:</p>"
                + "<img src=\"cid:qrCode\" alt=\"Código QR de inscripción\" />";
    }

    private String buildEventUpdateHtml(Event event, Inscripcion inscripcion) {
        return "<p>Hola " + inscripcion.getUsuario().getNombre() + ",</p>"
                + "<p>El evento <strong>" + event.getNombre() + "</strong> ha sido actualizado.</p>"
                + "<p>Fecha: " + event.getFecha().format(DateTimeFormatter.ISO_DATE) + "</p>"
                + "<p>Hora: " + event.getHora().format(DateTimeFormatter.ISO_TIME) + "</p>"
                + "<p>Ubicación: " + event.getUbicacion() + "</p>"
                + "<p>Por favor, verifica los cambios y ajusta tu agenda si es necesario.</p>";
    }

    private String buildReminderHtml(Inscripcion inscripcion) {
        return "<p>Hola " + inscripcion.getUsuario().getNombre() + ",</p>"
                + "<p>Este es un recordatorio de que tu evento <strong>" + inscripcion.getEvento().getNombre() + "</strong> será dentro de 24 horas.</p>"
                + "<p>Fecha: " + inscripcion.getEvento().getFecha().format(DateTimeFormatter.ISO_DATE) + "</p>"
                + "<p>Hora: " + inscripcion.getEvento().getHora().format(DateTimeFormatter.ISO_TIME) + "</p>"
                + "<p>Ubicación: " + inscripcion.getEvento().getUbicacion() + "</p>";
    }
}
