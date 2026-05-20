package com.backend.demo.exception;

/**
 * Excepción lanzada cuando un rol no es encontrado en la base de datos.
 * Se utiliza durante la inicialización de datos y en servicios de gestión de roles.
 */
public class RoleNotFoundException extends RuntimeException {
    
    public RoleNotFoundException(String message) {
        super(message);
    }

    public RoleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
