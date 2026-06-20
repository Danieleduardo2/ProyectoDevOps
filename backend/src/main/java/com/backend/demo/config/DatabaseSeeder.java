package com.backend.demo.config;

import com.backend.demo.model.entity.Role;
import com.backend.demo.model.entity.User;
import com.backend.demo.model.enums.ERole;
import com.backend.demo.repository.RoleRepository;
import com.backend.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@allevents.com}")
    private String defaultAdminEmail;

    @Value("${app.admin.password:admin123}")
    private String defaultAdminPassword;

    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Fix database schema mismatch for user_actions due to entity changes
        try {
            jdbcTemplate.execute("ALTER TABLE user_actions DROP COLUMN IF EXISTS user_id CASCADE");
        } catch (Exception e) {
            System.err.println("Warning dropping user_id: " + e.getMessage());
        }
        
        try {
            jdbcTemplate.execute("ALTER TABLE user_actions ADD COLUMN IF NOT EXISTS usuario VARCHAR(255)");
            jdbcTemplate.execute("UPDATE user_actions SET usuario = 'sistema@allevents.com' WHERE usuario IS NULL");
        } catch (Exception e) {
            System.err.println("Warning adding usuario: " + e.getMessage());
        }

        // 1. Asegurarnos de que los roles existan
        Role roleAdmin = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_ADMIN).build()));
                
        Role roleUser = roleRepository.findByName(ERole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_USER).build()));

        // 2. Asegurarnos de que exista un superusuario administrador por defecto
        if (!userRepository.existsByEmail(defaultAdminEmail)) {
            User admin = new User();
            admin.setNombre("Super");
            admin.setApellido("Administrador");
            admin.setEmail(defaultAdminEmail);
            admin.setTelefono("0000000000");
            admin.setPassword(passwordEncoder.encode(defaultAdminPassword)); // Contraseña segura inyectada
            admin.setActivo(true);
            admin.getRoles().add(roleAdmin);
            admin.getRoles().add(roleUser);
            
            userRepository.save(admin);
            System.out.println("==================================================");
            System.out.println("ADMINISTRADOR CREADO CON ÉXITO");
            System.out.println("Correo: " + defaultAdminEmail);
            System.out.println("==================================================");
        }
    }
}
