package com.example.backend.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ApiAuthorizationFilter extends OncePerRequestFilter {

    static Logger LOGGER = Logger.getLogger(ApiAuthorizationFilter.class.getName());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        LOGGER.log(Level.WARNING, "doing filter");
        LOGGER.log(Level.WARNING, request.getServletPath());
        if (request.getServletPath().equals("/api/v1/accounts/login")
                || request.getServletPath().equals("/api/v1/accounts/register")
                || request.getServletPath().equals("/api/v1/accounts/get")
                || request.getServletPath().equals("/api/v1/transactions/get")
                || request.getServletPath().equals("/api/v1/loans/get")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        authorizationHeader = authorizationHeader.replace("Bearer", "").trim();
        JWTVerifier jwtVerifier = JWT.require(SecurityBean.algorithm()).build();
        DecodedJWT decodedJWT = jwtVerifier.verify(authorizationHeader);
        String username = decodedJWT.getSubject();
        String role = decodedJWT.getClaim("role").toString();
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        LOGGER.log(Level.WARNING, role);
        LOGGER.log(Level.WARNING, username);
        filterChain.doFilter(request, response);
    }
}
