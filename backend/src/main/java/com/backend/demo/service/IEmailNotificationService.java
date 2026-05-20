package com.backend.demo.service;

import com.backend.demo.model.entity.Event;
import com.backend.demo.model.entity.Inscripcion;

import java.util.List;

public interface IEmailNotificationService {

    void sendInscripcionConfirmation(Inscripcion inscripcion);

    void sendCheckinConfirmation(Inscripcion inscripcion);

    void sendEventUpdateNotifications(Event event, List<Inscripcion> inscripciones);

    void sendEventReminders(List<Inscripcion> inscripciones);
}
