package com.backend.demo.service.impl;

import com.backend.demo.dto.auth.LoginRequest;
import com.backend.demo.dto.auth.LoginResponse;
import com.backend.demo.exception.AccountLockedException;
import com.backend.demo.exception.BadRequestException;
import com.backend.demo.exception.ResourceNotFoundException;
import com.backend.demo.security.jwt.JwtUtil;
import com.backend.demo.service.IAuthService;
import com.backend.demo.model.entity.Role;
import com.backend.demo.model.entity.User;
import com.backend.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private static final int MAX_FAILED_ATTEMPTS = 3;

    @Override
    public LoginResponse login(LoginRequest loginRequestDTO) {

        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con email: " + loginRequestDTO.getEmail()));

        // Si está bloqueado
        if (user.isLocked()) {
            throw new AccountLockedException("Cuenta bloqueada por múltiples intentos fallidos");
        }

        try {
            // Intentar login
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.getEmail(),
                            loginRequestDTO.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Login correcto → resetear intentos
            user.setFailedAttempts(0);
            userRepository.save(user);

            String token = jwtUtil.generateToken(authentication.getName());

            Set<String> roles = user.getRoles().stream()
                    .map(Role::getName)
                    .map(Enum::name)
                    .collect(Collectors.toSet());

            return new LoginResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getNombre(),
                    user.getApellido(),
                    roles
            );

        } catch (Exception e) {

            //Login fallido → aumentar intentos
            int attempts = user.getFailedAttempts() + 1;
            user.setFailedAttempts(attempts);

            //Si llega al límite → bloquear
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLocked(true);
            }

            userRepository.save(user);

            throw new BadRequestException("Credenciales incorrectas. Intentos fallidos: " + attempts + "/" + MAX_FAILED_ATTEMPTS);
        }
    }

}