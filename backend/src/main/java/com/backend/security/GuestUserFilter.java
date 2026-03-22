package com.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filter to handle guest user authentication
 * Checks for guest session indicators and creates a temporary authentication
 * context
 */
@Component
public class GuestUserFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Check if this is a guest user request
        String userRole = request.getHeader("X-User-Role");
        String authStatus = request.getHeader("X-Auth-Status");

        // Alternative: Check for guest cookie or session attribute
        // This allows frontend to mark itself as guest
        if ("GUEST".equals(userRole) || "guest".equals(authStatus)) {
            // Create a minimal authentication for guest user
            // This allows them to bypass certain security checks while still being tracked
            UsernamePasswordAuthenticationToken guestAuth = new UsernamePasswordAuthenticationToken(
                    "guest@eventwear.com",
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST")));

            SecurityContextHolder.getContext().setAuthentication(guestAuth);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Don't filter static resources
        String path = request.getRequestURI();
        return path.startsWith("/static/") ||
                path.startsWith("/public/") ||
                path.endsWith(".css") ||
                path.endsWith(".js") ||
                path.endsWith(".png") ||
                path.endsWith(".jpg");
    }
}