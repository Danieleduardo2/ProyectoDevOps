package com.backend.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class QrService {

    @Value("${qr.api.url:https://api.qrserver.com/v1/create-qr-code/}")
    private String qrApiUrl;

    @Value("${qr.size:300x300}")
    private String qrSize;

    public String generarUrlQr(String token) {
        String url = qrApiUrl + "?size=" + qrSize + "&data=" + token + "&ecc=M";
        log.debug("QR generado para token={} → {}", token, url);
        return url;
    }
}