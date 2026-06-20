package com.backend.demo.repository;

import com.backend.demo.model.entity.Event;
import com.backend.demo.model.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Buscar por creador
    List<Event> findByCreatedById(Long userId);

    // Buscar por estado
    List<Event> findByEstado(EventStatus estado);

    // Filtrar por nombre y estado con paginación
    @Query("""
    SELECT e FROM Event e
    WHERE (:nombre IS NULL OR LOWER(CAST(e.nombre AS string))
           LIKE LOWER(CONCAT('%', CAST(:nombre AS string), '%')))
    AND (:estado IS NULL OR e.estado = :estado)
    AND (:categoria IS NULL OR e.categoria = :categoria)
""")
    Page<Event> findByFilters(
            @Param("nombre") String nombre,
            @Param("estado") EventStatus estado,
            @Param("categoria") String categoria,
            Pageable pageable
    );
}