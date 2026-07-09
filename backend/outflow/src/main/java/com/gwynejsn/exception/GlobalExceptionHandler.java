package com.gwynejsn.exception;

import com.gwynejsn.dto.ExceptionDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.gwynejsn.controller")
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ExceptionDto> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(e.getExceptionDto(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AlreadyExistException.class)
    public ResponseEntity<ExceptionDto> handleAlreadyExistException(AlreadyExistException e) {
        return new ResponseEntity<>(e.getExceptionDto(), HttpStatus.NOT_FOUND);
    }
}
