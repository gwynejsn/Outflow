package com.gwynejsn.service;

import com.gwynejsn.dto.JwtDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    @Value("${security.jwt.expires}")
    private Long JWT_EXPIRES_IN_MINUTES;
    @Value("${security.jwt.secret}")
    private String JWT_SECRET;

    public AuthService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public JwtDto login(String username, String password) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(username, password));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Date expiration = new Date(System.currentTimeMillis() + JWT_EXPIRES_IN_MINUTES * 60 * 1000);

        String jwtToken = Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(Instant.now()))
                .expiration(expiration)
                .signWith(getSignInKey())
                .compact();

        return new JwtDto(
                jwtToken,
                expiration.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
        );
    }

    private SecretKey getSignInKey() {
        //  SignatureAlgorithm.HS256
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims validateToken(String token) throws JwtException {
        return  Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getPayload();
    }
}
