package com.gwynejsn.exception;

import com.gwynejsn.dto.exception.ExceptionDto;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class BadRequestException extends RuntimeException {
    private final ExceptionDto exceptionDto;

    public BadRequestException(String message) {
        super(message);

        this.exceptionDto = new ExceptionDto(
                message,
                "Bad request parameters or invalid operation.",
                HttpStatus.BAD_REQUEST,
                LocalDateTime.now()
        );
    }

    public ExceptionDto getExceptionDto() {
        return exceptionDto;
    }
}
