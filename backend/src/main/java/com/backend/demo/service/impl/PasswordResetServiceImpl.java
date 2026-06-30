package com.backend.demo.service.impl;

import com.backend.demo.exception.BadRequestException;
import com.backend.demo.exception.InvalidTokenException;
import com.backend.demo.exception.ResourceNotFoundException;
import com.backend.demo.model.entity.PasswordResetToken;
import com.backend.demo.repository.PasswordResetTokenRepository;
import com.backend.demo.repository.UserRepository;
import com.backend.demo.service.IEmailNotificationService;
import com.backend.demo.service.IPasswordResetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PasswordResetServiceImpl implements IPasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IEmailNotificationService emailNotificationService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void forgotPassword(String email) {

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        resetToken.setUsed(false);
        resetToken.setCreatedAt(LocalDateTime.now());

        tokenRepository.save(resetToken);

        String link = frontendUrl + "/reset-password?token=" + token;

        log.info("=================================");
        log.info(" RESET PASSWORD LINK:");
        log.info(link);
        log.info("=================================");

        // Enviar el correo real
        emailNotificationService.sendPasswordResetEmail(user.getEmail(), user.getNombre(), link);
    }

    @Override
    public void resetPassword(String token, String newPassword) {

        var resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Token inválido"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("Token ya usado");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token expirado");
        }

        var user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // marcar como usado
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}