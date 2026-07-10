package com.gwynejsn.exception;

import com.gwynejsn.dto.ExceptionDto;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class AlreadyExistException extends RuntimeException {
    private final ExceptionDto exceptionDto;

    public AlreadyExistException(String message) {
        super(message);

        this.exceptionDto = new ExceptionDto(
                message,
                "The resource you are trying to create already exists.",
                HttpStatus.CONFLICT,
                LocalDateTime.now()
        );
    }

    public ExceptionDto getExceptionDto() {
        return exceptionDto;
    }
}