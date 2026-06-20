package com.backend.demo.service.impl;

import com.backend.demo.dto.request.RegisterRequest;
import com.backend.demo.dto.response.UserResponse;
import com.backend.demo.exception.EmailAlreadyExistsException;
import com.backend.demo.exception.ResourceNotFoundException;
import com.backend.demo.mapper.UserMapper;
import com.backend.demo.model.entity.Role;
import com.backend.demo.model.entity.User;
import com.backend.demo.model.enums.ERole;
import com.backend.demo.repository.RoleRepository;
import com.backend.demo.repository.UserRepository;
import com.backend.demo.repository.UserActionRepository;
import com.backend.demo.security.services.UserInfoDetail;
import com.backend.demo.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import com.backend.demo.model.entity.UserAction;
import com.backend.demo.dto.response.UserActionResponse;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserActionRepository userActionRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // REGISTRO
    @Override
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "El correo ya está registrado: " + request.getEmail()
            );
        }

        User user = new User();
        user.setNombre(request.getNombre());
        user.setApellido(request.getApellido());
        user.setTelefono(request.getTelefono());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActivo(true);


        Role roleUser = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("ROLE_USER no existe"));

        user.getRoles().add(roleUser);

        User saved = userRepository.save(user);
        logUserAction(saved.getEmail(), "CREACION", "Usuario registrado en el sistema");

        return userMapper.toResponse(saved);
    }

    // LISTAR
    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(String nombre, String apellido, Pageable pageable) {
        return userRepository.findByFilters(nombre, apellido, pageable)
                .map(userMapper::toResponse);
    }

    // USUARIO AUTENTICADO
    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserInfoDetail user)) {
            throw new RuntimeException("Usuario no autenticado");
        }

        return userMapper.toResponse(findUserById(user.getId()));
    }

    // BUSCAR POR ID
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return userMapper.toResponse(findUserById(id));
    }

    // ELIMINAR USUARIO
    @Override
    public void deleteUser(Long id) {
        User user = findUserById(id);
        logUserAction(user.getEmail(), "ELIMINACION", "Usuario eliminado del sistema");
        userRepository.delete(user);
    }

    // ACTIVAR USUARIO
    @Override
    public UserResponse activateUser(Long id) {
        User user = findUserById(id);
        user.setActivo(true);
        User saved = userRepository.save(user);
        logUserAction(saved.getEmail(), "ACTIVACION", "Usuario activado por administrador");
        return userMapper.toResponse(saved);
    }

    // DESACTIVAR USUARIO
    @Override
    public UserResponse deactivateUser(Long id) {
        User user = findUserById(id);
        user.setActivo(false);
        User saved = userRepository.save(user);
        logUserAction(saved.getEmail(), "DESACTIVACION", "Usuario desactivado por administrador");
        return userMapper.toResponse(saved);
    }

    // ASIGNACIÓN DE ROLES
    @Override
    public UserResponse assignRoles(Long id, Set<String> roleNames) {

        User user = findUserById(id);

        Set<Role> roles = roleNames.stream()
                .map(this::mapToRole)
                .collect(Collectors.toSet());

        user.setRoles(roles);

        return userMapper.toResponse(userRepository.save(user));
    }


    // MÉTODOS PRIVADOS

    private void logUserAction(String usuario, String tipo, String descripcion) {
        try {
            UserAction action = UserAction.builder()
                    .usuario(usuario)
                    .tipo(tipo)
                    .descripcion(descripcion)
                    .fecha(LocalDateTime.now())
                    .build();
            userActionRepository.save(action);
        } catch (Exception e) {
            System.err.println("Error guardando historial: " + e.getMessage());
        }
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    private Role mapToRole(String name) {
        try {
            var eRole = com.backend.demo.model.enums.ERole
                    .valueOf("ROLE_" + name.toUpperCase());

            return roleRepository.findByName(eRole)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Rol no encontrado: " + name));

        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol no válido: " + name);
        }
    }

    @Override
    public Page<UserActionResponse> getUserActions(Pageable pageable) {
        return userActionRepository.findAll(pageable)
                .map(action -> UserActionResponse.builder()
                        .id(action.getId())
                        .usuario(action.getUsuario())
                        .accion(action.getDescripcion())
                        .fecha(action.getFecha())
                        .build()
                );
    }
}