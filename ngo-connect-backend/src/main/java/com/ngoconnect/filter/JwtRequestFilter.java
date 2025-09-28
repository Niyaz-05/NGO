package com.ngoconnect.filter;

import com.ngoconnect.service.UserDetailsServiceImpl;
import com.ngoconnect.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        final String authorizationHeader = request.getHeader("Authorization");

        logger.info("Processing request to: {}", requestURI);
        logger.info("Authorization header present: {}", authorizationHeader != null);

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            logger.info("JWT token extracted: {}", jwt != null ? "present" : "null");
            try {
                username = jwtUtil.extractUsername(jwt);
                logger.info("Username extracted from JWT: {}", username);
            } catch (Exception ex) {
                logger.warn("Unable to extract username from JWT: " + ex.getMessage());
            }
        } else {
            logger.info("No Authorization header or doesn't start with Bearer");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                logger.info("User loaded: {}, authorities: {}", userDetails.getUsername(),
                        userDetails.getAuthorities());

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.info("Authentication set successfully for user: {} with authorities: {}",
                            username, userDetails.getAuthorities());
                } else {
                    logger.warn("JWT token validation failed for user: {}", username);
                }
            } catch (Exception ex) {
                logger.error("Error loading user details for username: {}, error: {}", username, ex.getMessage());
            }
        } else if (username == null) {
            logger.info("No username extracted from JWT");
        } else {
            logger.info("Authentication already exists in SecurityContext");
        }

        chain.doFilter(request, response);
    }
}
