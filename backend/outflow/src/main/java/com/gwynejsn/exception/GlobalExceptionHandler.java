package com.gwynejsn.exception;

import com.gwynejsn.dto.exception.ExceptionDto;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ExceptionDto> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(e.getExceptionDto(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AlreadyExistException.class)
    public ResponseEntity<ExceptionDto> handleAlreadyExistException(AlreadyExistException e) {
        return new ResponseEntity<>(e.getExceptionDto(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpiredJwt(ExpiredJwtException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token has expired");
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<String> handleInvalidSignature(SignatureException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token signature");
    }
}
