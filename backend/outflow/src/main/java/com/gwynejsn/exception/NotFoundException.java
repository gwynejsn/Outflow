package com.gwynejsn.exception;

import com.gwynejsn.dto.exception.ExceptionDto;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class NotFoundException extends RuntimeException {
    private final ExceptionDto exceptionDto;

    public NotFoundException(String message) {
        super(message);

        this.exceptionDto = new ExceptionDto(
                message,
                "The requested resource could not be found.",
                HttpStatus.NOT_FOUND,
                LocalDateTime.now()
        );
    }

    public ExceptionDto getExceptionDto() {
        return exceptionDto;
    }
}