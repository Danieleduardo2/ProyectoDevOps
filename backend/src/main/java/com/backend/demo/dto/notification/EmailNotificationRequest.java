package com.backend.demo.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificationRequest {
    private String to;
    private String subject;
    private String htmlBody;
    private byte[] qrCodeBytes;
    private String qrContentId = "qrCode";
}
