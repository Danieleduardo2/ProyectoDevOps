package com.backend.demo.service.impl;

import com.backend.demo.dto.notification.EmailNotificationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class NotificationQueueServiceTest {

    @Autowired
    private NotificationQueueService notificationQueueService;

    @MockBean
    private JavaMailSender mailSender;

    @Test
    void shouldEnqueueEmailAndProcessWithoutBlocking() throws Exception {
        MimeMessage message = new MimeMessage((Session) null);
        when(mailSender.createMimeMessage()).thenReturn(message);

        CountDownLatch latch = new CountDownLatch(1);
        doAnswer(invocation -> {
            latch.countDown();
            return null;
        }).when(mailSender).send(any(MimeMessage.class));

        EmailNotificationRequest request = EmailNotificationRequest.builder()
                .to("test@example.com")
                .subject("Prueba de cola SMTP")
                .htmlBody("<p>Este es un correo de prueba.</p>")
                .build();

        notificationQueueService.enqueue(request);

        boolean processed = latch.await(5, TimeUnit.SECONDS);
        assertTrue(processed, "El correo encolado debe ser procesado por el worker");
        verify(mailSender, times(1)).send(message);
    }
}
