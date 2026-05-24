package com.backend.demo.pipeline;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class PipelineFailureTest {

    @Test
    void shouldFailPipeline() {
        assertEquals(1, 2);
    }
}