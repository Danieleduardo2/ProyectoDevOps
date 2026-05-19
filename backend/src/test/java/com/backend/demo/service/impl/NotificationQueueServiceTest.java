package com.backend.demo.service.impl;

import com.backend.demo.dto.notification.EmailNotificationRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationQueueServiceTest {

    @InjectMocks
    private NotificationQueueService notificationQueueService;

    @Mock
    private JavaMailSender mailSender;

    @BeforeEach
    void setUp() {
        // 1. Inyectamos manualmente la variable que Spring inyectaría con @Value
        ReflectionTestUtils.setField(notificationQueueService, "mailFrom", "no-reply@example.com");
        
        // 2. Iniciamos el worker manualmente (lo que haría @PostConstruct)
        notificationQueueService.start();
    }

    @AfterEach
    void tearDown() {
        // 3. Detenemos el worker de forma limpia (lo que haría @PreDestroy)
        notificationQueueService.stop();
    }

    @Test
    void shouldEnqueueEmailAndProcessWithoutBlocking() throws Exception {
        // Configuramos el mock para la creación del mensaje
        MimeMessage message = new MimeMessage((Session) null);
        when(mailSender.createMimeMessage()).thenReturn(message);

        // Configuramos el CountDownLatch para esperar la respuesta asíncrona
        CountDownLatch latch = new CountDownLatch(1);
        doAnswer(invocation -> {
            latch.countDown();
            return null;
        }).when(mailSender).send(any(MimeMessage.class));

        // Preparamos los datos de prueba
        EmailNotificationRequest request = EmailNotificationRequest.builder()
                .to("test@example.com")
                .subject("Prueba de cola SMTP")
                .htmlBody("<p>Este es un correo de prueba.</p>")
                .build();

        // Ejecutamos el método que encola
        notificationQueueService.enqueue(request);

        // Esperamos máximo 5 segundos para que el hilo secundario procese la cola
        boolean processed = latch.await(5, TimeUnit.SECONDS);
        
        // Verificamos los resultados
        assertTrue(processed, "El correo encolado debe ser procesado por el worker");
        verify(mailSender, times(1)).send(message);
    }
}