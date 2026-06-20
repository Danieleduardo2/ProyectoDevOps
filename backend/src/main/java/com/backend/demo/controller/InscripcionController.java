package com.backend.demo.controller;

import com.backend.demo.dto.request.CheckinRequest;
import com.backend.demo.dto.request.CreateInscripcionRequest;
import com.backend.demo.dto.response.CheckinResponse;
import com.backend.demo.dto.response.EventoInscritosResponse;
import com.backend.demo.dto.response.InscripcionResponse;
import com.backend.demo.dto.response.ReporteAsistenciaResponse;
import com.backend.demo.service.IInscripcionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

/**
 * Controller para gestionar inscripciones a eventos
 * Proporciona endpoints para crear, consultar, cancelar y eliminar inscripciones
 */
@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private IInscripcionService inscripcionService;

    /**
     * Crear una nueva inscripción
     * POST /api/inscripciones
     * @param request datos de la nueva inscripción
     * @return 201 Created con la inscripción creada
     */
    @PostMapping
    public ResponseEntity<InscripcionResponse> createInscripcion(
            @Valid @RequestBody CreateInscripcionRequest request) {
        InscripcionResponse response = inscripcionService.createInscripcion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Obtener una inscripción por su ID
     * GET /api/inscripciones/{id}
     * @param id identificador de la inscripción
     * @return 200 OK con la inscripción
     */
    @GetMapping("/{id}")
    public ResponseEntity<InscripcionResponse> getInscripcionById(@PathVariable Long id) {
        InscripcionResponse response = inscripcionService.getInscripcionById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener las inscripciones de un usuario con paginación
     * GET /api/usuarios/{usuarioId}/inscripciones
     * @param usuarioId ID del usuario
     * @param pageable información de paginación
     * @return 200 OK con Page de inscripciones
     */
    @GetMapping("/usuarios/{usuarioId}/inscripciones")
    public ResponseEntity<Page<InscripcionResponse>> getInscripcionesByUsuario(
            @PathVariable Long usuarioId,
            Pageable pageable) {
        Page<InscripcionResponse> response = inscripcionService.getInscripcionesByUsuario(usuarioId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener las inscripciones de un evento con estadísticas de cupos
     * GET /api/eventos/{eventoId}/inscritos
     * @param eventoId ID del evento
     * @param pageable información de paginación
     * @return 200 OK con EventoInscritosResponse (inscripciones paginadas + cupos)
     */
    @GetMapping("/eventos/{eventoId}/inscritos")
    public ResponseEntity<EventoInscritosResponse> getInscripcionesByEvento(
            @PathVariable Long eventoId,
            Pageable pageable) {
        EventoInscritosResponse response = inscripcionService.getInscripcionesByEvento(eventoId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancelar una inscripción (cambio lógico de estado)
     * DELETE /api/inscripciones/{id}
     * @param id identificador de la inscripción a cancelar
     * @return 200 OK
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarInscripcion(@PathVariable Long id) {
        inscripcionService.cancelarInscripcion(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Eliminar una inscripción físicamente
     * DELETE /api/inscripciones/{id}/eliminar
     * @param id identificador de la inscripción a eliminar
     * @return 204 No Content
     */
    @DeleteMapping("/{id}/eliminar")
    public ResponseEntity<Void> deleteInscripcion(@PathVariable Long id) {
        inscripcionService.deleteInscripcion(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Devuelve la URL del código QR de la inscripción.
     */
    @GetMapping("/inscripciones/{id}/qr")
    public ResponseEntity<Map<String, String>> getQr(@PathVariable Long id) {
        String url = inscripcionService.getQrUrl(id);
        return ResponseEntity.ok(Map.of("qrUrl", url));
    }

    // ── Check-in ─────────────────────────────────────────────────

    /**
     * Valida el QR y registra la asistencia del participante.
     */
    @PostMapping("/eventos/{eventoId}/checkin")
    public ResponseEntity<CheckinResponse> checkin(
            @PathVariable Long eventoId,
            @Valid @RequestBody CheckinRequest request) {
        return ResponseEntity.ok(inscripcionService.realizarCheckin(eventoId, request));
    }

    // Reporte

    /**
     * Retorna inscritos vs asistentes con detalle completo.
     */
    @GetMapping("/eventos/{id}/reporte")
    public ResponseEntity<ReporteAsistenciaResponse> reporte(@PathVariable Long id) {
        return ResponseEntity.ok(inscripcionService.getReporteAsistencia(id));
    }
}