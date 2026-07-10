package com.gwynejsn.dto;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ExceptionDto(
        String title,
        String description,
        HttpStatus httpStatus,
        LocalDateTime errorDateTime
) {
}
