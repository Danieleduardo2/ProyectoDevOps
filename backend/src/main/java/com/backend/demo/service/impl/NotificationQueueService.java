package com.backend.demo.service.impl;

import com.backend.demo.dto.notification.EmailNotificationRequest;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadFactory;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationQueueService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:no-reply@example.com}")
    private String mailFrom;

    private final BlockingQueue<EmailNotificationRequest> queue = new LinkedBlockingQueue<>();
    private final ExecutorService worker = Executors.newSingleThreadExecutor(new NamedDaemonThreadFactory("email-notification-worker-"));

    @PostConstruct
    public void start() {
        worker.execute(this::runWorker);
        log.info("Email notification worker started");
    }

    @PreDestroy
    public void stop() {
        worker.shutdownNow();
        log.info("Email notification worker stopped");
    }

    public void enqueue(EmailNotificationRequest request) {
        log.info("Enqueued email to {}", request.getTo());
        queue.offer(request);
    }

    private void runWorker() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                EmailNotificationRequest request = queue.take();
                processRequest(request);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
                log.info("Notification worker interrupted");
            } catch (Exception ex) {
                log.error("Error procesando notificación de correo", ex);
            }
        }
    }

    private void processRequest(EmailNotificationRequest request) {
        log.info("Worker started email to {}", request.getTo());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, request.getQrCodeBytes() != null, StandardCharsets.UTF_8.name());
            helper.setFrom(mailFrom);
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getHtmlBody(), true);
            if (request.getQrCodeBytes() != null) {
                helper.addInline(request.getQrContentId(), new ByteArrayResource(request.getQrCodeBytes()), "image/png");
            }
            mailSender.send(message);
            log.info("Worker finished email to {}", request.getTo());
        } catch (Exception ex) {
            log.error("Fallo al enviar correo a {}", request.getTo(), ex);
        }
    }

    private static class NamedDaemonThreadFactory implements ThreadFactory {

        private final String prefix;
        private int index = 0;

        NamedDaemonThreadFactory(String prefix) {
            this.prefix = prefix;
        }

        @Override
        public Thread newThread(Runnable r) {
            Thread thread = new Thread(r, prefix + index++);
            thread.setDaemon(true);
            return thread;
        }
    }
}
